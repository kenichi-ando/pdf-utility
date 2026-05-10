import { pdfjsLib } from "./pdf-libs.js";

function renderTagRow(tags) {
  const row = document.createElement("div");
  row.className = "thumb-tags";
  for (const tagText of tags) {
    const tag = document.createElement("span");
    tag.className = "thumb-tag";
    tag.textContent = tagText;
    row.appendChild(tag);
  }
  return row;
}

async function renderAllThumbnails(bytes, containerEl, thumbnailTags) {
  if (!containerEl) {
    return;
  }

  containerEl.textContent = "サムネイルを生成中...";
  try {
    const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
    containerEl.textContent = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
      const page = await pdf.getPage(pageNum);
      const base = page.getViewport({ scale: 1 });
      const scale = 140 / base.width;
      const viewport = page.getViewport({ scale });

      const wrapper = document.createElement("div");
      wrapper.className = "thumb-item";

      const canvas = document.createElement("canvas");
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      const ctx = canvas.getContext("2d");
      await page.render({ canvasContext: ctx, viewport }).promise;

      const label = document.createElement("div");
      label.className = "thumb-label";
      const parity = pageNum % 2 === 0 ? "Even" : "Odd";
      label.textContent = `Page ${pageNum} (${parity})`;

      const tags = thumbnailTags?.[pageNum - 1] ?? [];
      const tagRow = renderTagRow(tags);

      wrapper.appendChild(canvas);
      wrapper.appendChild(label);
      if (tags.length > 0) {
        wrapper.appendChild(tagRow);
      }
      containerEl.appendChild(wrapper);
    }
  } catch (error) {
    containerEl.textContent = `サムネイル表示エラー: ${error.message}`;
  }
}

export function createResultSetter(downloadLink, resultPreview, resultThumbnails) {
  let currentResultUrl = null;

  return async function setResult(bytes, filename, thumbnailTags = []) {
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
    await renderAllThumbnails(bytes, resultThumbnails, thumbnailTags);
  };
}
