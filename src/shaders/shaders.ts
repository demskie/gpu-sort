import * as gpu from "gpu-compute";
import * as shared from "../shared";

import transform128 from "./bitonicsort/00_transform128.frag";
import sort128 from "./bitonicsort/01_sort128.frag";
import untransform128 from "./bitonicsort/02_untransform128.frag";

var transform128Shader: gpu.ComputeShader | undefined;
var bitonicSort128Shader: gpu.ComputeShader | undefined;
var untransform128Shader: gpu.ComputeShader | undefined;

import transform64 from "./bitonicsort/00_transform64.frag";
import sort64 from "./bitonicsort/01_sort64.frag";
import untransform64 from "./bitonicsort/02_untransform64.frag";

var transform64Shader: gpu.ComputeShader | undefined;
var bitonicSort64Shader: gpu.ComputeShader | undefined;
var untransform64Shader: gpu.ComputeShader | undefined;

import transform32 from "./bitonicsort/00_transform32.frag";
import sort32 from "./bitonicsort/01_sort32.frag";
import untransform32 from "./bitonicsort/02_untransform32.frag";

var transform32Shader: gpu.ComputeShader | undefined;
var bitonicSort32Shader: gpu.ComputeShader | undefined;
var untransform32Shader: gpu.ComputeShader | undefined;

import transform16 from "./bitonicsort/00_transform16.frag";
import sort16 from "./bitonicsort/01_sort16.frag";
import untransform16 from "./bitonicsort/02_untransform16.frag";

var transform16Shader: gpu.ComputeShader | undefined;
var bitonicSort16Shader: gpu.ComputeShader | undefined;
var untransform16Shader: gpu.ComputeShader | undefined;

export function getTransform128Shader() {
  if (!transform128Shader) transform128Shader = new gpu.ComputeShader(transform128, shared.searchAndReplace);
  return transform128Shader;
}

export function getBitonicSort128Shader() {
  if (!bitonicSort128Shader) bitonicSort128Shader = new gpu.ComputeShader(sort128, shared.searchAndReplace);
  return bitonicSort128Shader;
}

export function getUntransform128Shader() {
  if (!untransform128Shader) untransform128Shader = new gpu.ComputeShader(untransform128, shared.searchAndReplace);
  return untransform128Shader;
}

export function getTransform64Shader() {
  if (!transform64Shader) transform64Shader = new gpu.ComputeShader(transform64, shared.searchAndReplace);
  return transform64Shader;
}

export function getBitonicSort64Shader() {
  if (!bitonicSort64Shader) bitonicSort64Shader = new gpu.ComputeShader(sort64, shared.searchAndReplace);
  return bitonicSort64Shader;
}

export function getUntransform64Shader() {
  if (!untransform64Shader) untransform64Shader = new gpu.ComputeShader(untransform64, shared.searchAndReplace);
  return untransform64Shader;
}

export function getTransform32Shader() {
  if (!transform32Shader) transform32Shader = new gpu.ComputeShader(transform32, shared.searchAndReplace);
  return transform32Shader;
}

export function getBitonicSort32Shader() {
  if (!bitonicSort32Shader) bitonicSort32Shader = new gpu.ComputeShader(sort32, shared.searchAndReplace);
  return bitonicSort32Shader;
}

export function getUntransform32Shader() {
  if (!untransform32Shader) untransform32Shader = new gpu.ComputeShader(untransform32, shared.searchAndReplace);
  return untransform32Shader;
}

export function getTransform16Shader() {
  if (!transform16Shader) transform16Shader = new gpu.ComputeShader(transform16, shared.searchAndReplace);
  return transform16Shader;
}

export function getBitonicSort16Shader() {
  if (!bitonicSort16Shader) bitonicSort16Shader = new gpu.ComputeShader(sort16, shared.searchAndReplace);
  return bitonicSort16Shader;
}

export function getUntransform16Shader() {
  if (!untransform16Shader) untransform16Shader = new gpu.ComputeShader(untransform16, shared.searchAndReplace);
  return untransform16Shader;
}

export function initializeShaders() {
  getTransform128Shader();
  getBitonicSort128Shader();
  getUntransform128Shader();
  getTransform64Shader();
  getBitonicSort64Shader();
  getUntransform64Shader();
  getTransform32Shader();
  getBitonicSort32Shader();
  getUntransform32Shader();
  getTransform16Shader();
  getBitonicSort16Shader();
  getUntransform16Shader();
}
