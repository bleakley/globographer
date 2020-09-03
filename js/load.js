import * as pako from "pako";
import { parseStringPromise } from "xml2js";

const readUploadedFileAsBinary = (inputFile) => {
  const temporaryFileReader = new FileReader();

  return new Promise((resolve, reject) => {
    temporaryFileReader.onerror = () => {
      temporaryFileReader.abort();
      reject(new DOMException("Problem parsing input file."));
    };

    temporaryFileReader.onload = (event) => {
      var result = pako.ungzip(event.target.result, {});
      resolve(Buffer.from(result));
    };
    temporaryFileReader.readAsBinaryString(inputFile);
  });
};

export const fileToData = async (wxx) => {
  let raw = await readUploadedFileAsBinary(wxx);
  let decoded = raw.swap16().toString("utf16le");
  let parsed = await parseStringPromise(decoded);
  return parsed.map;
};

let canBeRendered = (map) => {
  let meta = map["$"];
  return (
    meta.type === "WORLD" &&
    meta.mapProjection === "ICOSAHEDRAL" &&
    meta.hexOrientation === "COLUMNS" &&
    meta.triangleSize % 4 === 0
  );
};

let parseHex = (hex) => {
  let parsed = hex.split("\t");
  return {
    terrain: Number(parsed[0]),
    elevation: Number(parsed[1]),
    frozen: Boolean(parsed[3] === "1"),
  };
};

let parseTileRow = (tileRow) => {
  let rows = tileRow.trimLeft().trimRight().split("\n");
  return rows.map(parseHex);
};

export const parseWxxData = (data) => {
  return {
    canBeRendered: canBeRendered(data),
    triangleSize: Number(data["$"].triangleSize),
    tilesWide: Number(data.tiles[0]["$"].tilesWide),
    tilesHigh: Number(data.tiles[0]["$"].tilesHigh),
    tiles: data.tiles[0].tilerow.map(parseTileRow),
  };
};
