import * as gpu from "gpu-compute";

export function createRenderTarget(bytes: Uint8Array) {
  for (var width = 16; width <= 4096; width *= 2) {
    if (width * width * 4 >= bytes.length) {
      const renderTarget = new gpu.RenderTarget(width);
      renderTarget.pushTextureData(bytes);
      return renderTarget;
    }
  }
  throw new Error("unable to create render target input was too large for 4096x4096 texture");
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

export function insertionSort(array: SortableTypedArrays) {
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
