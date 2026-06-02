(() => {
  function readDoneNow() {
    if (typeof isReadDone === "function") return isReadDone();
    if (typeof doneRead === "function") return doneRead();
    return Boolean(state.progress?.readDone?.[`day-${state.day}`]);
  }

  function recallDoneNow() {
    if (typeof recallCount === "function") return recallCount();
    return (state.progress?.recallDone?.[`day-${state.day}`] || []).length;
  }

  function checkedDoneNow() {
    if (typeof checkedCount === "function") return checkedCount();
    if (typeof checkCount === "function") return checkCount();
    return (state.progress?.checkedSentences?.[`day-${state.day}`] || []).length;
  }

  function mobileHomeSummary() {
    const dayProgress = Math.round((state.day / 180) * 100);
    const todayDone = Math.round(((readDoneNow() ? 1 : 0) + recallDoneNow() / 10 + checkedDoneNow() / 10) / 3 * 100);
    const homeButton = state.view !== "routine" ? `<button data-mobile-home aria-label="루틴 선택으로 이동">⌂</button>` : "";
    return `
      <section class="mobile-home-summary">
        <div class="mobile-account-row">
          <div>
            <span>계정</span>
            <strong>${state.profile}</strong>
          </div>
          <div class="mobile-day-control">
            ${homeButton}
            <button data-mobile-day-step="-1" aria-label="이전 날짜">‹</button>
            <span>${state.day}일차</span>
            <button data-mobile-day-step="1" aria-label="다음 날짜">›</button>
          </div>
        </div>
        <div class="mobile-stat-grid">
          <div><span>로드맵</span><strong>${state.day}/180</strong><em>${dayProgress}%</em></div>
          <div><span>완료율</span><strong>${todayDone}%</strong><em>오늘</em></div>
          <div><span>암송</span><strong>${recallDoneNow()}/10</strong><em>힌트 카드</em></div>
        </div>
      </section>
    `;
  }

  function bindMobileSummary() {
    document.querySelectorAll("[data-mobile-day-step]").forEach((button) => {
      button.addEventListener("click", () => setDay(state.day + Number(button.dataset.mobileDayStep)));
    });
    document.querySelector("[data-mobile-home]")?.addEventListener("click", () => {
      state.view = "routine";
      state.status = "";
      render();
    });
  }

  if (typeof render === "function") {
    const originalRender = render;
    render = function renderWithMobileSummary() {
      originalRender();
      const shell = document.querySelector(".app-shell");
      const main = document.querySelector(".app-shell > .main");
      if (!shell || !main || !state.profileReady) return;
      shell.classList.add("mobile-shell-ready");
      document.querySelector(".mobile-home-summary")?.remove();
      main.insertAdjacentHTML("afterbegin", mobileHomeSummary());
      bindMobileSummary();
    };
    render();
  }
})();
