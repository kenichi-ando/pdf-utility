import { PDFDocument, degrees } from "./pdf-libs.js";
import { fileToBytes, getBaseNameWithoutPdf } from "./utils.js";

export async function runSplit(inputFile, options) {
  const { direction, order } = options;
  const rotateDeg = direction === "cw" ? 90 : direction === "ccw" ? 270 : 0;

  const srcPdf = await PDFDocument.load(await fileToBytes(inputFile));
  const outPdf = await PDFDocument.create();

  for (const srcIndex of srcPdf.getPageIndices()) {
    const [orig] = await outPdf.copyPages(srcPdf, [srcIndex]);
    const width = orig.getWidth();
    const height = orig.getHeight();

    let leftBox;
    let rightBox;

    if (width >= height) {
      const mid = width / 2;
      leftBox = { x: 0, y: 0, w: mid, h: height, side: "left" };
      rightBox = { x: mid, y: 0, w: width - mid, h: height, side: "right" };
    } else {
      const mid = height / 2;
      const bottomBox = { x: 0, y: 0, w: width, h: mid };
      const topBox = { x: 0, y: mid, w: width, h: height - mid };
      if (direction === "cw") {
        leftBox = { ...bottomBox, side: "left" };
        rightBox = { ...topBox, side: "right" };
      } else if (direction === "ccw") {
        leftBox = { ...topBox, side: "left" };
        rightBox = { ...bottomBox, side: "right" };
      } else {
        leftBox = { ...topBox, side: "left" };
        rightBox = { ...bottomBox, side: "right" };
      }
    }

    const pair = order === "LR" ? [leftBox, rightBox] : [rightBox, leftBox];
    for (const box of pair) {
      const [half] = await outPdf.copyPages(srcPdf, [srcIndex]);
      half.setCropBox(box.x, box.y, box.w, box.h);
      half.setMediaBox(box.x, box.y, box.w, box.h);
      half.setRotation(degrees(rotateDeg));
      outPdf.addPage(half);
    }
  }

  return {
    bytes: await outPdf.save(),
    filename: `${getBaseNameWithoutPdf(inputFile.name)} A4.pdf`,
    statusText: `入力: ${srcPdf.getPageCount()} ページ -> 出力: ${outPdf.getPageCount()} ページ (direction=${direction}, order=${order})`,
  };
}
