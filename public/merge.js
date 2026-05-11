import { PDFDocument } from "./pdf-libs.js";
import { fileToBytes, getBaseNameWithoutPdf } from "./utils.js";

function buildOrderedIndices(pdf, order) {
  const indices = pdf.getPageIndices();
  return order === "desc" ? [...indices].reverse() : indices;
}

export async function runMerge(frontFile, backFile, options) {
  const { frontOrder = "asc", backOrder = "desc" } = options;
  const frontPdf = await PDFDocument.load(await fileToBytes(frontFile));
  const backPdf = await PDFDocument.load(await fileToBytes(backFile));
  const outPdf = await PDFDocument.create();
  const thumbnailTags = [];

  const frontIndices = buildOrderedIndices(frontPdf, frontOrder);
  const backIndices = buildOrderedIndices(backPdf, backOrder);
  const maxLen = Math.max(frontIndices.length, backIndices.length);

  for (let i = 0; i < maxLen; i += 1) {
    if (i < frontIndices.length) {
      const [page] = await outPdf.copyPages(frontPdf, [frontIndices[i]]);
      outPdf.addPage(page);
      thumbnailTags.push([`Front #${frontIndices[i] + 1}`]);
    }
    if (i < backIndices.length) {
      const [page] = await outPdf.copyPages(backPdf, [backIndices[i]]);
      outPdf.addPage(page);
      thumbnailTags.push([`Back #${backIndices[i] + 1}`]);
    }
  }

  return {
    bytes: await outPdf.save(),
    filename: `${getBaseNameWithoutPdf(frontFile.name)} merged.pdf`,
    statusText: `front: ${frontIndices.length} pages (${frontOrder}) / back: ${backIndices.length} pages (${backOrder}) -> merged: ${outPdf.getPageCount()} pages`,
    thumbnailTags,
  };
}
