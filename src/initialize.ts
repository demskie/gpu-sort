import * as gpu from "gpu-compute";
import { readFileSync } from "fs";

export const searchAndReplace = {
  "float round(float);": gpu.functionStrings.round,
  "float floatEquals(float, float);": gpu.functionStrings.floatEquals,
  "float floatNotEquals(float, float);": gpu.functionStrings.floatNotEquals,
  "float floatLessThan(float, float);": gpu.functionStrings.floatLessThan,
  "float floatGreaterThan(float, float);": gpu.functionStrings.floatGreaterThan,
  "float floatLessThanOrEqual(float, float);": gpu.functionStrings.floatLessThanOrEqual,
  "float floatGreaterThanOrEqual(float, float);": gpu.functionStrings.floatGreaterThanOrEqual,
  "float vec2ToUint16(vec2);": gpu.functionStrings.vec2ToUint16,
  "vec2 uint16ToVec2(float);": gpu.functionStrings.uint16ToVec2
};

const transform64 = readFileSync(require.resolve("./shaders/00_transform64.frag"), "utf8");
const sort64 = readFileSync(require.resolve("./shaders/01_sort64.frag"), "utf8");
const untransform64 = readFileSync(require.resolve("./shaders/02_untransform64.frag"), "utf8");

var transform64Shader: gpu.ComputeShader | undefined;
var sort64Shader: gpu.ComputeShader | undefined;
var untransform64Shader: gpu.ComputeShader | undefined;

const transform32 = readFileSync(require.resolve("./shaders/00_transform32.frag"), "utf8");
const sort32 = readFileSync(require.resolve("./shaders/01_sort32.frag"), "utf8");
const untransform32 = readFileSync(require.resolve("./shaders/02_untransform32.frag"), "utf8");

var transform32Shader: gpu.ComputeShader | undefined;
var sort32Shader: gpu.ComputeShader | undefined;
var untransform32Shader: gpu.ComputeShader | undefined;

export function getTransform64Shader() {
  if (!transform64Shader) transform64Shader = new gpu.ComputeShader(transform64, searchAndReplace);
  return transform64Shader;
}

export function getSort64Shader() {
  if (!sort64Shader) sort64Shader = new gpu.ComputeShader(sort64, searchAndReplace);
  return sort64Shader;
}

export function getUntransform64Shader() {
  if (!untransform64Shader) untransform64Shader = new gpu.ComputeShader(untransform64, searchAndReplace);
  return untransform64Shader;
}

export function getTransform32Shader() {
  if (!transform32Shader) transform32Shader = new gpu.ComputeShader(transform32, searchAndReplace);
  return transform32Shader;
}

export function getSort32Shader() {
  if (!sort32Shader) sort32Shader = new gpu.ComputeShader(sort32, searchAndReplace);
  return sort32Shader;
}

export function getUntransform32Shader() {
  if (!untransform32Shader) untransform32Shader = new gpu.ComputeShader(untransform32, searchAndReplace);
  return untransform32Shader;
}

export function initializeShaders() {
  getTransform64Shader();
  getSort64Shader();
  getUntransform64Shader();

  getTransform32Shader();
  getSort32Shader();
  getUntransform32Shader();
}
