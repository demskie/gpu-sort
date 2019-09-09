import * as gpu from "gpu-compute";
import * as shaders from "../shaders";
import * as shared from "../../shared";

export function bitonicSort(bytes: gpu.RenderTarget, constructorName: string) {
  const params = getParameters(constructorName);
  if (!shared.isLittleEndian || params.mode !== TRANSFORM_MODE.PASSTHROUGH)
    bytes.compute(params.transformShader, {
      u_bytes: bytes,
      u_width: bytes.width,
      u_mode: params.mode,
      u_endianness: shared.isLittleEndian ? 0 : 1
    });
  const uniforms = calculateBitonicUniforms(bytes.width);
  for (var i = 0; i < uniforms.length; i++) {
    bytes.compute(params.sortShader, {
      u_bytes: bytes,
      u_width: bytes.width,
      u_blockSizeX: uniforms[i].blockSizeX,
      u_blockSizeY: uniforms[i].blockSizeY,
      u_regionSizeX: uniforms[i].regionSizeX,
      u_regionSizeY: uniforms[i].regionSizeY
    });
  }
  if (!shared.isLittleEndian || params.mode !== TRANSFORM_MODE.PASSTHROUGH)
    bytes.compute(params.untransformShader, {
      u_bytes: bytes,
      u_width: bytes.width,
      u_mode: params.mode,
      u_endianness: shared.isLittleEndian ? 0 : 1
    });
}

export enum TRANSFORM_MODE {
  PASSTHROUGH = 0,
  INTEGER = 1,
  FLOAT = 2
}

export interface bitonicParameters {
  mode: TRANSFORM_MODE;
  sortShader: gpu.ComputeShader;
  transformShader: gpu.ComputeShader;
  untransformShader: gpu.ComputeShader;
}

export function getParameters(constructorName: string) {
  let mode: TRANSFORM_MODE;
  let sortShader: gpu.ComputeShader;
  let transformShader: gpu.ComputeShader;
  let untransformShader: gpu.ComputeShader;
  switch (constructorName) {
    case "Int16Array":
      mode = TRANSFORM_MODE.INTEGER;
      sortShader = shaders.getBitonicSort16Shader();
      transformShader = shaders.getTransform16Shader();
      untransformShader = shaders.getUntransform16Shader();
      break;
    case "Uint16Array":
      mode = TRANSFORM_MODE.PASSTHROUGH;
      sortShader = shaders.getBitonicSort16Shader();
      transformShader = shaders.getTransform16Shader();
      untransformShader = shaders.getUntransform16Shader();
      break;
    case "Int32Array":
      mode = TRANSFORM_MODE.INTEGER;
      sortShader = shaders.getBitonicSort32Shader();
      transformShader = shaders.getTransform32Shader();
      untransformShader = shaders.getUntransform32Shader();
      break;
    case "Uint32Array":
      mode = TRANSFORM_MODE.PASSTHROUGH;
      sortShader = shaders.getBitonicSort32Shader();
      transformShader = shaders.getTransform32Shader();
      untransformShader = shaders.getUntransform32Shader();
      break;
    case "Float32Array":
      mode = TRANSFORM_MODE.FLOAT;
      transformShader = shaders.getTransform32Shader();
      sortShader = shaders.getBitonicSort32Shader();
      untransformShader = shaders.getUntransform32Shader();
      break;
    case "Float64Array":
      mode = TRANSFORM_MODE.FLOAT;
      transformShader = shaders.getTransform64Shader();
      sortShader = shaders.getBitonicSort64Shader();
      untransformShader = shaders.getUntransform64Shader();
      break;
    case "BigInt64Array":
      mode = TRANSFORM_MODE.INTEGER;
      transformShader = shaders.getTransform64Shader();
      sortShader = shaders.getBitonicSort64Shader();
      untransformShader = shaders.getUntransform64Shader();
      break;
    case "BigUint64Array":
      mode = TRANSFORM_MODE.PASSTHROUGH;
      transformShader = shaders.getTransform64Shader();
      sortShader = shaders.getBitonicSort64Shader();
      untransformShader = shaders.getUntransform64Shader();
      break;
    default:
      throw new Error(`unsupported constructor.name: ${constructorName}`);
  }
  return { mode, sortShader, transformShader, untransformShader } as bitonicParameters;
}

export interface bitonicUniforms {
  blockSizeX: number;
  blockSizeY: number;
  regionSizeX: number;
  regionSizeY: number;
}

export function calculateBitonicUniforms(width: number) {
  const arr = [] as bitonicUniforms[];
  for (var rs = 4; rs <= 2 * width * width; rs *= 2) {
    for (var bs = rs / 2; bs > 1; bs /= 2) {
      arr.push({
        blockSizeX: Math.floor(bs % width) > 0 ? Math.floor(bs % width) : width,
        blockSizeY: Math.max(Math.floor(bs / width), 1),
        regionSizeX: Math.floor(rs % width) > 0 ? Math.floor(rs % width) : width,
        regionSizeY: Math.max(Math.floor(rs / width), 1)
      });
    }
  }
  return arr;
}
