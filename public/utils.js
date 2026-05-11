export async function fileToBytes(file) {
  return new Uint8Array(await file.arrayBuffer());
}

export function getBaseNameWithoutPdf(fileName) {
  return fileName.replace(/\.pdf$/i, "");
}
