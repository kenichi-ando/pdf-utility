export function createResultSetter(downloadLink, resultPreview) {
  let currentResultUrl = null;

  return async function setResult(bytes, filename) {
    if (currentResultUrl) {
      URL.revokeObjectURL(currentResultUrl);
    }
    const blob = new Blob([bytes], { type: "application/pdf" });
    currentResultUrl = URL.createObjectURL(blob);
    resultPreview.src = currentResultUrl;
    downloadLink.href = currentResultUrl;
    downloadLink.download = filename;
    downloadLink.textContent = `ダウンロード: ${filename}`;
    downloadLink.hidden = false;
  };
}
