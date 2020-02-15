import React from "react";
import ReactLoading from "react-loading";
import { default as Stats } from "stats.js";
import { UAParser } from "ua-parser-js";
import { getWebGLContext } from "gpu-compute";

const parser = new UAParser();
var result = parser.getResult();

const startBenchmarking = (window as any).gpuSortGenerate.startBenchmarking as () => void;
const getBenchmarkText = (window as any).gpuSortGenerate.getBenchmarkText as () => string;
const isBenchmarking = (window as any).gpuSortGenerate.isBenchmarking as () => boolean;

interface AppState {
  output: string;
  benchmarking: boolean;
}

export default class App extends React.Component<{}, AppState> {
  state = { output: getBenchmarkText() } as AppState;

  componentDidMount = () => {
    const stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);
    const animate = () => {
      stats.begin();
      stats.end();
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
    setInterval(() => this.setState({ output: getBenchmarkText(), benchmarking: isBenchmarking() }), 100);
  };

  getWebGLRenderer() {
    const gl = getWebGLContext();
    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    if (!debugInfo) return `${debugInfo}`;
    return `${gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)}`;
  }

  render() {
    return (
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            backgroundColor: "#282c34",
            minHeight: "100vh",
            color: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontSize: "16px"
          }}
        >
          {(() => {
            if (!this.state.benchmarking) {
              return (
                <button
                  style={{
                    margin: "20px",
                    paddingTop: "5px",
                    paddingBottom: "5px",
                    paddingLeft: "15px",
                    paddingRight: "15px",
                    height: "30px"
                  }}
                  onClick={() => {
                    startBenchmarking();
                  }}
                >
                  Start Benchmark
                </button>
              );
            } else {
              return <ReactLoading type={"cylon"} color={"white"} height={70} width={70} />;
            }
          })()}
          <div style={{ fontFamily: "monospace" }}>
            {`${result.browser.name} ${result.browser.major}, ` +
              `${result.os.name} ${result.os.version}, ` +
              `${this.getWebGLRenderer()}`}
          </div>
          <div
            style={{
              textAlign: "left",
              whiteSpace: "pre-wrap",
              fontFamily: "monospace",
              paddingBottom: "30px"
            }}
          >
            {this.state.output}
          </div>
        </div>
      </div>
    );
  }
}
