import json
import argparse


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("-f", "--file", help="SpectorJS file to print", type=str)
    args = parser.parse_args()
    if len(args.file) == 0:
        raise ValueError("a json file was not provided")
    with open(args.file, "r") as a_file:
        webgl_data = json.load(a_file)
        for command in webgl_data["commands"]:
            print("{}) {}\n".format(command["id"], command["text"]))


if __name__ == "__main__":
    main()
