import * as gpu from "gpu-compute";
import { Uniforms } from "gpu-compute/lib/renderTarget";
import { getBitonicParameters, bitonicParameters, TRANSFORM_MODE } from "./parameters";

export const isBigEndian = new Uint8Array(new Uint32Array([0x12345678]).buffer)[0] === 0x12;
export const isLittleEndian = new Uint8Array(new Uint32Array([0x12345678]).buffer)[0] === 0x78;

export class BitonicUniformGenerator {
  private readonly target: gpu.RenderTarget;
  private readonly parameters: bitonicParameters;
  private readonly emptyTexelCount: number;

  constructor(target: gpu.RenderTarget, kind: string, emptyTexelCount: number) {
    this.target = target;
    this.parameters = getBitonicParameters(kind);
    this.emptyTexelCount = emptyTexelCount;
  }

  *generate(): IterableIterator<bitonicShaderAndUniforms> {
    for (let uniforms of this.generateTransformerUniforms())
      yield { shader: this.parameters.transformShader, uniforms: uniforms };
    for (let uniforms of this.generateSorterUniforms())
      yield { shader: this.parameters.sortShader, uniforms: uniforms };
    for (let uniforms of this.generateUntransformerUniforms())
      yield { shader: this.parameters.untransformShader, uniforms: uniforms };
  }

  private *generateTransformerUniforms(): IterableIterator<bitonicTransformerUniforms> {
    if (!isLittleEndian || this.parameters.mode !== TRANSFORM_MODE.PASSTHROUGH) {
      const w = this.target.width;
      const x = w * w - this.emptyTexelCount;
      yield {
        u_bytes: this.target,
        u_width: w,
        u_mode: this.parameters.mode,
        u_endianness: isLittleEndian ? 0 : 1,
        u_dataDelimX: Math.floor(x % w),
        u_dataDelimY: Math.floor(x / w)
      };
    }
  }

  private *generateSorterUniforms(): IterableIterator<bitonicSorterUniforms> {
    const w = this.target.width;
    for (let rs = 4; rs <= 2 * w * w; rs *= 2) {
      for (let bs = rs / 2; bs > 1; bs /= 2) {
        yield {
          u_bytes: this.target,
          u_width: w,
          u_blockSizeX: Math.floor(bs % w) > 0 ? Math.floor(bs % w) : w,
          u_blockSizeY: Math.max(Math.floor(bs / w), 1),
          u_regionSizeX: Math.floor(rs % w) > 0 ? Math.floor(rs % w) : w,
          u_regionSizeY: Math.max(Math.floor(rs / w), 1)
        };
      }
    }
  }

  private *generateUntransformerUniforms(): IterableIterator<bitonicUntransformerUniforms> {
    if (!isLittleEndian || this.parameters.mode !== TRANSFORM_MODE.PASSTHROUGH) {
      yield {
        u_bytes: this.target,
        u_width: this.target.width,
        u_mode: this.parameters.mode,
        u_endianness: isLittleEndian ? 0 : 1
      };
    }
  }
}

export interface bitonicTransformerUniforms extends Uniforms {
  u_bytes: gpu.RenderTarget;
  u_width: number;
  u_mode: number;
  u_endianness: number;
  u_dataDelimX: number;
  u_dataDelimY: number;
}

export interface bitonicSorterUniforms extends Uniforms {
  u_bytes: gpu.RenderTarget;
  u_width: number;
  u_blockSizeX: number;
  u_blockSizeY: number;
  u_regionSizeX: number;
  u_regionSizeY: number;
}

export interface bitonicUntransformerUniforms extends Uniforms {
  u_bytes: gpu.RenderTarget;
  u_width: number;
  u_mode: number;
  u_endianness: number;
}

export interface bitonicShaderAndUniforms {
  shader: gpu.ComputeShader;
  uniforms: bitonicTransformerUniforms | bitonicSorterUniforms | bitonicUntransformerUniforms;
}
