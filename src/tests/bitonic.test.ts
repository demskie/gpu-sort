import { setWebGLContext } from "../index";
import * as bitonic from "../bitonic";
import * as gpu from "gpu-compute";

beforeAll(() => {
  setWebGLContext(require("gl")(1, 1));
});

test("getRenderTarget overflow", () => {
  const array = new Float64Array(Math.pow(2, 28));
  try {
    bitonic.getRenderTarget(new Uint8Array(array.buffer));
  } catch (err) {
    return;
  }
  throw new Error("did not see an error");
});

test("pullPixels", () => {
  const bytes = new Uint8Array(128 * 128 * 4);
  const target = new gpu.RenderTarget(128);
  bitonic.pullPixels(target, 0, bytes);
});

test("pullPixels minus one", () => {
  const bytes = new Uint8Array(128 * 128 * 4 - 4);
  const target = new gpu.RenderTarget(128);
  bitonic.pullPixels(target, 1, bytes);
});

test("pullPixelsAsync", async function() {
  const bytes = new Uint8Array(128 * 128 * 4);
  const target = new gpu.RenderTarget(128);
  await bitonic.pullPixelsAsync(target, 0, bytes);
});

test("pullPixelsAsync minus one", async function() {
  const bytes = new Uint8Array(128 * 128 * 4 - 4);
  const target = new gpu.RenderTarget(128);
  await bitonic.pullPixelsAsync(target, 1, bytes);
});
