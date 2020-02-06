import * as init from "./initialize";
import { bitonicSort } from "./sort";

export { setWebGLContext } from "gpu-compute";

export function sortInt32Array(array: Int32Array) {
  if (checkConstructor(array, "Int32Array")) return bitonicSort(array, "Int32Array", false);
  throw new Error(`array parameter of '${array.constructor.name}' was not a Int32Array`);
}

export function sortInt32ArrayAsync(array: Int32Array) {
  if (checkConstructor(array, "Int32Array")) return bitonicSort(array, "Int32Array", true);
  throw new Error(`array parameter of '${array.constructor.name}' was not a Int32Array`);
}

export function sortUint32Array(array: Uint32Array) {
  if (checkConstructor(array, "Uint32Array")) return bitonicSort(array, "Uint32Array", false);
  throw new Error(`array parameter of '${array.constructor.name}' was not a Uint32Array`);
}

export function sortUint32ArrayAsync(array: Uint32Array) {
  if (checkConstructor(array, "Uint32Array")) return bitonicSort(array, "Uint32Array", true);
  throw new Error(`array parameter of '${array.constructor.name}' was not a Uint32Array`);
}

export function sortFloat32Array(array: Float32Array) {
  if (checkConstructor(array, "Float32Array")) return bitonicSort(array, "Float32Array", false);
  throw new Error(`array parameter of '${array.constructor.name}' was not a Float32Array`);
}

export function sortFloat32ArrayAsync(array: Float32Array) {
  if (checkConstructor(array, "Float32Array")) return bitonicSort(array, "Float32Array", true);
  throw new Error(`array parameter of '${array.constructor.name}' was not a Float32Array`);
}

export function sortFloat64Array(array: Float64Array) {
  if (checkConstructor(array, "Float64Array")) return bitonicSort(array, "Float64Array", false);
  throw new Error(`array parameter of '${array.constructor.name}' was not a Float64Array`);
}

export function sortFloat64ArrayAsync(array: Float64Array) {
  if (checkConstructor(array, "Float64Array")) return bitonicSort(array, "Float64Array", true);
  throw new Error(`array parameter of '${array.constructor.name}' was not a Float64Array`);
}

export function sortBigInt64Array(array: BigInt64Array) {
  if (checkConstructor(array, "BigInt64Array")) return bitonicSort(array, "BigInt64Array", false);
  throw new Error(`array parameter of '${array.constructor.name}' was not a BigInt64Array`);
}

export function sortBigInt64ArrayAsync(array: BigInt64Array) {
  if (checkConstructor(array, "BigInt64Array")) return bitonicSort(array, "BigInt64Array", true);
  throw new Error(`array parameter of '${array.constructor.name}' was not a BigInt64Array`);
}

export function sortBigUint64Array(array: BigUint64Array) {
  if (checkConstructor(array, "BigUint64Array")) return bitonicSort(array, "BigUint64Array", false);
  throw new Error(`array parameter of '${array.constructor.name}' was not a BigUint64Array`);
}

export function sortBigUint64ArrayAsync(array: BigUint64Array) {
  if (checkConstructor(array, "BigUint64Array")) return bitonicSort(array, "BigUint64Array", true);
  throw new Error(`array parameter of '${array.constructor.name}' was not a BigUint64Array`);
}

export const precompileShaders = () => init.initializeShaders();

function checkConstructor(array: SortableTypedArrays, expectedType: string) {
  return Object.prototype.toString.call(array) === `[object ${expectedType}]`;
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
