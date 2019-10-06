import * as gpu from "gpu-compute";
import * as init from "./initialize";
import * as shared from "./shared";
import { Uniforms } from "gpu-compute/lib/renderTarget";

export function bitonicSort(byteSlices: gpu.RenderTarget[], constructorName: string) {
  if (!byteSlices || byteSlices.length === 0 || byteSlices.length > 8)
    throw new Error(`unsupported number of RenderTargets: '${byteSlices.length}'`);
  for (let i = 1; i < byteSlices.length; i++)
    if (byteSlices[0].width !== byteSlices[i].width)
      throw new Error(`the provided RenderTargets were not all of the same width`);
  const params = getParameters(byteSlices, constructorName);
  if (!shared.isLittleEndian || params.mode !== TRANSFORM_MODE.PASSTHROUGH) {
    for (let bytes of byteSlices) {
      if (bytes.width === 1) continue;
      bytes.compute(params.transformShader, {
        u_bytes: bytes,
        u_width: bytes.width,
        u_mode: params.mode,
        u_endianness: shared.isLittleEndian ? 0 : 1
      });
    }
  }
  const firstBytes = byteSlices[0];
  const secondBytes = byteSlices.length > 1 ? byteSlices[1] : null;
  const thirdBytes = byteSlices.length > 2 ? byteSlices[2] : null;
  const fourthBytes = byteSlices.length > 3 ? byteSlices[3] : null;
  const fifthBytes = byteSlices.length > 4 ? byteSlices[4] : null;
  const sixthBytes = byteSlices.length > 5 ? byteSlices[5] : null;
  const seventhBytes = byteSlices.length > 6 ? byteSlices[6] : null;
  const eighthBytes = byteSlices.length > 7 ? byteSlices[7] : null;
  const uniforms = calculateBitonicUniforms(byteSlices[0].width * byteSlices.length);
  for (let i = 0; i < uniforms.length; i++) {
    for (let j = 0; j < byteSlices.length; j++) {
      if (byteSlices[j].width === 1) continue;
      byteSlices[j].compute(params.sortShaders[j], {
        u_firstBytes: firstBytes,
        u_secondBytes: secondBytes,
        u_thirdBytes: thirdBytes,
        u_fourthBytes: fourthBytes,
        u_fifthBytes: fifthBytes,
        u_sixthBytes: sixthBytes,
        u_seventhBytes: seventhBytes,
        u_eighthBytes: eighthBytes,
        u_width: byteSlices[j].width,
        u_blockSizeX: uniforms[i].blockSizeX,
        u_blockSizeY: uniforms[i].blockSizeY,
        u_regionSizeX: uniforms[i].regionSizeX,
        u_regionSizeY: uniforms[i].regionSizeY
      } as Uniforms);
    }
    gpu.getWebGLContext().flush();
  }
  if (!shared.isLittleEndian || params.mode !== TRANSFORM_MODE.PASSTHROUGH) {
    for (let bytes of byteSlices) {
      if (bytes.width === 1) continue;
      bytes.compute(params.untransformShader, {
        u_bytes: bytes,
        u_width: bytes.width,
        u_mode: params.mode,
        u_endianness: shared.isLittleEndian ? 0 : 1
      });
    }
  }
}

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
    case "Int16Array":
      mode = TRANSFORM_MODE.INTEGER;
      if (byteSlices.length === 1) {
        sortShaders = [init.getSort16SmallShader()];
      } else if (byteSlices.length <= 4) {
        sortShaders = init.getSort16MediumShaders();
      } else if (byteSlices.length <= 8) {
        sortShaders = init.getSort16LargeShaders();
      }
      transformShader = init.getTransform16Shader();
      untransformShader = init.getUntransform16Shader();
      break;
    case "Uint16Array":
      mode = TRANSFORM_MODE.PASSTHROUGH;
      if (byteSlices.length === 1) {
        sortShaders = [init.getSort16SmallShader()];
      } else if (byteSlices.length <= 4) {
        sortShaders = init.getSort16MediumShaders();
      } else if (byteSlices.length <= 8) {
        sortShaders = init.getSort16LargeShaders();
      }
      transformShader = init.getTransform16Shader();
      untransformShader = init.getUntransform16Shader();
      break;
    case "Int32Array":
      mode = TRANSFORM_MODE.INTEGER;
      if (byteSlices.length === 1) {
        sortShaders = [init.getSort32SmallShader()];
      } else if (byteSlices.length <= 4) {
        sortShaders = init.getSort32MediumShaders();
      } else if (byteSlices.length <= 8) {
        sortShaders = init.getSort32LargeShaders();
      }
      transformShader = init.getTransform32Shader();
      untransformShader = init.getUntransform32Shader();
      break;
    case "Uint32Array":
      mode = TRANSFORM_MODE.PASSTHROUGH;
      if (byteSlices.length === 1) {
        sortShaders = [init.getSort32SmallShader()];
      } else if (byteSlices.length <= 4) {
        sortShaders = init.getSort32MediumShaders();
      } else if (byteSlices.length <= 8) {
        sortShaders = init.getSort32LargeShaders();
      }
      transformShader = init.getTransform32Shader();
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
