import * as shared from "./shared";
import * as sort from "./shaders/bitonicsort/bitonicsort";

function bitonicSort(array: shared.SortableTypedArrays) {
  if (array.length < 256) return array.set(shared.insertionSort(array) as any);
  const bytes = new Uint8Array(array.buffer);
  const target = shared.createRenderTarget(bytes);
  sort.bitonicSort(target, array.constructor.name);
  const difference = target.width * target.width * 4 - bytes.length;
  if (difference > 0) {
    bytes.set(target.readPixels().subarray(difference));
  } else {
    target.readPixels(bytes);
  }
  target.delete();
}

export function sortInt16Array(array: Int16Array) {
  if (array.constructor.name === "Int16Array") return bitonicSort(array);
  throw new Error("array parameter was not a Int16Array");
}

export function sortUint16Array(array: Uint16Array) {
  if (array.constructor.name === "Uint16Array") return bitonicSort(array);
  throw new Error("array parameter was not a Uint16Array");
}

export function sortInt32Array(array: Int16Array) {
  if (array.constructor.name === "Int32Array") return bitonicSort(array);
  throw new Error("array parameter was not a Int32Array");
}

export function sortUint32Array(array: Uint32Array) {
  if (array.constructor.name === "Uint32Array") return bitonicSort(array);
  throw new Error("array parameter was not a Uint32Array");
}

export function sortFloat32Array(array: Float32Array) {
  if (array.constructor.name === "Float32Array") return bitonicSort(array);
  throw new Error("array parameter was not a Float32Array");
}

export function sortFloat64Array(array: Float64Array) {
  if (array.constructor.name === "Float64Array") return bitonicSort(array);
  throw new Error("array parameter was not a Float64Array");
}

export function sortBigInt64Array(array: BigInt64Array) {
  if (array.constructor.name === "BigInt64Array") return bitonicSort(array);
  throw new Error("array parameter was not a BigInt64Array");
}

export function sortBigUint64Array(array: BigUint64Array) {
  if (array.constructor.name === "BigUint64Array") return bitonicSort(array);
  throw new Error("array parameter was not a BigUint64Array");
}
