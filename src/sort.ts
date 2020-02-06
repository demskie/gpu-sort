import * as gpu from "gpu-compute";
import * as index from "./index";
import { Limiter } from "./limiter";
import { BitonicUniformGenerator } from "./uniforms";

const limiter = new Limiter();
limiter.syncronizer = (fn: () => void) => {
  gpu.waitForSyncWithCallback(() => fn());
};

export function bitonicSort(array: index.SortableTypedArrays, kind: string, async: boolean): Promise<void> {
  return new Promise(async function(resolve) {
    const bytes = new Uint8Array(array.buffer);
    const target = getRenderTarget(bytes);
    const emptyTexelCount = target.width * target.width - bytes.length / 4;
    const uniformGenerator = new BitonicUniformGenerator(target, kind, emptyTexelCount);
    for (let obj of uniformGenerator.generateShaderAndUniforms()) {
      if (async) {
        limiter.addWork(() => target.compute(obj.shader, obj.uniforms));
      } else {
        target.compute(obj.shader, obj.uniforms);
      }
    }
    limiter.onceFinished(() => {
      if (!async) {
        pullPixels(target, emptyTexelCount, bytes);
        target.delete();
        return resolve();
      }
      pullPixelsAsync(target, emptyTexelCount, bytes).then(() => {
        target.delete();
        resolve();
      });
    });
  });
}

function getRenderTarget(bytes: Uint8Array) {
  const gl = gpu.getWebGLContext();
  const framebufferLimit = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);
  for (let width = 1; width <= framebufferLimit; width *= 2) {
    if (width * width * 4 >= bytes.length) {
      const renderTarget = new gpu.RenderTarget(width);
      renderTarget.pushTextureData(bytes);
      return renderTarget;
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
