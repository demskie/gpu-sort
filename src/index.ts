import * as gpu from "gpu-compute";
import * as shared from "./shared";
import * as init from "./initialize";
import { getParameters } from "./parameters";
import { BitonicUniformGenerator } from "./uniforms";

export { setWebGLContext } from "gpu-compute";

export function bitonicSort(array: shared.SortableTypedArrays, constructor: string, forceCPU?: boolean) {
  if (forceCPU) return shared.nativeSort(array);
  const bytes = new Uint8Array(array.buffer);
  const targets = shared.createTargets(bytes, constructor);
  const leftovers = shared.getLeftoverPixelCount(bytes, targets);
  const parameters = getParameters(targets, constructor);
  const uniformGenerator = new BitonicUniformGenerator(constructor, targets, leftovers);
  for (let uniforms of uniformGenerator.generateTransformerUniforms()) {
    let target = uniforms.u_bytes;
    target.compute(parameters.transformShader, uniforms);
  }
  for (let uniforms of uniformGenerator.generateSorterUniforms()) {
    for (let j = 0; j < targets.length; j++) {
      targets[j].compute(parameters.sortShaders[j], uniforms);
    }
    gpu.getWebGLContext().flush();
  }
  for (let uniforms of uniformGenerator.generateUntransformerUniforms()) {
    let target = uniforms.u_bytes;
    target.compute(parameters.untransformShader, uniforms);
  }
  let start = 0;
  for (let target of targets) {
    const targetBytes = target.width * target.width * 4;
    if (start + targetBytes <= bytes.length) {
      target.readPixels(bytes.subarray(start, start + targetBytes));
    } else {
      const allPixels = target.readPixels();
      bytes.set(allPixels.subarray(-bytes.length));
    }
    start += targetBytes;
  }
}

function checkConstructor(array: shared.SortableTypedArrays, expectedType: string) {
  return Object.prototype.toString.call(array) === `[object ${expectedType}]`;
}

// export function sortByNumber(array: any[], getter: (elem: any) => number) {}

// export function sortInt16Array(array: Int16Array, forceCPU?: boolean) {
//   if (checkConstructor(array, "Int16Array")) return bitonicSort(array, "Int16Array", forceCPU);
//   throw new Error(`array parameter of '${array.constructor.name}' was not a Int16Array`);
// }

// export function sortUint16Array(array: Uint16Array, forceCPU?: boolean) {
//   if (checkConstructor(array, "Uint16Array")) return bitonicSort(array, "Uint16Array", forceCPU);
//   throw new Error(`array parameter of '${array.constructor.name}' was not a Uint16Array`);
// }

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
