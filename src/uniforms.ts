import * as gpu from "gpu-compute";
import { Uniforms } from "gpu-compute/lib/renderTarget";
import * as shared from "./shared";
import { getParameters, TRANSFORM_MODE } from "./parameters";

export class BitonicUniformGenerator {
  private readonly kind: string;
  private readonly targets: gpu.RenderTarget[];
  private readonly leftovers: number;

  constructor(kind: string, targets: gpu.RenderTarget[], leftovers: number) {
    this.kind = kind;
    this.targets = targets;
    this.leftovers = leftovers;
  }

  *generateTransformerUniforms(): IterableIterator<bitonicTransformerUniforms> {
    const params = getParameters(this.targets, this.kind);
    if (!shared.isLittleEndian || params.mode !== TRANSFORM_MODE.PASSTHROUGH) {
      const singleWidth = this.targets[0].width;
      const singleTexelCount = singleWidth * singleWidth;
      const totalTexelCount = singleTexelCount * this.targets.length;
      for (let i = 0; i < this.targets.length; i++) {
        const x = Math.max((i + 1) * singleTexelCount - (totalTexelCount - this.leftovers), 0);
        yield {
          u_bytes: this.targets[i],
          u_width: singleWidth,
          u_mode: params.mode,
          u_endianness: shared.isLittleEndian ? 0 : 1,
          u_dataDelimX: Math.floor((singleTexelCount - x) % singleWidth),
          u_dataDelimY: Math.max(Math.floor((singleTexelCount - x) / singleWidth), 1)
        };
      }
    }
  }

  *generateSorterUniforms(): IterableIterator<bitonicSorterUniforms> {
    const singleWidth = this.targets[0].width;
    const multiWidth = singleWidth * this.targets.length;
    for (let rs = 4; rs <= 2 * multiWidth * multiWidth; rs *= 2) {
      for (let bs = rs / 2; bs > 1; bs /= 2) {
        const x = {} as bitonicSorterUniforms;
        x.u_firstBytes = this.targets[0];
        if (this.targets.length > 1) x.u_secondBytes = this.targets[1];
        if (this.targets.length > 2) x.u_thirdBytes = this.targets[2];
        if (this.targets.length > 3) x.u_fourthBytes = this.targets[3];
        if (this.targets.length > 4) x.u_fifthBytes = this.targets[4];
        if (this.targets.length > 5) x.u_sixthBytes = this.targets[5];
        if (this.targets.length > 6) x.u_seventhBytes = this.targets[6];
        if (this.targets.length > 7) x.u_eighthBytes = this.targets[7];
        x.u_width = singleWidth;
        x.u_blockSizeX = Math.floor(bs % multiWidth) > 0 ? Math.floor(bs % multiWidth) : multiWidth;
        x.u_blockSizeY = Math.max(Math.floor(bs / multiWidth), 1);
        x.u_regionSizeX = Math.floor(rs % multiWidth) > 0 ? Math.floor(rs % multiWidth) : multiWidth;
        x.u_regionSizeY = Math.max(Math.floor(rs / multiWidth), 1);
        yield x;
      }
    }
  }

  *generateUntransformerUniforms(): IterableIterator<bitonicUntransformerUniforms> {
    const params = getParameters(this.targets, this.kind);
    if (!shared.isLittleEndian || params.mode !== TRANSFORM_MODE.PASSTHROUGH) {
      const singleWidth = this.targets[0].width;
      for (let target of this.targets) {
        yield {
          u_bytes: target,
          u_width: singleWidth,
          u_mode: params.mode,
          u_endianness: shared.isLittleEndian ? 0 : 1
        };
      }
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
  u_firstBytes: gpu.RenderTarget;
  u_secondBytes: gpu.RenderTarget;
  u_thirdBytes: gpu.RenderTarget;
  u_fourthBytes: gpu.RenderTarget;
  u_fifthBytes: gpu.RenderTarget;
  u_sixthBytes: gpu.RenderTarget;
  u_seventhBytes: gpu.RenderTarget;
  u_eighthBytes: gpu.RenderTarget;
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
