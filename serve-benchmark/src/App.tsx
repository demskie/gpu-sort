import React from "react";

const generator = (window as any).gpuSortGenerate.default() as IterableIterator<string>;

interface AppState {
  output: string;
}

export default class App extends React.Component<{}, AppState> {
  state = {
    output: generator.next().value
  } as AppState;

  updateOutputString = () => {
    const result = generator.next();
    const callback = () => setTimeout(() => this.updateOutputString(), 500);
    if (!result.done) this.setState({ output: result.value }, callback);
  };

  render() {
    return (
      <div style={{ textAlign: "center" }}>
        <header
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
          <button
            style={{
              margin: "20px",
              paddingTop: "5px",
              paddingBottom: "5px",
              paddingLeft: "15px",
              paddingRight: "15px"
            }}
            onClick={this.updateOutputString}
          >
            Start Benchmark
          </button>
          <div
            style={{
              width: "380px",
              textAlign: "left",
              whiteSpace: "pre-wrap",
              fontFamily: "monospace",
              paddingBottom: "60px"
            }}
          >
            {this.state.output}
          </div>
        </header>
      </div>
    );
  }
}
