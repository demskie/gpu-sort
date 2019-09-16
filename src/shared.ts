import * as gpu from "gpu-compute";

export function createTargets(bytes: Uint8Array) {
  const targets = [];
  const limit = 4096; // could be up to 16384
  const width = determineTargetWidth(bytes.length, limit);
  const targetSize = width * width * 4;
  for (let totalTargets of [1, 4, 8]) {
    if (bytes.length > totalTargets * targetSize) continue;
    for (let i = totalTargets - 1; i >= 0; i--) {
      if (bytes.length > targetSize * i) {
        const renderTarget = new gpu.RenderTarget(width);
        const subarr = bytes.subarray(targetSize * i, targetSize * (i + 1));
        renderTarget.pushTextureData(subarr);
        targets.push(renderTarget);
      } else {
        targets.push(getEmptyRenderTarget());
      }
    }
    break;
  }
  return targets;
}

function determineTargetWidth(byteLength: number, widthLimit: number) {
  for (var width = 16; width <= widthLimit; width *= 2) {
    if (width * width * 4 >= byteLength) return width;
  }
  throw new Error(`data overflows ${widthLimit}x${widthLimit} framebuffer`);
}

var emptyRenderTarget: gpu.RenderTarget | undefined;

function getEmptyRenderTarget() {
  if (!emptyRenderTarget) emptyRenderTarget = new gpu.RenderTarget(1);
  return emptyRenderTarget;
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

export function isSorted(array: ArrayLike<Number>) {
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
