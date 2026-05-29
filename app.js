const STORAGE_KEY = "speakup180.state.v1";
const CUSTOM_DATA_KEY = "speakup180.curriculum.v1";
const READ_SECONDS = 300;
const FOCUS_SECONDS = 1500;

const topics = ["아침 루틴", "출근 준비", "회사 대화", "점심 시간", "카페 주문", "길 묻기", "전화 응대", "약속 잡기", "쇼핑", "운동", "건강", "가족", "친구", "여행", "공항", "호텔", "식당", "문제 해결", "감정 표현", "의견 말하기", "회의", "이메일", "취미", "주말", "집안일", "은행", "병원", "날씨", "학습", "목표 관리"];
const situations = [
  ["in the morning", "아침에", "아침에"], ["before work", "출근 전에", "일 전에"], ["at the office", "회사에서", "사무실에서"], ["during lunch", "점심시간에", "점심 동안에"], ["at a cafe", "카페에서", "카페에서"], ["on the street", "길에서", "거리 위에서"], ["on the phone", "전화로", "전화 위에서"], ["after work", "퇴근 후에", "일 후에"], ["at the store", "가게에서", "가게에서"], ["at the gym", "헬스장에서", "체육관에서"], ["when I feel tired", "피곤할 때", "내가 피곤하다고 느낄 때"], ["with my family", "가족과 함께", "나의 가족과 함께"], ["with my friends", "친구들과 함께", "나의 친구들과 함께"], ["when I travel", "여행할 때", "내가 여행할 때"], ["at the airport", "공항에서", "공항에서"], ["at the hotel", "호텔에서", "호텔에서"], ["at the restaurant", "식당에서", "식당에서"], ["when something goes wrong", "문제가 생겼을 때", "무언가가 잘못될 때"], ["when I am nervous", "긴장될 때", "내가 긴장되어 있을 때"], ["in my opinion", "내 생각에는", "나의 의견 안에서"], ["in the meeting", "회의에서", "회의 안에서"], ["by email", "이메일로", "이메일에 의해"], ["in my free time", "자유 시간에", "나의 자유 시간에"], ["on the weekend", "주말에", "주말에"], ["at home", "집에서", "집에서"], ["at the bank", "은행에서", "은행에서"], ["at the clinic", "병원에서", "진료소에서"], ["on rainy days", "비 오는 날에", "비 오는 날들에"], ["when I study English", "영어를 공부할 때", "내가 영어를 공부할 때"], ["this month", "이번 달에", "이번 달에"]
];
const actions = [
  ["drink some water", "물을 마셔요", "마셔요 약간의 물을"], ["check my schedule", "일정을 확인해요", "확인해요 나의 일정을"], ["send a quick message", "짧은 메시지를 보내요", "보내요 빠른 메시지를"], ["ask one more question", "질문을 하나 더 해요", "물어요 하나 더 질문을"], ["take a short break", "잠깐 쉬어요", "가져요 짧은 휴식을"], ["make a simple plan", "간단한 계획을 세워요", "만들어요 간단한 계획을"], ["look for a better option", "더 나은 선택지를 찾아요", "찾아요 더 나은 선택지를"], ["say it one more time", "그 말을 한 번 더 해요", "말해요 그것을 한 번 더"], ["practice out loud", "소리 내어 연습해요", "연습해요 소리 내어"], ["write it down", "그것을 적어요", "적어요 그것을"], ["order something light", "가벼운 것을 주문해요", "주문해요 무언가 가벼운 것을"], ["find the right place", "맞는 장소를 찾아요", "찾아요 맞는 장소를"], ["explain the situation", "상황을 설명해요", "설명해요 그 상황을"], ["make a reservation", "예약을 해요", "만들어요 예약을"], ["change my plan", "계획을 바꿔요", "바꿔요 나의 계획을"], ["start with an easy sentence", "쉬운 문장으로 시작해요", "시작해요 쉬운 문장으로"], ["repeat the same sentence", "같은 문장을 반복해요", "반복해요 같은 문장을"], ["speak more slowly", "더 천천히 말해요", "말해요 더 천천히"], ["tell you what happened", "무슨 일이 있었는지 말해요", "말해요 당신에게 무엇이 일어났는지"], ["choose the safer way", "더 안전한 방법을 선택해요", "선택해요 더 안전한 방법을"]
];
const promptText = `너는 영어 회화 커리큘럼 디자이너야.

목표: SpeakUp 180 앱에 넣을 6개월치 영어 말하기 암송 데이터를 만들어줘.
대상: 영어 공부에 여러 번 실패한 한국인 직장인.
구조: 총 180일, 하루 10문장, 총 1,800문장.

반드시 아래 JSON 형식만 출력해줘. 설명 문장, 마크다운 코드블록, 주석은 넣지 마.

{"version":"1.0","title":"SpeakUp 180 Custom Curriculum","days":[{"day":1,"topic":"아침 루틴","sentences":[{"english":"I usually check my schedule in the morning.","hint":"나는 보통 확인해요 나의 일정을 / 아침에","korean":"나는 보통 아침에 일정을 확인해요.","level":"A1"}]}]}

작성 규칙:
1. day는 1부터 180까지 빠짐없이 만든다.
2. 각 day의 sentences는 정확히 10개다.
3. english는 실제 회화에서 바로 말할 수 있는 짧은 문장으로 만든다.
4. hint는 한국어 자연어순이 아니라 영어 어순에 맞춘 한글 힌트로 쓴다.
5. korean은 자연스러운 한국어 뜻으로 쓴다.
6. 초반 60일은 A1, 중반 60일은 A2, 후반 60일은 B1 수준으로 점진적으로 어렵게 만든다.
7. 직장, 카페, 여행, 식당, 전화, 회의, 감정 표현, 문제 해결, 목표 관리 상황을 고르게 섞는다.
8. 입으로 바로 따라 하기 좋은 생활 회화로 만든다.
9. 1,800개 문장 전체에서 중복 문장을 피한다.`;

const $ = (s) => document.querySelector(s);
const safe = (v) => { try { return v ? JSON.parse(v) : null; } catch { return null; } };
const clamp = (n, a, b) => Math.max(a, Math.min(b, Number(n) || a));
const key = (d = state.day) => `day-${d}`;
const time = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

let state = {
  view: "today", day: 1, step: "sound", flash: 0, reveal: false, read: READ_SECONDS, readRun: false,
  focus: FOCUS_SECONDS, focusRun: false, status: "", importStatus: "",
  progress: { completedDays: [], readDone: {}, recallDone: {}, checkedSentences: {} }, curriculum: []
};
let readTimer, focusTimer;

function makeCurriculum() {
  return Array.from({ length: 180 }, (_, i) => {
    const day = i + 1, topic = topics[i % topics.length], sit = situations[i % situations.length], level = day <= 60 ? "A1" : day <= 120 ? "A2" : "B1";
    const patterns = [
      (a) => [`I usually ${a[0]} ${sit[0]}.`, `나는 보통 ${sit[1]} ${a[1]}.`, `나는 보통 ${a[2]} / ${sit[2]}`],
      (a) => [`Can I ${a[0]} ${sit[0]}?`, `${sit[1]} ${a[1]}도 될까요?`, `할 수 있나요 내가 ${a[2]} / ${sit[2]}`],
      (a) => [`I need to ${a[0]} ${sit[0]}.`, `나는 ${sit[1]} ${a[1]}해야 해요.`, `나는 필요해요 ${a[2]}하는 것이 / ${sit[2]}`],
      (a) => [`Could you help me ${a[0]} ${sit[0]}?`, `${sit[1]} ${a[1]}하는 걸 도와주실 수 있나요?`, `해주실 수 있나요 당신이 도와주는 것을 / 내가 ${a[2]}하게 / ${sit[2]}`],
      (a) => [`I am trying to ${a[0]} ${sit[0]}.`, `나는 ${sit[1]} ${a[1]}하려고 하고 있어요.`, `나는 노력하고 있어요 ${a[2]}하려고 / ${sit[2]}`],
      () => [`What should I do ${sit[0]}?`, `${sit[1]} 나는 무엇을 해야 하나요?`, `무엇을 해야 하나요 내가 / ${sit[2]}`],
      (a) => [`I do not have time to ${a[0]} ${sit[0]}.`, `나는 ${sit[1]} ${a[1]}할 시간이 없어요.`, `나는 가지고 있지 않아요 시간을 / ${a[2]}할 / ${sit[2]}`],
      (a) => [`It is hard for me to ${a[0]} ${sit[0]}.`, `나는 ${sit[1]} ${a[1]}하는 게 어려워요.`, `그것은 어려워요 나에게 / ${a[2]}하는 것이 / ${sit[2]}`],
      (a) => [`I feel better when I ${a[0]} ${sit[0]}.`, `${sit[1]} ${a[1]}하면 기분이 나아져요.`, `나는 느껴요 더 낫게 / 내가 ${a[2]}할 때 / ${sit[2]}`],
      (a) => [`Would you like to ${a[0]} ${sit[0]}?`, `${sit[1]} ${a[1]}하고 싶으세요?`, `원하시나요 당신은 ${a[2]}하기를 / ${sit[2]}`]
    ];
    return { day, topic, title: `${day}일차 · ${topic}`, sentences: patterns.map((p, n) => {
      const a = actions[(day * 7 + n * 3) % actions.length], r = p(a);
      return { id: `d${day}-s${n + 1}`, english: r[0], korean: r[1], hint: r[2], level };
    }) };
  });
}
function valid(data) {
  const days = Array.isArray(data) ? data : data?.days;
  if (!Array.isArray(days) || days.length !== 180) return null;
  const out = days.map((d, i) => ({ day: Number(d.day) || i + 1, topic: String(d.topic || "커스텀 문장"), title: `${Number(d.day) || i + 1}일차 · ${d.topic || "커스텀 문장"}`, sentences: (d.sentences || []).slice(0, 10).map((s, j) => ({ id: `c${i + 1}-s${j + 1}`, english: String(s.english || "").trim(), hint: String(s.hint || s.korean || "").trim(), korean: String(s.korean || "").trim(), level: String(s.level || "") })) }));
  return out.every((d) => d.sentences.length === 10 && d.sentences.every((s) => s.english && s.hint)) ? out : null;
}
function load() {
  const p = safe(localStorage.getItem(STORAGE_KEY));
  state.curriculum = valid(safe(localStorage.getItem(CUSTOM_DATA_KEY))) || makeCurriculum();
  if (p) { state.day = clamp(p.day, 1, 180); state.progress = { completedDays: p.completedDays || [], readDone: p.readDone || {}, recallDone: p.recallDone || {}, checkedSentences: p.checkedSentences || {} }; }
  if (doneRead()) { state.read = 0; state.step = "recall"; }
}
function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify({ day: state.day, ...state.progress })); }
function dayObj() { return state.curriculum[state.day - 1]; }
function reviewDays() { return state.curriculum.filter((d) => d.day >= Math.max(1, state.day - 5) && d.day <= state.day); }
function doneRead(d = state.day) { return !!state.progress.readDone[key(d)]; }
function recallCount() { return (state.progress.recallDone[key()] || []).length; }
function checkCount() { return (state.progress.checkedSentences[key()] || []).length; }
function completedCount() { return new Set(state.progress.completedDays).size; }
function isChecked(id) { return (state.progress.checkedSentences[key()] || []).includes(id); }
function isRecall(id) { return (state.progress.recallDone[key()] || []).includes(id); }

function sidebar() {
  return `<aside class="sidebar"><div class="brand"><div class="brand-mark">180</div><div><h1>SpeakUp 180</h1><p>입으로 깨우는 영어</p></div></div><nav class="nav">${[["today","오늘 훈련","1"],["review","누적 암송","2"],["focus","25분 집중","3"],["data","문장 데이터","4"]].map(([id,t,n]) => `<button class="nav-button ${state.view === id ? "active" : ""}" data-view="${id}"><span>${t}</span><span>${n}</span></button>`).join("")}</nav><div class="side-card"><strong>저장 방식</strong><p>현재 버전은 기기 안에 저장하고, JSON 파일로 백업과 복원을 지원합니다. 여러 기기 동기화가 필요해지면 Firebase, Supabase 같은 백엔드로 확장하면 됩니다.</p></div></aside>`;
}
function topbar() {
  const titles = { review: "오늘 + 지난 5일 누적 암송", focus: "25분 모래시계 집중", data: "6개월 문장 데이터 관리" };
  const desc = { today: "5분 동안 입으로 읽고, 한글 힌트만 보고 영어 문장을 즉시 떠올린 뒤, 오늘 문장을 완료 처리합니다.", review: "오늘의 10문장과 지난 5일간 문장을 한 묶음으로 복습합니다.", focus: "앱을 켜둔 채 25분 동안 문장 암송에 몰입하는 모드입니다.", data: "초기 1,800문장 커리큘럼을 제공하고, ChatGPT로 만든 6개월치 JSON 데이터를 가져올 수 있습니다." };
  return `<section class="topbar"><div class="title-block"><h2>${state.view === "today" ? dayObj().title : titles[state.view]}</h2><p>${desc[state.view]}</p></div><div class="day-picker"><button data-day-step="-1">‹</button><div><label>학습일</label><input id="dayInput" min="1" max="180" type="number" value="${state.day}" /></div><button data-day-step="1">›</button></div></section>`;
}
function stats() {
  const today = Math.round(((doneRead() ? 1 : 0) + recallCount() / 10 + checkCount() / 10) / 3 * 100);
  return `<section class="stats-grid">${[["로드맵 진행",`${state.day}/180`,state.day/180*100],["오늘 완료율",`${today}%`,today],["암송 체크",`${recallCount()}/10`,recallCount()*10],["완료한 날짜",completedCount(),completedCount()/180*100]].map(([a,b,c]) => `<div class="stat"><span>${a}</span><strong>${b}</strong><div class="progress-bar"><div class="progress-fill" style="width:${c}%"></div></div></div>`).join("")}</section>`;
}
function timerCard() {
  return `<div class="timer-card"><div class="timer-display"><div><div class="timer-label">소리 내어 읽기 타이머</div><div class="time">${time(state.read)}</div></div><button class="primary-button" data-read-complete ${state.read > 0 ? "disabled" : ""}>${doneRead() ? "완료됨" : "완료"}</button></div><div class="timer-actions"><button class="ghost-button" data-read-toggle>${state.readRun ? "일시정지" : "시작"}</button><button class="quiet-button" data-read-reset>초기화</button></div><p class="small-note">5분이 끝나면 Recall 단계가 열립니다.</p></div>`;
}
function soundStep() {
  return `<div class="sentence-list">${dayObj().sentences.map((s,i) => `<div class="sentence-row"><div class="sentence-index">${i+1}</div><div class="sentence-text"><strong>${s.english}</strong><span>${s.korean}</span></div><button class="check-button ${isChecked(s.id) ? "done" : ""}" data-check="${s.id}">${isChecked(s.id) ? "읽음" : "체크"}</button></div>`).join("")}</div>`;
}
function recallStep() {
  const s = dayObj().sentences[state.flash];
  return `<div class="card-stack"><button class="flashcard" data-reveal><div class="meta"><span>${state.flash+1} / 10 · ${s.level}</span><span>${state.reveal ? "영어 원문" : "한글 힌트"}</span></div><div class="hint">${s.hint}</div>${state.reveal ? `<div class="answer">${s.english}<br><span>${s.korean}</span></div>` : ""}</button><div class="flash-controls"><button class="ghost-button" data-prev>이전</button><button class="ghost-button" data-next>다음</button><button class="primary-button" data-recall="${s.id}">${isRecall(s.id) ? "암송 완료됨" : "이 문장 암송 완료"}</button><button class="quiet-button" data-reveal>${state.reveal ? "다시 힌트 보기" : "영어 확인"}</button></div><p class="small-note">카드를 누르면 영어 문장이 나타납니다.</p></div>`;
}
function todayView() {
  return `<section class="panel-grid"><div class="panel"><div class="panel-header"><div><h3>3-Step Method</h3><p>순서대로 완료하면 오늘 날짜가 학습 완료로 기록됩니다.</p></div><div class="segmented"><button class="${state.step === "sound" ? "active" : ""}" data-step="sound">Sound On</button><button class="${state.step === "recall" ? "active" : ""}" data-step="recall" ${!doneRead() ? "disabled" : ""}>Recall</button><button class="${state.step === "complete" ? "active" : ""}" data-step="complete" ${recallCount() < 10 ? "disabled" : ""}>Complete</button></div></div><div class="panel-body">${state.step === "sound" ? soundStep() : state.step === "recall" ? recallStep() : `<div class="data-box"><h4>${state.day}일차 마무리</h4><p>오늘 10문장을 모두 한글 힌트로 암송했습니다.</p><div class="input-row"><button class="primary-button" data-complete-day>오늘 학습 완료</button><button class="ghost-button" data-next-day>다음 날짜로 이동</button></div><div class="status-line">${state.status}</div></div>`}</div></div><div class="card-stack">${timerCard()}<div class="panel"><div class="panel-header"><div><h3>오늘의 복습 묶음</h3><p>${Math.max(1,state.day-5)}일차부터 ${state.day}일차까지 ${reviewDays().length*10}문장</p></div></div><div class="panel-body"><div class="review-list">${reviewDays().map((d)=>`<div class="review-item"><strong>${d.title}</strong><span>${d.sentences[0].english}</span></div>`).join("")}</div></div></div></div></section>`;
}
function reviewView() {
  return `<section class="panel"><div class="panel-header"><div><h3>Smart Reviewer</h3><p>오늘의 10문장 + 지난 5일간 문장</p></div><button class="ghost-button" data-copy-review>복습 목록 복사</button></div><div class="panel-body"><div class="review-list">${reviewDays().flatMap((d)=>d.sentences.map((s,i)=>`<div class="review-item"><strong>${d.day}일차 ${i+1}. ${s.hint}</strong><span>${s.english}</span></div>`)).join("")}</div><div class="status-line">${state.status}</div></div></section>`;
}
function focusView() {
  const p = 1 - state.focus / FOCUS_SECONDS;
  return `<section class="panel"><div class="panel-body focus-layout"><div><div class="hourglass ${state.focusRun ? "running" : ""}" style="--sand-upper:${Math.max(0,100-p*100)}%; --sand-lower:${Math.min(100,p*100)}%"><div class="glass"></div><div class="grain"></div></div></div><div class="focus-copy"><h3>${time(state.focus)}</h3><p>25분 동안 오늘 문장과 누적 복습 문장을 입으로 반복합니다.</p><div class="timer-actions"><button class="primary-button" data-focus-toggle>${state.focusRun ? "일시정지" : "집중 시작"}</button><button class="ghost-button" data-focus-reset>초기화</button></div><div class="status-line">${state.status}</div></div></div></section>`;
}
function dataView() {
  return `<section class="data-grid"><div class="data-box"><h4>저장 대안</h4><p>이번 MVP에는 세 가지 안전장치를 넣었습니다.</p><ul><li>진도와 커리큘럼을 브라우저 로컬 저장소에 저장</li><li>전체 JSON 백업 내보내기</li><li>ChatGPT가 만든 180일 데이터 가져오기</li></ul><div class="input-row"><button class="primary-button" data-export>전체 백업 내보내기</button><button class="ghost-button" data-reset>기본 1,800문장으로 복구</button></div><div class="status-line">${state.importStatus}</div></div><div class="data-box"><h4>6개월 문장 데이터 가져오기</h4><p>180일, 하루 10문장 JSON을 넣어주세요.</p><textarea id="importText" placeholder="ChatGPT가 만든 JSON을 여기에 붙여넣기"></textarea><div class="input-row"><button class="primary-button" data-import>붙여넣은 데이터 적용</button><input class="file-input" id="fileInput" type="file" accept="application/json,.json" /></div></div><div class="data-box"><h4>ChatGPT용 생성 프롬프트</h4><p>이 프롬프트를 복사해서 6개월치 데이터를 만들 수 있습니다.</p><textarea readonly>${promptText}</textarea><div class="input-row"><button class="ghost-button" data-copy-prompt>프롬프트 복사</button></div></div><div class="data-box"><h4>현재 데이터 요약</h4><p>총 ${state.curriculum.length}일, ${state.curriculum.length*10}문장 구조입니다. 현재 선택된 날짜는 ${dayObj().title}입니다.</p><ul><li>오디오 기능 없음</li><li>AI 회화 기능 없음</li><li>5분 읽기 타이머와 완료 버튼 포함</li><li>모바일 반응형 레이아웃 포함</li></ul></div></section>`;
}
function render() {
  $("#app").innerHTML = `<div class="app-shell">${sidebar()}<main class="main">${topbar()}${stats()}${state.view === "review" ? reviewView() : state.view === "focus" ? focusView() : state.view === "data" ? dataView() : todayView()}</main></div>`;
  bind();
}
function bind() {
  document.querySelectorAll("[data-view]").forEach((b)=>b.onclick=()=>{state.view=b.dataset.view; state.status=""; render();});
  document.querySelectorAll("[data-day-step]").forEach((b)=>b.onclick=()=>setDay(state.day + Number(b.dataset.dayStep)));
  $("#dayInput")?.addEventListener("change", (e)=>setDay(e.target.value));
  document.querySelectorAll("[data-step]").forEach((b)=>b.onclick=()=>{state.step=b.dataset.step; render();});
  document.querySelectorAll("[data-check]").forEach((b)=>b.onclick=()=>{const k=key(), set=new Set(state.progress.checkedSentences[k]||[]); set.has(b.dataset.check)?set.delete(b.dataset.check):set.add(b.dataset.check); state.progress.checkedSentences[k]=[...set]; save(); render();});
  document.querySelectorAll("[data-reveal]").forEach((b)=>b.onclick=()=>{state.reveal=!state.reveal; render();});
  $("[data-prev]")?.addEventListener("click",()=>{state.flash=clamp(state.flash-1,0,9); state.reveal=false; render();});
  $("[data-next]")?.addEventListener("click",()=>{state.flash=clamp(state.flash+1,0,9); state.reveal=false; render();});
  $("[data-recall]")?.addEventListener("click",(e)=>{const k=key(), set=new Set(state.progress.recallDone[k]||[]); set.add(e.target.dataset.recall); state.progress.recallDone[k]=[...set]; if(state.flash<9) state.flash++; if(set.size>=10) state.step="complete"; state.reveal=false; save(); render();});
  $("[data-read-toggle]")?.addEventListener("click",()=>{state.readRun=!state.readRun; clearInterval(readTimer); if(state.readRun) readTimer=setInterval(()=>{state.read=Math.max(0,state.read-1); if(!state.read){state.readRun=false; clearInterval(readTimer);} render();},1000); render();});
  $("[data-read-reset]")?.addEventListener("click",()=>{clearInterval(readTimer); state.readRun=false; state.read=READ_SECONDS; delete state.progress.readDone[key()]; save(); render();});
  $("[data-read-complete]")?.addEventListener("click",()=>{state.progress.readDone[key()]=true; state.step="recall"; save(); render();});
  $("[data-complete-day]")?.addEventListener("click",()=>{state.progress.completedDays=[...new Set([...state.progress.completedDays,state.day])].sort((a,b)=>a-b); state.status=`${state.day}일차가 완료되었습니다.`; save(); render();});
  $("[data-next-day]")?.addEventListener("click",()=>setDay(state.day+1));
  $("[data-focus-toggle]")?.addEventListener("click",()=>{state.focusRun=!state.focusRun; clearInterval(focusTimer); if(state.focusRun) focusTimer=setInterval(()=>{state.focus=Math.max(0,state.focus-1); if(!state.focus){state.focusRun=false; state.status="25분 집중 세션이 끝났습니다."; clearInterval(focusTimer);} render();},1000); render();});
  $("[data-focus-reset]")?.addEventListener("click",()=>{clearInterval(focusTimer); state.focusRun=false; state.focus=FOCUS_SECONDS; state.status=""; render();});
  $("[data-copy-review]")?.addEventListener("click",()=>{navigator.clipboard.writeText(reviewDays().map((d)=>`[${d.title}]\n`+d.sentences.map((s,i)=>`${i+1}. ${s.hint}\n   ${s.english}`).join("\n")).join("\n\n")); state.status="복습 목록을 복사했습니다."; render();});
  $("[data-copy-prompt]")?.addEventListener("click",()=>{navigator.clipboard.writeText(promptText); state.importStatus="ChatGPT용 프롬프트를 복사했습니다."; render();});
  $("[data-reset]")?.addEventListener("click",()=>{localStorage.removeItem(CUSTOM_DATA_KEY); state.curriculum=makeCurriculum(); state.importStatus="기본 1,800문장으로 복구했습니다."; render();});
  $("[data-import]")?.addEventListener("click",()=>applyImport(safe($("#importText").value)));
  $("#fileInput")?.addEventListener("change",(e)=>{const f=e.target.files?.[0]; if(!f)return; const r=new FileReader(); r.onload=()=>applyImport(safe(String(r.result))); r.readAsText(f);});
  $("[data-export]")?.addEventListener("click",()=>{const blob=new Blob([JSON.stringify({exportedAt:new Date().toISOString(), app:"SpeakUp 180", progress:{day:state.day,...state.progress}, curriculum:{version:"1.0",days:state.curriculum}},null,2)],{type:"application/json"}); const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=`speakup-180-backup-day-${state.day}.json`; a.click(); URL.revokeObjectURL(a.href); state.importStatus="전체 백업 파일을 만들었습니다."; render();});
}
function setDay(d) { state.day=clamp(d,1,180); state.flash=0; state.reveal=false; state.step=doneRead()?"recall":"sound"; state.read=doneRead()?0:READ_SECONDS; save(); render(); }
function applyImport(data) { const normalized=valid(data?.curriculum||data); if(!normalized){state.importStatus="가져오기 실패: 180일 x 하루 10문장 JSON 형식을 확인해주세요."; render(); return;} state.curriculum=normalized; localStorage.setItem(CUSTOM_DATA_KEY, JSON.stringify({days:normalized})); state.importStatus="새 6개월 문장 데이터를 적용했습니다."; render(); }

load();
render();
