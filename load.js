const fs = require("fs");
const zlib = require("zlib");
var parseStringPromise = require("xml2js").parseStringPromise;
const { promisify } = require("util");
const gunzip = promisify(zlib.gunzip);

let fileToData = async (wxx) => {
  let data = await gunzip(wxx);
  let decoded = data.swap16().toString("utf16le");
  let parsed = await parseStringPromise(decoded);
  return parsed.map;
};

let canBeRendered = (map) => {
  let meta = map["$"];
  return meta.type === "WORLD" && meta.projection === "ICOSAHEDRAL";
};

let parseHex = (hex) => {
  let parsed = hex.split("\t");
  return {
    terrain: parsed[0],
    elevation: parsed[1],
  };
};

let parseTileRow = (tileRow) => {
  let rows = tileRow.trimLeft().trimRight().split("\n");
  return rows.map(parseHex);
};

let run = (filename) => {
  fs.readFile(filename, async (err, archive) => {
    let data = await fileToData(archive);
    let parsed = data.tiles[0].tilerow.map(parseTileRow);
    console.log(parsed);
  });
};

run("test.wxx");
