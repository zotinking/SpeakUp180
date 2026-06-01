(() => {
  function mobileHomeSummary() {
    const dayProgress = Math.round((state.day / 180) * 100);
    const todayDone = Math.round(((isReadDone() ? 1 : 0) + recallCount() / 10 + checkedCount() / 10) / 3 * 100);
    return `
      <section class="mobile-home-summary">
        <div class="mobile-account-row">
          <div>
            <span>계정</span>
            <strong>${state.profile}</strong>
          </div>
          <div class="mobile-day-control">
            <button data-day-step="-1" aria-label="이전 날짜">‹</button>
            <span>${state.day}일차</span>
            <button data-day-step="1" aria-label="다음 날짜">›</button>
          </div>
        </div>
        <div class="mobile-stat-grid">
          <div><span>로드맵</span><strong>${state.day}/180</strong><em>${dayProgress}%</em></div>
          <div><span>완료율</span><strong>${todayDone}%</strong><em>오늘</em></div>
          <div><span>암송</span><strong>${recallCount()}/10</strong><em>힌트 카드</em></div>
        </div>
      </section>
    `;
  }

  if (typeof renderRoutine === "function") {
    const originalRenderRoutine = renderRoutine;
    renderRoutine = function renderRoutineWithMobileHome() {
      return mobileHomeSummary() + originalRenderRoutine();
    };
  }

  if (typeof render === "function") {
    const originalRender = render;
    render = function renderWithViewClass() {
      originalRender();
      const shell = document.querySelector(".app-shell");
      if (shell) shell.classList.toggle("view-routine", state.view === "routine");
    };
    render();
  }
})();
