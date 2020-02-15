import { bitonicSort, bitonicSortAsync } from "./bitonic";
import { radixSortAsync, radixSortSignedAsync } from "./radix";

export { setWebGLContext } from "gpu-compute";
export { initializeShaders } from "./initialize";

export function sort(
  array:
    | Int8Array
    | Uint8Array
    | Uint8ClampedArray
    | Int16Array
    | Uint16Array
    | Int32Array
    | Uint32Array
    | Float32Array
    | Float64Array
    | BigInt64Array
    | BigUint64Array
) {
  if (!array.length) return array;
  switch (Object.prototype.toString.call(array)) {
    case "[object Int8Array]":
    case "[object Uint8Array]":
    case "[object Uint8ClampedArray]":
    case "[object Int16Array]":
    case "[object Uint16Array]":
      return (array as any).sort((a: number, b: number) => a - b);
    case "[object Int32Array]":
      return bitonicSort(array as Int32Array, "Int32Array");
    case "[object Uint32Array]":
      return bitonicSort(array as Uint32Array, "Uint32Array");
    case "[object Float32Array]":
      return bitonicSort(array as Float32Array, "Float32Array");
    case "[object Float64Array]":
      return bitonicSort(array as Float64Array, "Float64Array");
    case "[object BigInt64Array]":
      return bitonicSort(array as BigInt64Array, "BigInt64Array");
    case "[object BigUint64Array]":
      return bitonicSort(array as BigUint64Array, "BigUint64Array");
  }
  throw new Error(`${Object.prototype.toString.call(array)} is unsupported`);
}

export function sortAsync(
  array:
    | Int8Array
    | Uint8Array
    | Uint8ClampedArray
    | Int16Array
    | Uint16Array
    | Int32Array
    | Uint32Array
    | Float32Array
    | Float64Array
    | BigInt64Array
    | BigUint64Array
) {
  return new Promise((resolve, reject) => {
    if (!array.length) return resolve();
    switch (Object.prototype.toString.call(array)) {
      case "[object Int8Array]":
        return radixSortSignedAsync(new Uint8Array((array as Int8Array).buffer), 256)
          .then(() => resolve())
          .catch(err => reject(err));
      case "[object Uint8Array]":
        return radixSortAsync(new Uint8Array((array as Uint8Array).buffer), 256)
          .then(() => resolve())
          .catch(err => reject(err));
      case "[object Uint8ClampedArray]":
        return radixSortAsync(new Uint8Array((array as Uint8ClampedArray).buffer), 256)
          .then(() => resolve())
          .catch(err => reject(err));
      case "[object Int16Array]":
        return radixSortSignedAsync(new Uint16Array((array as Int16Array).buffer), 65536)
          .then(() => resolve())
          .catch(err => reject(err));
      case "[object Uint16Array]":
        return radixSortAsync(array as Uint16Array, 65536)
          .then(() => resolve())
          .catch(err => reject(err));
      case "[object Int32Array]":
        return bitonicSortAsync(array as Int32Array, "Int32Array")
          .then(() => resolve())
          .catch(err => reject(err));
      case "[object Uint32Array]":
        return bitonicSortAsync(array as Uint32Array, "Uint32Array")
          .then(() => resolve())
          .catch(err => reject(err));
      case "[object Float32Array]":
        return bitonicSortAsync(array as Float32Array, "Float32Array")
          .then(() => resolve())
          .catch(err => reject(err));
      case "[object Float64Array]":
        return bitonicSortAsync(array as Float64Array, "Float64Array")
          .then(() => resolve())
          .catch(err => reject(err));
      case "[object BigInt64Array]":
        return bitonicSortAsync(array as BigInt64Array, "BigInt64Array")
          .then(() => resolve())
          .catch(err => reject(err));
      case "[object BigUint64Array]":
        return bitonicSortAsync(array as BigUint64Array, "BigUint64Array")
          .then(() => resolve())
          .catch(err => reject(err));
    }
    reject(new Error(`${Object.prototype.toString.call(array)} is unsupported`));
  });
}
