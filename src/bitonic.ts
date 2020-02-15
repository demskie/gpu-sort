import * as gpu from "gpu-compute";
import { Limiter } from "./limiter";
import { BitonicUniformGenerator } from "./uniforms";

export function bitonicSort(
  array: Int32Array | Uint32Array | Float32Array | Float64Array | BigInt64Array | BigUint64Array,
  kind: "Int32Array" | "Uint32Array" | "Float32Array" | "Float64Array" | "BigInt64Array" | "BigUint64Array"
) {
  const bytes = new Uint8Array(array.buffer);
  const target = getRenderTarget(bytes);
  target.pushTextureData(bytes);
  const emptyTexelCount = target.width * target.width - bytes.length / 4;
  const generator = new BitonicUniformGenerator(target, kind, emptyTexelCount);
  for (let x of generator.generate()) target.compute(x.shader, x.uniforms);
  pullPixels(target, emptyTexelCount, bytes);
  target.delete();
  return array;
}

export function bitonicSortAsync(
  array: Int32Array | Uint32Array | Float32Array | Float64Array | BigInt64Array | BigUint64Array,
  kind: "Int32Array" | "Uint32Array" | "Float32Array" | "Float64Array" | "BigInt64Array" | "BigUint64Array"
): Promise<void> {
  return new Promise((resolve, reject) => {
    const bytes = new Uint8Array(array.buffer);
    const target = getRenderTarget(bytes);
    target
      .pushTextureDataAsync(bytes)
      .then(() => {
        const limiter = new Limiter(target.width);
        const emptyTexelCount = target.width * target.width - bytes.length / 4;
        const generator = new BitonicUniformGenerator(target, kind, emptyTexelCount);
        for (let x of generator.generate()) limiter.addWork(() => target.compute(x.shader, x.uniforms));
        limiter.onceFinished(() => {
          pullPixelsAsync(target, emptyTexelCount, bytes)
            .then(() => resolve())
            .catch(err => reject(err))
            .finally(() => (target.delete(), limiter.stop()));
        });
      })
      .catch(err => (reject(err), target.delete()));
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
