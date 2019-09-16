import * as shared from "./shared";
import * as init from "./initialize";
import * as sort from "./bitonicsort";

function bitonicSort(array: shared.SortableTypedArrays, constructorName: string, forceCPU?: boolean) {
  if (forceCPU || !gpuProcessingEnabled || array.length < 256 * 256) return shared.nativeSort(array);
  const bytes = new Uint8Array(array.buffer);
  const targets = shared.createTargets(bytes);
  sort.bitonicSort(targets, constructorName);
  const width = targets[targets.length - 1].width;
  const targetByteLength = width * width * 4;
  let start = 0;
  let overflowing = bytes.length !== targetByteLength;
  for (let target of targets) {
    if (target.width === 1) continue;
    if (!overflowing) {
      target.readPixels(bytes.subarray(start, start + targetByteLength));
      start += targetByteLength;
    } else {
      const extraHoriz = (bytes.length / 4) % width;
      const startY = width - Math.floor(bytes.length / 4 / width);
      const startX = startY < width ? extraHoriz : 0;
      const pixels = target.readSomePixels(startX, startY, width, width);
      const extraByteCount = extraHoriz * 4 + startY * width * 4;
      bytes.set(pixels.subarray(extraByteCount));
      start += targetByteLength - extraByteCount;
      overflowing = false;
    }
  }
}

function checkConstructor(array: shared.SortableTypedArrays, expectedType: string) {
  return Object.prototype.toString.call(array) === `[object ${expectedType}]`;
}

export function sortByNumber(array: any[], getter: (elem: any) => number) {}

export function sortInt16Array(array: Int16Array, forceCPU?: boolean) {
  if (checkConstructor(array, "Int16Array")) return bitonicSort(array, "Int16Array", forceCPU);
  throw new Error(`array parameter of '${array.constructor.name}' was not a Int16Array`);
}

export function sortUint16Array(array: Uint16Array, forceCPU?: boolean) {
  if (checkConstructor(array, "Uint16Array")) return bitonicSort(array, "Uint16Array", forceCPU);
  throw new Error(`array parameter of '${array.constructor.name}' was not a Uint16Array`);
}

export function sortInt32Array(array: Int32Array, forceCPU?: boolean) {
  if (checkConstructor(array, "Int32Array")) return bitonicSort(array, "Int32Array", forceCPU);
  throw new Error(`array parameter of '${array.constructor.name}' was not a Int32Array`);
}

export function sortUint32Array(array: Uint32Array, forceCPU?: boolean) {
  if (checkConstructor(array, "Uint32Array")) return bitonicSort(array, "Uint32Array", forceCPU);
  throw new Error(`array parameter of '${array.constructor.name}' was not a Uint32Array`);
}

export function sortFloat32Array(array: Float32Array, forceCPU?: boolean) {
  if (checkConstructor(array, "Float32Array")) return bitonicSort(array, "Float32Array", forceCPU);
  throw new Error(`array parameter of '${array.constructor.name}' was not a Float32Array`);
}

export function sortFloat64Array(array: Float64Array, forceCPU?: boolean) {
  if (checkConstructor(array, "Float64Array")) return bitonicSort(array, "Float64Array", forceCPU);
  throw new Error(`array parameter of '${array.constructor.name}' was not a Float64Array`);
}

export function sortBigInt64Array(array: BigInt64Array, forceCPU?: boolean) {
  if (checkConstructor(array, "BigInt64Array")) return bitonicSort(array, "BigInt64Array", forceCPU);
  throw new Error(`array parameter of '${array.constructor.name}' was not a BigInt64Array`);
}

export function sortBigUint64Array(array: BigUint64Array, forceCPU?: boolean) {
  if (checkConstructor(array, "BigUint64Array")) return bitonicSort(array, "BigUint64Array", forceCPU);
  throw new Error(`array parameter of '${array.constructor.name}' was not a BigUint64Array`);
}

export const precompileAll = () => init.initializeAllShaders();
export const precompileMost = () => init.initializeMostShaders();

var gpuProcessingEnabled = true;
export const disableGPU = () => (gpuProcessingEnabled = false);
export const enableGPU = () => (gpuProcessingEnabled = true);
export const isGPUEnabled = () => gpuProcessingEnabled;
