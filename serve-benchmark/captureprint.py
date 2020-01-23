import json
import argparse
import re


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-f", "--file", help="SpectorJS file to print", type=str)
    args = parser.parse_args()
    patterns = [
        ".*",
        # "createBuffer",
        # "bindBuffer",
        # "bufferData",
        # "createTexture",
        "bindFramebuffer",
        # "activeTexture",
        # "bindTexture",
        # "texImage2D",
        # "framebufferTexture2D",
        # "createShader",
        # "compileShader",
        # "createProgram",
        # "attachShader",
        # "linkProgram",
        # "getProgramParameter",
        # "viewport",
        # "drawArrays",
        # "useProgram",
        # "vertexAttribPointer",
    ]
    patterns = map(lambda x: re.compile(x), patterns)
    if len(args.file) == 0:
        raise ValueError("a json file was not provided")
    with open(args.file, "r") as a_file:
        webgl_data = json.load(a_file)
        for command in webgl_data["commands"]:
            for pattern in patterns:
                if pattern.search(command["text"]):
                    print("{}) {}".format(command["id"], command["text"]))
                    break


if __name__ == "__main__":
    main()
