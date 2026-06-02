(function () {
  const polishedTopics = [
    "아침 루틴",
    "출근 준비",
    "회사 대화",
    "점심 시간",
    "카페 주문",
    "길 묻기",
    "전화 응대",
    "약속 잡기",
    "쇼핑",
    "운동",
    "건강",
    "가족",
    "친구",
    "여행",
    "공항",
    "호텔",
    "식당",
    "문제 해결",
    "감정 표현",
    "의견 말하기",
    "회의",
    "이메일",
    "취미",
    "주말",
    "집안일",
    "은행",
    "병원",
    "날씨",
    "학습",
    "목표 관리"
  ];

  const polishedSituations = [
    { en: "in the morning", ko: "아침에", hint: "아침에" },
    { en: "before work", ko: "출근 전에", hint: "일 전에" },
    { en: "at the office", ko: "회사에서", hint: "사무실에서" },
    { en: "during lunch", ko: "점심시간에", hint: "점심 동안에" },
    { en: "at a cafe", ko: "카페에서", hint: "카페에서" },
    { en: "when I ask for directions", ko: "길을 물어볼 때", hint: "내가 길을 물어볼 때" },
    { en: "on the phone", ko: "전화로", hint: "전화 위에서" },
    { en: "when I make plans", ko: "약속을 잡을 때", hint: "내가 계획을 만들 때" },
    { en: "at the store", ko: "가게에서", hint: "가게에서" },
    { en: "at the gym", ko: "헬스장에서", hint: "체육관에서" },
    { en: "when I feel tired", ko: "피곤할 때", hint: "내가 피곤하다고 느낄 때" },
    { en: "with my family", ko: "가족과 함께", hint: "나의 가족과 함께" },
    { en: "with my friends", ko: "친구들과 함께", hint: "나의 친구들과 함께" },
    { en: "when I travel", ko: "여행할 때", hint: "내가 여행할 때" },
    { en: "at the airport", ko: "공항에서", hint: "공항에서" },
    { en: "at the hotel", ko: "호텔에서", hint: "호텔에서" },
    { en: "at the restaurant", ko: "식당에서", hint: "식당에서" },
    { en: "when something goes wrong", ko: "문제가 생겼을 때", hint: "무언가가 잘못될 때" },
    { en: "when I am nervous", ko: "긴장될 때", hint: "내가 긴장되어 있을 때" },
    { en: "when I share my opinion", ko: "의견을 말할 때", hint: "내가 나의 의견을 나눌 때" },
    { en: "in the meeting", ko: "회의에서", hint: "회의 안에서" },
    { en: "when I write an email", ko: "이메일을 쓸 때", hint: "내가 이메일을 쓸 때" },
    { en: "in my free time", ko: "자유 시간에", hint: "나의 자유 시간에" },
    { en: "on the weekend", ko: "주말에", hint: "주말에" },
    { en: "at home", ko: "집에서", hint: "집에서" },
    { en: "at the bank", ko: "은행에서", hint: "은행에서" },
    { en: "at the clinic", ko: "병원에서", hint: "진료소에서" },
    { en: "on rainy days", ko: "비 오는 날에", hint: "비 오는 날들에" },
    { en: "when I study English", ko: "영어를 공부할 때", hint: "내가 영어를 공부할 때" },
    { en: "when I set my goals", ko: "목표를 세울 때", hint: "내가 나의 목표들을 세울 때" }
  ];

  const polishedVariants = [
    {
      simple: ["a simple sentence", "쉬운 문장을", "쉬운 문장"],
      repeat: ["that", "그 말을", "그것을"],
      answer: ["answer in English", "영어로 대답해 보려고", "대답하려고 영어로"],
      explain: ["explain it", "그걸 어떻게 설명해야 할지", "그것을 어떻게 설명할지"],
      practice: ["this sentence", "이 문장을", "이 문장"]
    },
    {
      simple: ["one short sentence", "짧은 문장 하나를", "짧은 문장 하나"],
      repeat: ["that phrase", "그 표현을", "그 표현을"],
      answer: ["respond in English", "영어로 반응해 보려고", "반응하려고 영어로"],
      explain: ["describe it", "그걸 어떻게 묘사해야 할지", "그것을 어떻게 묘사할지"],
      practice: ["this phrase", "이 표현을", "이 표현"]
    },
    {
      simple: ["the easiest sentence", "가장 쉬운 문장을", "가장 쉬운 문장"],
      repeat: ["that part", "그 부분을", "그 부분을"],
      answer: ["say it in English", "그걸 영어로 말해 보려고", "그것을 말하려고 영어로"],
      explain: ["talk about it", "그것에 대해 어떻게 말해야 할지", "그것에 대해 어떻게 말할지"],
      practice: ["this expression", "이 표현을", "이 표현"]
    },
    {
      simple: ["a clear sentence", "분명한 문장을", "분명한 문장"],
      repeat: ["the question", "그 질문을", "그 질문을"],
      answer: ["reply in English", "영어로 답해 보려고", "답하려고 영어로"],
      explain: ["explain the problem", "문제를 어떻게 설명해야 할지", "그 문제를 어떻게 설명할지"],
      practice: ["this answer", "이 대답을", "이 대답"]
    },
    {
      simple: ["one useful sentence", "쓸모 있는 문장 하나를", "유용한 문장 하나"],
      repeat: ["the sentence", "그 문장을", "그 문장을"],
      answer: ["speak in English", "영어로 말해 보려고", "말하려고 영어로"],
      explain: ["explain my thought", "내 생각을 어떻게 설명해야 할지", "나의 생각을 어떻게 설명할지"],
      practice: ["this line", "이 문장을", "이 줄"]
    },
    {
      simple: ["a natural sentence", "자연스러운 문장을", "자연스러운 문장"],
      repeat: ["that expression", "그 표현을", "그 표현을"],
      answer: ["keep speaking in English", "영어로 계속 말해 보려고", "계속 말하려고 영어로"],
      explain: ["explain myself", "내 생각을 어떻게 풀어 말해야 할지", "나 자신을 어떻게 설명할지"],
      practice: ["this dialogue", "이 대화를", "이 대화"]
    }
  ];

  const polishedPatterns = [
    {
      en: (s) => `I usually practice ${s.variant.simple[0]} ${s.when}.`,
      ko: (s) => `${s.koWhen} 보통 ${s.variant.simple[1]} 연습해요.`,
      hint: (s) => `나는 보통 연습해요 / ${s.variant.simple[2]}을 / ${s.hintWhen}`
    },
    {
      en: (s) => `Can you say ${s.variant.repeat[0]} one more time ${s.when}?`,
      ko: (s) => `${s.koWhen} ${s.variant.repeat[1]} 한 번 더 말해줄 수 있나요?`,
      hint: (s) => `말해줄 수 있나요 / ${s.variant.repeat[2]} / 한 번 더 / ${s.hintWhen}`
    },
    {
      en: (s) => `I need a moment to think ${s.when}.`,
      ko: (s) => `${s.koWhen} 생각할 시간이 조금 필요해요.`,
      hint: (s) => `나는 필요해요 / 잠깐의 시간이 / 생각할 / ${s.hintWhen}`
    },
    {
      en: (s) => `Could you speak more slowly ${s.when}?`,
      ko: (s) => `${s.koWhen} 조금 더 천천히 말해주실 수 있나요?`,
      hint: (s) => `말해주실 수 있나요 / 더 천천히 / ${s.hintWhen}`
    },
    {
      en: (s) => `I am trying to ${s.variant.answer[0]} ${s.when}.`,
      ko: (s) => `${s.koWhen} ${s.variant.answer[1]} 하고 있어요.`,
      hint: (s) => `나는 노력하고 있어요 / ${s.variant.answer[2]} / ${s.hintWhen}`
    },
    {
      en: (s) => `What should I say ${s.when}?`,
      ko: (s) => `${s.koWhen} 뭐라고 말하면 좋을까요?`,
      hint: (s) => `무엇을 말해야 하나요 내가 / ${s.hintWhen}`
    },
    {
      en: (s) => `I do not know how to ${s.variant.explain[0]} ${s.when}.`,
      ko: (s) => `${s.koWhen} ${s.variant.explain[1]} 잘 모르겠어요.`,
      hint: (s) => `나는 알지 못해요 / ${s.variant.explain[2]} / ${s.hintWhen}`
    },
    {
      en: (s) => `It is hard for me to speak naturally ${s.when}.`,
      ko: (s) => `${s.koWhen} 자연스럽게 말하는 게 어려워요.`,
      hint: (s) => `그것은 어려워요 나에게 / 자연스럽게 말하는 것이 / ${s.hintWhen}`
    },
    {
      en: (s) => `I feel more confident after I practice out loud ${s.when}.`,
      ko: (s) => `${s.koWhen} 소리 내어 연습하고 나면 자신감이 생겨요.`,
      hint: (s) => `나는 느껴요 더 자신 있게 / 내가 소리 내어 연습한 후에 / ${s.hintWhen}`
    },
    {
      en: (s) => `Would you help me practice ${s.variant.practice[0]} ${s.when}?`,
      ko: (s) => `${s.koWhen} ${s.variant.practice[1]} 연습하는 걸 도와줄래요?`,
      hint: (s) => `도와줄래요 당신은 / 내가 연습하는 것을 / ${s.variant.practice[2]}을 / ${s.hintWhen}`
    }
  ];

  function polishedBuildCurriculum() {
    const days = [];
    for (let day = 1; day <= 180; day += 1) {
      const topic = polishedTopics[(day - 1) % polishedTopics.length];
      const situation = polishedSituations[(day - 1) % polishedSituations.length];
      const variant = polishedVariants[Math.floor((day - 1) / polishedTopics.length) % polishedVariants.length];
      const level = day <= 60 ? "A1" : day <= 120 ? "A2" : "B1";

      days.push({
        day,
        topic,
        title: `${day}일차 · ${topic}`,
        sentences: polishedPatterns.map((pattern, index) => ({
          id: `d${day}-s${index + 1}`,
          english: pattern.en({ ...situation, when: situation.en, koWhen: situation.ko, hintWhen: situation.hint, variant }),
          korean: pattern.ko({ ...situation, when: situation.en, koWhen: situation.ko, hintWhen: situation.hint, variant }),
          hint: pattern.hint({ ...situation, when: situation.en, koWhen: situation.ko, hintWhen: situation.hint, variant }),
          level
        }))
      });
    }
    return days;
  }

  function hasAwkwardDefault(days) {
    if (!Array.isArray(days) || days.length !== 180) return true;
    const text = JSON.stringify(days);
    return [
      "해요해야",
      "해요도",
      "하나으로",
      "것을 해보려고",
      "usually say it one more time",
      "make a reservation in the morning"
    ].some((term) => text.includes(term));
  }

  function applyPolishIfNeeded() {
    if (typeof state === "undefined" || !state.profile) return;
    if (hasAwkwardDefault(state.curriculum)) {
      state.curriculum = polishedBuildCurriculum();
      try {
        localStorage.setItem(`speakup180.curriculum.v2.${state.profile}`, JSON.stringify({ days: state.curriculum }));
      } catch {
        // Keep the in-memory curriculum polished even if localStorage is unavailable.
      }
    }
  }

  window.speakupPolishedCurriculum = polishedBuildCurriculum;

  if (typeof buildCurriculum === "function") {
    buildCurriculum = polishedBuildCurriculum;
  }

  if (typeof loadLocal === "function") {
    const originalLoadLocal = loadLocal;
    loadLocal = function polishedLoadLocal() {
      originalLoadLocal();
      applyPolishIfNeeded();
    };
  }

  if (typeof loadCloud === "function") {
    const originalLoadCloud = loadCloud;
    loadCloud = async function polishedLoadCloud() {
      await originalLoadCloud.apply(this, arguments);
      applyPolishIfNeeded();
      if (typeof render === "function") render();
    };
  }
})();
