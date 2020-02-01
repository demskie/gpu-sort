import * as gpu from "gpu-compute";
import * as init from "./initialize";

export enum TRANSFORM_MODE {
  PASSTHROUGH = 0,
  INTEGER = 1,
  FLOAT = 2
}

export enum CONSTRUCTOR_MODE {
  Int32Array = 0,
  Uint32Array = 1,
  Float32Array = 2,
  Float64Array = 3,
  BigInt64Array = 4,
  BigUint64Array = 5
}

export interface bitonicParameters {
  mode: TRANSFORM_MODE;
  constructor: CONSTRUCTOR_MODE;
  transformShader: gpu.ComputeShader;
  sortShader: gpu.ComputeShader;
  untransformShader: gpu.ComputeShader;
}

export function getBitonicParameters(constructorName: string): bitonicParameters {
  switch (constructorName) {
    case "Int32Array":
      return {
        mode: TRANSFORM_MODE.INTEGER,
        constructor: CONSTRUCTOR_MODE.Int32Array,
        transformShader: init.getTransform32Shader(),
        sortShader: init.getSort32Shader(),
        untransformShader: init.getUntransform32Shader()
      };
    case "Uint32Array":
      return {
        mode: TRANSFORM_MODE.PASSTHROUGH,
        constructor: CONSTRUCTOR_MODE.Uint32Array,
        transformShader: init.getTransform32Shader(),
        sortShader: init.getSort32Shader(),
        untransformShader: init.getUntransform32Shader()
      };
    case "Float32Array":
      return {
        mode: TRANSFORM_MODE.FLOAT,
        constructor: CONSTRUCTOR_MODE.Float32Array,
        transformShader: init.getTransform32Shader(),
        sortShader: init.getSort32Shader(),
        untransformShader: init.getUntransform32Shader()
      };
    case "Float64Array":
      return {
        mode: TRANSFORM_MODE.FLOAT,
        constructor: CONSTRUCTOR_MODE.Float64Array,
        transformShader: init.getTransform64Shader(),
        sortShader: init.getSort64Shader(),
        untransformShader: init.getUntransform64Shader()
      };
    case "BigInt64Array":
      return {
        mode: TRANSFORM_MODE.INTEGER,
        constructor: CONSTRUCTOR_MODE.BigInt64Array,
        transformShader: init.getTransform64Shader(),
        sortShader: init.getSort64Shader(),
        untransformShader: init.getUntransform64Shader()
      };
    case "BigUint64Array":
      return {
        mode: TRANSFORM_MODE.PASSTHROUGH,
        constructor: CONSTRUCTOR_MODE.BigUint64Array,
        transformShader: init.getTransform64Shader(),
        sortShader: init.getSort64Shader(),
        untransformShader: init.getUntransform64Shader()
      };
  }
  throw new Error(`unsupported constructor.name: ${constructorName}`);
}
