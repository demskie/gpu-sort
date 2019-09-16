import * as gpu from "gpu-compute";
import * as shared from "./shared";

const byteStrings = [
  "texture2D(u_firstBytes",
  "texture2D(u_secondBytes",
  "texture2D(u_thirdBytes",
  "texture2D(u_fourthBytes",
  "texture2D(u_fifthBytes",
  "texture2D(u_sixthBytes",
  "texture2D(u_seventhBytes",
  "texture2D(u_eighthBytes"
];

import transform64 from "./shaders/00_transform64.frag";
import sort64Small from "./shaders/01_sort64_small.frag";
import sort64Medium from "./shaders/01_sort64_medium.frag";
import sort64Large from "./shaders/01_sort64_large.frag";
import untransform64 from "./shaders/02_untransform64.frag";

var transform64Shader: gpu.ComputeShader | undefined;
var sort64SmallShader: gpu.ComputeShader | undefined;
var sort64MediumShaders: gpu.ComputeShader[] | undefined;
var sort64LargeShaders: gpu.ComputeShader[] | undefined;
var untransform64Shader: gpu.ComputeShader | undefined;

import transform32 from "./shaders/00_transform32.frag";
import sort32Small from "./shaders/01_sort32_small.frag";
import sort32Medium from "./shaders/01_sort32_medium.frag";
import sort32Large from "./shaders/01_sort32_large.frag";
import untransform32 from "./shaders/02_untransform32.frag";

var transform32Shader: gpu.ComputeShader | undefined;
var sort32SmallShader: gpu.ComputeShader | undefined;
var sort32MediumShaders: gpu.ComputeShader[] | undefined;
var sort32LargeShaders: gpu.ComputeShader[] | undefined;
var untransform32Shader: gpu.ComputeShader | undefined;

import transform16 from "./shaders/00_transform16.frag";
import sort16Small from "./shaders/01_sort16_small.frag";
import sort16Medium from "./shaders/01_sort16_medium.frag";
import sort16Large from "./shaders/01_sort16_large.frag";
import untransform16 from "./shaders/02_untransform16.frag";

var transform16Shader: gpu.ComputeShader | undefined;
var sort16SmallShader: gpu.ComputeShader | undefined;
var sort16MediumShaders: gpu.ComputeShader[] | undefined;
var sort16LargeShaders: gpu.ComputeShader[] | undefined;
var untransform16Shader: gpu.ComputeShader | undefined;

export function getTransform64Shader() {
  if (!transform64Shader) transform64Shader = new gpu.ComputeShader(transform64, shared.searchAndReplace);
  return transform64Shader;
}

export function getSort64SmallShader() {
  if (!sort64SmallShader) sort64SmallShader = new gpu.ComputeShader(sort64Small, shared.searchAndReplace);
  return sort64SmallShader;
}

export function getSort64MediumShaders() {
  if (!sort64MediumShaders) {
    const arr = [];
    for (var s of byteStrings.slice(0, 4)) {
      s = sort64Medium.replace("texture2D(u_firstBytes", s);
      arr.push(new gpu.ComputeShader(s, shared.searchAndReplace));
    }
    sort64MediumShaders = arr;
  }
  return sort64MediumShaders;
}

export function getSort64LargeShaders() {
  if (!sort64LargeShaders) {
    const arr = [];
    for (var s of byteStrings.slice(0, 8)) {
      s = sort64Large.replace("texture2D(u_firstBytes", s);
      arr.push(new gpu.ComputeShader(s, shared.searchAndReplace));
    }
    sort64LargeShaders = arr;
  }
  return sort64LargeShaders;
}

export function getUntransform64Shader() {
  if (!untransform64Shader) untransform64Shader = new gpu.ComputeShader(untransform64, shared.searchAndReplace);
  return untransform64Shader;
}

export function getTransform32Shader() {
  if (!transform32Shader) transform32Shader = new gpu.ComputeShader(transform32, shared.searchAndReplace);
  return transform32Shader;
}

export function getSort32SmallShader() {
  if (!sort32SmallShader) sort32SmallShader = new gpu.ComputeShader(sort32Small, shared.searchAndReplace);
  return sort32SmallShader;
}

export function getSort32MediumShaders() {
  if (!sort32MediumShaders) {
    const arr = [];
    for (var s of byteStrings.slice(0, 4)) {
      s = sort32Medium.replace("texture2D(u_firstBytes", s);
      arr.push(new gpu.ComputeShader(s, shared.searchAndReplace));
    }
    sort32MediumShaders = arr;
  }
  return sort32MediumShaders;
}

export function getSort32LargeShaders() {
  if (!sort32LargeShaders) {
    const arr = [];
    for (var s of byteStrings.slice(0, 8)) {
      s = sort32Large.replace("texture2D(u_firstBytes", s);
      arr.push(new gpu.ComputeShader(s, shared.searchAndReplace));
    }
    sort32LargeShaders = arr;
  }
  return sort32LargeShaders;
}

export function getUntransform32Shader() {
  if (!untransform32Shader) untransform32Shader = new gpu.ComputeShader(untransform32, shared.searchAndReplace);
  return untransform32Shader;
}

export function getTransform16Shader() {
  if (!transform16Shader) transform16Shader = new gpu.ComputeShader(transform16, shared.searchAndReplace);
  return transform16Shader;
}

export function getSort16SmallShader() {
  if (!sort16SmallShader) sort16SmallShader = new gpu.ComputeShader(sort16Small, shared.searchAndReplace);
  return sort16SmallShader;
}

export function getSort16MediumShaders() {
  if (!sort16MediumShaders) {
    const arr = [];
    for (var s of byteStrings.slice(0, 4)) {
      s = sort16Medium.replace("texture2D(u_firstBytes", s);
      arr.push(new gpu.ComputeShader(s, shared.searchAndReplace));
    }
    sort16MediumShaders = arr;
  }
  return sort16MediumShaders;
}

export function getSort16LargeShaders() {
  if (!sort16LargeShaders) {
    const arr = [];
    for (var s of byteStrings.slice(0, 8)) {
      s = sort16Large.replace("texture2D(u_firstBytes", s);
      arr.push(new gpu.ComputeShader(s, shared.searchAndReplace));
    }
    sort16LargeShaders = arr;
  }
  return sort16LargeShaders;
}

export function getUntransform16Shader() {
  if (!untransform16Shader) untransform16Shader = new gpu.ComputeShader(untransform16, shared.searchAndReplace);
  return untransform16Shader;
}

export function initializeMostShaders() {
  getTransform64Shader();
  getSort64SmallShader();
  getUntransform64Shader();

  getTransform32Shader();
  getSort32SmallShader();
  getUntransform32Shader();

  getTransform16Shader();
  getSort16SmallShader();
  getUntransform16Shader();
}

export function initializeAllShaders() {
  getTransform64Shader();
  getSort64LargeShaders();
  getSort64MediumShaders();
  getSort64SmallShader();
  getUntransform64Shader();

  getTransform32Shader();
  getSort32LargeShaders();
  getSort32MediumShaders();
  getSort32SmallShader();
  getUntransform32Shader();

  getTransform16Shader();
  getSort16LargeShaders();
  getSort16MediumShaders();
  getSort16SmallShader();
  getUntransform16Shader();
}