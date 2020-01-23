import * as gpu from "gpu-compute";

export function createTargets(bytes: Uint8Array, constructor: string) {
  if (bytes.length % 4 !== 0) {
    const arr = new Uint8Array(bytes.length - (bytes.length % 4) + 4);
    arr.set(bytes);
    bytes = arr;
  }
  const gl = gpu.getWebGLContext();
  const framebufferLimit = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);
  const framebufferByteCount = framebufferLimit * framebufferLimit * 4;
  for (var aggregateWidth = 1; aggregateWidth <= 8 * framebufferLimit; aggregateWidth *= 2) {
    if (aggregateWidth * aggregateWidth * 4 >= bytes.length) {
      const aggregateByteCount = aggregateWidth * aggregateWidth * 4;
      const targetWidth = Math.min(framebufferLimit, aggregateWidth);
      let targetByteCount = targetWidth * targetWidth * 4;
      if (constructor.includes("64Array")) targetByteCount *= 2;
      for (let targetCount of [1, 4, 8]) {
        if (targetCount * framebufferByteCount >= aggregateByteCount) {
          const targets = [];
          for (let i = targetCount - 1; i >= 0; i--) {
            const renderTarget = new gpu.RenderTarget(targetWidth);
            const subarr = bytes.subarray(targetByteCount * i, targetByteCount * (i + 1));
            renderTarget.pushTextureData(subarr);
            targets.push(renderTarget);
          }
          return targets;
        }
      }
    }
  }
  throw new Error(`data overflows eight ${framebufferLimit}x${framebufferLimit} framebuffers`);
}

export const isBigEndian = new Uint8Array(new Uint32Array([0x12345678]).buffer)[0] === 0x12;
export const isLittleEndian = new Uint8Array(new Uint32Array([0x12345678]).buffer)[0] === 0x78;

export const searchAndReplace = {
  "float round(float);": gpu.functionStrings.round,
  "float floatEquals(float, float);": gpu.functionStrings.floatEquals,
  "float floatLessThan(float, float);": gpu.functionStrings.floatLessThan,
  "float floatGreaterThan(float, float);": gpu.functionStrings.floatGreaterThan,
  "float floatLessThanOrEqual(float, float);": gpu.functionStrings.floatLessThanOrEqual,
  "float floatGreaterThanOrEqual(float, float);": gpu.functionStrings.floatGreaterThanOrEqual,
  "float vec2ToUint16(vec2);": gpu.functionStrings.vec2ToUint16,
  "vec2 uint16ToVec2(float);": gpu.functionStrings.uint16ToVec2
};

export function isSorted(array: ArrayLike<number>) {
  for (let i = 0; i < array.length - 1; i++) {
    if (array[i] > array[i + 1]) return false;
  }
  return true;
}

export type SortableTypedArrays =
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array;

export function insertionSort(array: number[] | SortableTypedArrays) {
  for (let i = 0; i < array.length; i++) {
    let temp = array[i];
    let j = i - 1;
    while (j >= 0 && array[j] > temp) {
      array[j + 1] = array[j];
      j--;
    }
    array[j + 1] = temp;
  }
  return array;
}

export function nativeSort(array: SortableTypedArrays) {
  array.sort((a: any, b: any) => a - b);
}

export function shuffle(array: number[] | SortableTypedArrays) {
  for (var len = array.length; len > 0; len--) {
    let rnum = Math.floor(Math.random() * len);
    [array[len - 1], array[rnum]] = [array[rnum], array[len - 1]];
  }
}

export function getLeftoverPixelCount(src: Uint8Array, dst: gpu.RenderTarget[]) {
  return dst[0].width * dst[0].width * dst.length - src.length / 4;
}
