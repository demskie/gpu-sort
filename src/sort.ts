import * as gpu from "gpu-compute";
import * as index from "./index";
import { Limiter } from "./limiter";
import { BitonicUniformGenerator } from "./uniforms";

const limiter = new Limiter();
limiter.syncronizer = (fn: () => void) => {
  gpu.waitForSyncWithCallback(() => fn());
};

export function bitonicSort(array: index.SortableTypedArrays, kind: string) {
  const bytes = new Uint8Array(array.buffer);
  const target = getRenderTarget(bytes);
  const emptyTexelCount = target.width * target.width - bytes.length / 4;
  const uniformGenerator = new BitonicUniformGenerator(target, kind, emptyTexelCount);
  target.pushTextureData(bytes);
  for (let obj of uniformGenerator.generateShaderAndUniforms()) {
    target.compute(obj.shader, obj.uniforms);
  }
  pullPixels(target, emptyTexelCount, bytes);
  target.delete();
}

export function bitonicSortAsync(array: index.SortableTypedArrays, kind: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const bytes = new Uint8Array(array.buffer);
    const target = getRenderTarget(bytes);
    const emptyTexelCount = target.width * target.width - bytes.length / 4;
    const uniformGenerator = new BitonicUniformGenerator(target, kind, emptyTexelCount);
    target
      .pushTextureDataAsync(bytes)
      .then(() => {
        for (let obj of uniformGenerator.generateShaderAndUniforms()) {
          limiter.addWork(() => target.compute(obj.shader, obj.uniforms));
        }
        limiter.onceFinished(() => {
          pullPixelsAsync(target, emptyTexelCount, bytes)
            .then(() => {
              target.delete();
              resolve();
            })
            .catch(err => {
              target.delete();
              reject(err);
            });
        });
      })
      .catch(err => {
        target.delete();
        reject(err);
      });
  });
}

function getRenderTarget(bytes: Uint8Array) {
  const gl = gpu.getWebGLContext();
  const framebufferLimit = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);
  for (let width = 1; width <= framebufferLimit; width *= 2) {
    if (width * width * 4 >= bytes.length) {
      return new gpu.RenderTarget(width);
    }
  }
  throw new Error(`data overflows ${framebufferLimit}x${framebufferLimit} framebuffer`);
}

function pullPixels(target: gpu.RenderTarget, e: number, bytes: Uint8Array) {
  const w = target.width;
  const h = Math.floor(e / w);
  if (e % w > 0) {
    target.readSomePixels(e % w, h, w - (e % w), 1, bytes.subarray(0, 4 * (w - (e % w))));
    target.readSomePixels(0, h + 1, w, w - h - 1, bytes.subarray(4 * (w - (e % w))));
  } else {
    target.readSomePixels(0, h, w, w - h, bytes);
  }
}

async function pullPixelsAsync(target: gpu.RenderTarget, e: number, bytes: Uint8Array) {
  const w = target.width;
  const h = Math.floor(e / w);
  if (e % w > 0) {
    await target.readSomePixelsAsync(e % w, h, w - (e % w), 1, bytes.subarray(0, 4 * (w - (e % w))));
    return target.readSomePixelsAsync(0, h + 1, w, w - h - 1, bytes.subarray(4 * (w - (e % w))));
  } else {
    return target.readSomePixelsAsync(0, h, w, w - h, bytes);
  }
}
