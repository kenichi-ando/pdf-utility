export function initTabs({ tabMerge, tabSplit, mergeSection, splitSection, initialMode }) {
  function setMode(mode) {
    const isMerge = mode === "merge";
    mergeSection.hidden = !isMerge;
    splitSection.hidden = isMerge;
    tabMerge.classList.toggle("active", isMerge);
    tabSplit.classList.toggle("active", !isMerge);
    tabMerge.setAttribute("aria-selected", String(isMerge));
    tabSplit.setAttribute("aria-selected", String(!isMerge));
  }

  tabMerge.addEventListener("click", () => setMode("merge"));
  tabSplit.addEventListener("click", () => setMode("split"));
  setMode(initialMode);
}
