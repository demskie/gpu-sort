import { setWebGLContext } from "../index";
import * as initialize from "../initialize";

beforeAll(() => {
  setWebGLContext(require("gl")(1, 1));
});

test("initializeShaders", () => {
  initialize.initializeShaders();
});
