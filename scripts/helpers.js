import fs from "fs";
import { parse, stringify } from "envfile";

const { readFile, writeFile } = fs;

const pathToenvFile = ".env";

/**
 *
 * @param {string} key
 * @param {string} value
 * //Function to set environment variables.
 */
function setEnv(key, value) {
  readFile(pathToenvFile, "utf8", (err, data) => {
    if (err) {
      return console.log(err);
    }
    const result = parse(data);
    result[key] = value;
    return writeFile(pathToenvFile, stringify(result), (inerr) => {
      if (inerr) {
        return console.log(inerr);
      }
      return console.log("File Saved");
    });
  });
}

// eslint-disable-next-line import/prefer-default-export
export { setEnv };
