import { setWebGLContext } from "../index";
import { Limiter } from "../limiter";

beforeAll(() => {
  setWebGLContext(require("gl")(1, 1));
});

test("Limiter width 512", done => {
  const limiter = new Limiter(512);
  limiter.addWork(() => {});
  limiter.onceFinished(() => (limiter.stop(), done()));
});

test("Limiter width 1024", done => {
  const limiter = new Limiter(1024);
  limiter.addWork(() => {});
  limiter.onceFinished(() => (limiter.stop(), done()));
});

test("Limiter width 2048", done => {
  const limiter = new Limiter(2048);
  limiter.addWork(() => {});
  limiter.onceFinished(() => (limiter.stop(), done()));
});

test("Limiter width 4096", done => {
  const limiter = new Limiter(4096);
  limiter.addWork(() => {});
  limiter.onceFinished(() => (limiter.stop(), done()));
});

test("Limiter stopped", () => {
  const limiter = new Limiter(4096);
  limiter.stop();
  try {
    limiter.addWork(() => {});
  } catch (err) {
    if (err.toString() === "Error: limiter has been stopped") return;
  }
  throw new Error("something unexpected happened");
});
