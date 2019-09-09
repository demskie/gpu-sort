import * as gpu from "gpu-compute";
import * as index from "../index";
import * as shared from "../shared";
import * as sort from "../shaders/bitonicsort/bitonicsort";

index.precompile();

for (var width of [256, 512, 1024, 2048, 4096].values()) {
  console.log(`dimensions:\t\t${width} x ${width}`);
  emptyBitonicSort(width);
  sortUint32Array();
  cpuFloat32Array();
  cpuArray();
}

function emptyBitonicSort(width: number) {
  let start = Date.now();
  const bytes = new gpu.RenderTarget(width);
  const params = sort.getParameters("Uint32Array");
  if (!shared.isLittleEndian || params.mode !== sort.TRANSFORM_MODE.PASSTHROUGH)
    bytes.compute(params.transformShader, {
      u_bytes: bytes,
      u_width: bytes.width,
      u_mode: params.mode,
      u_endianness: shared.isLittleEndian ? 0 : 1
    });
  const uniforms = sort.calculateBitonicUniforms(bytes.width);
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
  if (!shared.isLittleEndian || params.mode !== sort.TRANSFORM_MODE.PASSTHROUGH)
    bytes.compute(params.untransformShader, {
      u_bytes: bytes,
      u_width: bytes.width,
      u_mode: params.mode,
      u_endianness: shared.isLittleEndian ? 0 : 1
    });
  bytes.readSomePixels(0, 0, 0, 1);
  console.log(`gpu.sortEmpty\t\t${Date.now() - start}ms`);
}

function sortUint32Array() {
  var gpuUint32Array = new Uint32Array(width * width);
  gpuUint32Array.set(Array.from(Array(width * width), () => Math.random() * 0xffffffff));

  let start = Date.now();
  index.sortUint32Array(gpuUint32Array);
  console.log(`gpu.sortUint32Array\t${Date.now() - start}ms`);
}

function cpuFloat32Array() {
  var cpuFloat32Array = new Float32Array(width * width);
  cpuFloat32Array.set(Array.from(Array(width * width), () => Math.random() * 0xffffffff));

  let start = Date.now();
  cpuFloat32Array.sort((a, b) => a - b);
  console.log(`Float32Array.sort()\t${Date.now() - start}ms`);
}

function cpuArray() {
  var cpuArray = Array.from(Array(width * width), () => Math.random() * 0xffffffff);

  let start = Date.now();
  cpuArray.sort((a, b) => a - b);
  console.log(`Array.sort()\t\t${Date.now() - start}ms\n`);
}
