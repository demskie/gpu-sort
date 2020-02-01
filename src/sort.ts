import * as gpu from "gpu-compute";
import * as index from "./index";
import { BitonicUniformGenerator } from "./uniforms";

class Timer {
  private t = Date.now();
  isOver = (limit: number) => Date.now() - this.t > limit;
  reset = () => (this.t = Date.now());
  sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
  pause = () => new Promise(r => requestAnimationFrame(r));
}

export function bitonicSort(array: index.SortableTypedArrays, kind: string, fps?: number): Promise<void> {
  return new Promise(async function(resolve) {
    const bytes = new Uint8Array(array.buffer);
    const target = getRenderTarget(bytes);
    const emptyTexelCount = target.width * target.width - bytes.length / 4;
    const uniformGenerator = new BitonicUniformGenerator(target, kind, emptyTexelCount);
    let i = 0;
    let timer = new Timer();
    for (let obj of uniformGenerator.generateShaderAndUniforms()) {
      if (!fps || ++i % 32 > 0) {
        target.compute(obj.shader, obj.uniforms);
      } else {
        await target.computeAsync(obj.shader, obj.uniforms);
        if (timer.isOver(1000 / fps)) {
          await timer.pause(), timer.reset();
        }
      }
    }
    if (!fps) {
      pullPixels(target, emptyTexelCount, bytes);
    } else {
      await pullPixelsAsync(target, emptyTexelCount, bytes, timer);
    }
    target.delete();
    resolve();
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
  if (bytes.length === w * w * 4) {
    target.readPixels(bytes);
  } else if (e % w === 0) {
    target.readSomePixels(0, Math.floor(e / w), w, w - Math.floor(e / w), bytes);
  } else {
    target.readSomePixels(e % w, Math.floor(e / w), w - (e % w), 1, bytes.subarray(0, 4 * (w - (e % w))));
    target.readSomePixels(0, Math.floor(e / w) + 1, w, w - Math.floor(e / w) - 1, bytes.subarray(4 * (w - (e % w))));
  }
}

async function pullPixelsAsync(target: gpu.RenderTarget, e: number, bytes: Uint8Array, timer: Timer) {
  return new Promise(async function(resolve) {
    const w = target.width;
    const heightLimit = Math.max((128 * 128) / w, 1);
    if (e % w === 0) {
      for (let y = Math.floor(e / w); y < w; y += heightLimit) {
        const h = y + heightLimit > w ? w - y : heightLimit;
        target.readSomePixels(0, y, w, h, bytes.subarray(4 * w * y, 4 * w * (y + h)));
      }
    } else {
      target.readSomePixels(e % w, Math.floor(e / w), w - (e % w), 1, bytes.subarray(0, 4 * (w - (e % w))));
      let byteIndex = 4 * (w - (e % w));
      for (let y = Math.floor(e / w) + 1; y < w; y += heightLimit) {
        const h = y + heightLimit > w ? w - y : heightLimit;
        target.readSomePixels(0, y, w, h, bytes.subarray(byteIndex));
        byteIndex += 4 * w * h;
        await timer.pause();
      }
    }
    resolve();
  });
}
