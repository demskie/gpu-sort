import * as gpu from "gpu-compute";
import * as init from "./initialize";

export enum TRANSFORM_MODE {
  PASSTHROUGH = 0,
  INTEGER = 1,
  FLOAT = 2
}

export interface bitonicParameters {
  mode: TRANSFORM_MODE;
  sortShaders: gpu.ComputeShader[];
  transformShader: gpu.ComputeShader;
  untransformShader: gpu.ComputeShader;
}

export function getParameters(byteSlices: gpu.RenderTarget[], constructorName: string) {
  let mode: TRANSFORM_MODE;
  let sortShaders = [] as gpu.ComputeShader[];
  let transformShader: gpu.ComputeShader;
  let untransformShader: gpu.ComputeShader;
  switch (constructorName) {
    case "Int32Array":
      mode = TRANSFORM_MODE.INTEGER;
      transformShader = init.getTransform32Shader();
      if (byteSlices.length === 1) {
        sortShaders = [init.getSort32SmallShader()];
      } else if (byteSlices.length <= 4) {
        sortShaders = init.getSort32MediumShaders();
      } else if (byteSlices.length <= 8) {
        sortShaders = init.getSort32LargeShaders();
      }
      untransformShader = init.getUntransform32Shader();
      break;
    case "Uint32Array":
      mode = TRANSFORM_MODE.PASSTHROUGH;
      transformShader = init.getTransform32Shader();
      if (byteSlices.length === 1) {
        sortShaders = [init.getSort32SmallShader()];
      } else if (byteSlices.length <= 4) {
        sortShaders = init.getSort32MediumShaders();
      } else if (byteSlices.length <= 8) {
        sortShaders = init.getSort32LargeShaders();
      }
      untransformShader = init.getUntransform32Shader();
      break;
    case "Float32Array":
      mode = TRANSFORM_MODE.FLOAT;
      transformShader = init.getTransform32Shader();
      if (byteSlices.length === 1) {
        sortShaders = [init.getSort32SmallShader()];
      } else if (byteSlices.length <= 4) {
        sortShaders = init.getSort32MediumShaders();
      } else if (byteSlices.length <= 8) {
        sortShaders = init.getSort32LargeShaders();
      }
      untransformShader = init.getUntransform32Shader();
      break;
    case "Float64Array":
      mode = TRANSFORM_MODE.FLOAT;
      transformShader = init.getTransform64Shader();
      if (byteSlices.length === 1) {
        sortShaders = [init.getSort64SmallShader()];
      } else if (byteSlices.length <= 4) {
        sortShaders = init.getSort64MediumShaders();
      } else if (byteSlices.length <= 8) {
        sortShaders = init.getSort64LargeShaders();
      }
      untransformShader = init.getUntransform64Shader();
      break;
    case "BigInt64Array":
      mode = TRANSFORM_MODE.INTEGER;
      transformShader = init.getTransform64Shader();
      if (byteSlices.length === 1) {
        sortShaders = [init.getSort64SmallShader()];
      } else if (byteSlices.length <= 4) {
        sortShaders = init.getSort64MediumShaders();
      } else if (byteSlices.length <= 8) {
        sortShaders = init.getSort64LargeShaders();
      }
      untransformShader = init.getUntransform64Shader();
      break;
    case "BigUint64Array":
      mode = TRANSFORM_MODE.PASSTHROUGH;
      transformShader = init.getTransform64Shader();
      if (byteSlices.length === 1) {
        sortShaders = [init.getSort64SmallShader()];
      } else if (byteSlices.length <= 4) {
        sortShaders = init.getSort64MediumShaders();
      } else if (byteSlices.length <= 8) {
        sortShaders = init.getSort64LargeShaders();
      }
      untransformShader = init.getUntransform64Shader();
      break;
    default:
      throw new Error(`unsupported constructor.name: ${constructorName}`);
  }
  return { mode, sortShaders, transformShader, untransformShader } as bitonicParameters;
}
