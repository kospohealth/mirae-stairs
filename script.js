(function () {
      "use strict";

      var SUPABASE_URL = "https://efdvamzvbaazajcleasa.supabase.co";
      var SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmZHZhbXp2YmFhemFqY2xlYXNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NDcxNDgsImV4cCI6MjA5NDQyMzE0OH0.rJlBtts7lKC9VwZ7HLxrn1xOk8BXpsw1hvTl5HWCcRg";
      var GOOGLE_SHEETS_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbxPIFd_FeqGJQEz0MBxEcWVT10eeR4n9ZCJqtWhPv5OYFAUx-I_aehPQoJkJ7WxZCpa/exec";
      var supabaseClient = null;

      var quizzes = [
        { question: "폭염 시 가장 중요한 행동은?", choices: ["수분섭취와 휴식", "참고 버티기", "두꺼운 옷 입기"], answer: 0, explanation: "탈수·열사병을 막는 가장 기본 수칙!" },
        { question: "체감온도 33℃ 이상이면?", choices: ["쉬지 않고 작업", "물을 마시지 않기", "2시간마다 20분 휴식"], answer: 2, explanation: "산업안전보건법 법적 권고사항!" },
        { question: "폭염 때 시원한 물은?", choices: ["하루 한 번만 마신다", "충분히 자주 마신다", "뜨거운 커피만 마신다"], answer: 1, explanation: "갈증 느낄 땐 이미 탈수 시작!" },
        { question: "온열질환 의심 시 가장 먼저 할 일은?", choices: ["시원한 곳으로 이동", "더 오래 작업", "햇볕 아래 있기"], answer: 0, explanation: "응급처치 1단계는 체온 낮추기!" },
        { question: "폭염 작업 시 좋은 휴식 장소는?", choices: ["그늘 또는 시원한 곳", "뜨거운 바닥", "직사광선 아래"], answer: 0, explanation: "직사광선 피하고 통풍되는 곳으로!" },
        { question: "폭염 예방에 도움이 되는 것은?", choices: ["보냉장구 착용", "두꺼운 담요", "밀폐된 공간"], answer: 0, explanation: "체표 온도를 낮춰 온열질환 위험 감소!" },
        { question: "체감온도 35℃ 이상 폭염경보 때 권고되는 것은?", choices: ["가장 더울 때 작업하기", "휴식 줄이기", "무더위 시간대 옥외작업 중지"], answer: 2, explanation: "오후 2~5시가 폭염 최대 위험 시간대!" },
        { question: "어지럽고 식은땀이 나면?", choices: ["더 빨리 움직이기", "즉시 쉬고 상태 확인", "물을 피하기"], answer: 1, explanation: "어지러움·식은땀은 열탈진 초기 신호!" },
        { question: "몸을 식히는 데 좋은 방법은?", choices: ["뜨거운 장소로 이동", "햇볕 오래 쬐기", "시원한 물과 그늘"], answer: 2, explanation: "땀 증발을 도와 체온이 자연스럽게 낮아져요." },
        { question: "체감온도 38℃ 이상이면?", choices: ["긴급작업 외 옥외작업 중지", "휴식 없이 작업", "작업속도 높이기"], answer: 0, explanation: "극폭염! 긴급 외 옥외 활동 전면 중단." },
        { question: "동료가 온열질환으로 의식이 이상하면?", choices: ["119에 신고", "혼자 쉬게 두기", "운동을 시키기"], answer: 0, explanation: "의식 저하 = 열사병! 지체 없이 119." },
        { question: "폭염 시 갈증이 나기 전에도 해야 할 일은?", choices: ["물을 참기", "카페인만 마시기", "물을 조금씩 자주 마시기"], answer: 2, explanation: "갈증 느낄 땐 이미 탈수 상태!" },
        { question: "폭염으로 어지럽고 메스꺼우면 해야 하는 행동은?", choices: ["더 빨리 움직이기", "시원한 곳으로 이동하기", "그냥 참기"], answer: 1, explanation: "메스꺼움·어지러움은 열탈진 증상!" },
        { question: "체감온도 33℃ 이상일 때 권장되는 것은?", choices: ["쉬지 않고 작업", "2시간마다 20분 이상 휴식", "물을 마시지 않기"], answer: 1, explanation: "고온 지속 노출 시 열사병 위험 급증!" },
        { question: "폭염 시 가장 피해야 하는 행동은?", choices: ["그늘에서 쉬기", "갈증날 때까지 물 안 마시기", "시원한 물 마시기"], answer: 1, explanation: "갈증 = 이미 탈수! 수시로 마셔야 합니다." },
        { question: "온열질환 증상으로 맞는 것은?", choices: ["어지러움", "손발 얼음처럼 차가움", "콧물만 남"], answer: 0, explanation: "두통·구역감·근육경련도 함께 나타납니다." },
        { question: "폭염 작업 시 좋은 복장은?", choices: ["두꺼운 검은 옷", "통풍 잘 되는 밝은 옷", "패딩점퍼"], answer: 1, explanation: "밝은 색 → 햇빛 반사, 통풍 → 땀 증발 촉진!" },
        { question: "온열질환자가 의식이 없다면?", choices: ["물을 마시게 한다", "잠깐 기다린다", "즉시 119에 신고한다"], answer: 2, explanation: "의식 없을 때 물 먹이면 기도가 막힙니다!" },
        { question: "폭염 시간대 중 가장 더운 시간은?", choices: ["오후 2~5시", "새벽 5시", "오전 8시"], answer: 0, explanation: "태양 복사열이 최고조에 달하는 시간대!" },
        { question: "폭염 시 쉬기 좋은 장소는?", choices: ["햇볕 아래", "밀폐된 차량 안", "그늘지고 시원한 곳"], answer: 2, explanation: "직사광선·밀폐 공간은 절대 피하세요!" },
        { question: "온열질환 예방에 도움이 되는 것은?", choices: ["규칙적인 휴식", "무리한 운동", "물 안 마시기"], answer: 0, explanation: "쉬지 않으면 체온이 서서히 위험해집니다." },
        { question: "폭염 속 차량 안이 위험한 이유는?", choices: ["너무 조용해서", "온도가 매우 빨리 올라가서", "창문이 많아서"], answer: 1, explanation: "10분 만에 내부 온도 60℃까지 치솟아요!" },
        { question: "땀을 많이 흘렸을 때 가장 필요한 것은?", choices: ["수분 보충", "뜨거운 커피", "두꺼운 담요"], answer: 0, explanation: "땀으로 빠진 전해질도 함께 보충해야 합니다." },
        { question: "폭염 시 위험할 수 있는 장소는?", choices: ["그늘막 아래", "환기 안 되는 밀폐공간", "에어컨 있는 실내"], answer: 1, explanation: "공기가 갇히면 온도가 빠르게 올라갑니다!" },
        { question: "야외 작업 시 도움이 되는 것은?", choices: ["목도리", "냉각조끼", "털장갑"], answer: 1, explanation: "체표 온도를 낮춰 열사병 예방에 효과적!" },
        { question: "사업장에서 폭염 대비 제공해야 하는 것은?", choices: ["시원한 물", "뜨거운 국물", "겨울 외투"], answer: 0, explanation: "사업주는 음용수를 무상 제공할 법적 의무!" },
        { question: "온열질환자가 의식이 없을 때 해야 하는 행동은?", choices: ["따뜻한 곳으로 이동", "몸 식혀주기", "억지로 물 먹이기"], answer: 1, explanation: "의식 없는 환자에게 물 먹이면 기도 막힘!" },
        { question: "몸을 식히는 방법으로 맞는 것은?", choices: ["두꺼운 옷 입기", "선풍기 사용하기", "햇볕 아래 있기"], answer: 1, explanation: "바람이 땀 증발을 도와 체온을 낮춥니다." },
        { question: "폭염주의보 기준 체감온도는?", choices: ["33℃ 이상", "20℃ 이상", "15℃ 이하"], answer: 0, explanation: "2일 이상 지속 예상될 때 주의보 발령!" },
        { question: "폭염경보 기준 체감온도는?", choices: ["25℃ 이상", "40℃ 이상", "35℃ 이상"], answer: 2, explanation: "주의보(33℃)보다 2℃ 높은 경보 기준!" },
        { question: "폭염 속 건강을 지키는 가장 좋은 습관은?", choices: ["무리하지 않기", "쉬지 않고 움직이기", "물 안 마시기"], answer: 0, explanation: "체력 한계를 넘으면 열사병이 옵니다!" },
        { question: "폭우가 올 때 가장 안전한 행동은?", choices: ["하천 근처로 구경 간다", "지하주차장으로 이동한다", "높은 곳이나 실내로 대피한다"], answer: 2, explanation: "하천 범람·지하 침수! 높은 곳으로 대피!" },
        { question: "태풍이 올 때 창문 관리로 가장 올바른 것은?", choices: ["창문을 열어 둔다", "창문을 테이프로 보강하거나 단단히 닫는다", "창문을 조금만 열어둔다"], answer: 1, explanation: "유리 파손 시 파편 비산을 막아줍니다." },
        { question: "집중호우 시 차량 운전 중 가장 위험한 행동은?", choices: ["속도를 줄인다", "침수 도로를 무리하게 통과한다", "라이트를 켠다"], answer: 1, explanation: "차량이 떠내려갈 수 있어 절대 금지!" },
        { question: "침수 위험이 있는 장소는?", choices: ["언덕 위 주택", "지하상가", "고층 아파트"], answer: 1, explanation: "폭우 시 빠르게 침수되어 탈출이 어렵습니다!" },
        { question: "태풍 대비로 미리 해야 할 일은?", choices: ["창문 주변 정리 및 외부 물건 고정", "집 밖으로 나가 상황 확인", "가벼운 옷 준비만 한다"], answer: 0, explanation: "강풍에 날리면 인명·재산 피해 발생!" },
        { question: "호우 시 하천 근처에서 해야 할 행동은?", choices: ["사진 찍는다", "즉시 벗어난다", "물 흐름을 확인한다"], answer: 1, explanation: "하천 수위는 예상보다 훨씬 빠르게 올라요!" },
        { question: "정전이 예상되는 태풍 상황에서 준비물은?", choices: ["손전등, 비상식량", "선풍기만 준비", "휴대폰만 충전"], answer: 0, explanation: "정전 대비 손전등·비상식량·배터리 라디오!" },
        { question: "폭우 중 가장 위험한 장소는?", choices: ["대형마트 내부", "산사태 위험 지역", "카페"], answer: 1, explanation: "집중호우 시 토사가 갑자기 쏟아집니다!" },
        { question: "침수된 길을 걸어야 한다면 가장 안전한 방법은?", choices: ["맨발로 빠르게 이동", "물 깊이를 확인하고 우회", "뛰어서 통과"], answer: 1, explanation: "깊이 모름 + 오염 위험! 가능하면 우회하세요." },
        { question: "재난 문자(긴급알림)를 받았을 때 해야 할 행동은?", choices: ["무시하고 하던 일 계속", "내용 확인 후 안내에 따라 행동", "바로 SNS에 공유만 한다"], answer: 1, explanation: "행정안전부 공식 발송! 즉시 안내에 따르세요." }
      ];

      var quizPool = [];
      function getNextQuiz() {
        if (quizPool.length === 0) {
          quizPool = quizzes.slice();
          for (var i = quizPool.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = quizPool[i]; quizPool[i] = quizPool[j]; quizPool[j] = tmp;
          }
        }
        return quizPool.pop();
      }

      var gameWrap = document.getElementById("gameWrap");
      var loadingOverlay = document.getElementById("loadingOverlay");
      var bgLayerA = document.getElementById("bgLayerA");
      var bgLayerB = document.getElementById("bgLayerB");
      var decorLayer = document.getElementById("decorLayer");
      var world = document.getElementById("world");
      var player = document.getElementById("player");
      var scoreEl = document.getElementById("score");
      var timeEl = document.getElementById("time");
      var boosterText = document.getElementById("boosterText");
      var toast = document.getElementById("toast");
      var timerBar = document.getElementById("timerBar");
      var startOverlay = document.getElementById("startOverlay");
      var tutorialOverlay = document.getElementById("tutorialOverlay");
      var guideOverlay = document.getElementById("guideOverlay");
      var rankingOverlay = document.getElementById("rankingOverlay");
      var quizOverlay = document.getElementById("quizOverlay");
      var pauseOverlay = document.getElementById("pauseOverlay");
      var gameOverOverlay = document.getElementById("gameOverOverlay");
      var quizTitle = document.getElementById("quizTitle");
      var quizQuestion = document.getElementById("quizQuestion");
      var choices = document.getElementById("choices");
      var quizExplanation = document.getElementById("quizExplanation");
      var quizConfirmBtn = document.getElementById("quizConfirmBtn");
      var finalText = document.getElementById("finalText");
      var startBtn = document.getElementById("startBtn");
      var tutorialBtn = document.getElementById("tutorialBtn");
      var guideBtn = document.getElementById("guideBtn");
      var rankingBtn = document.getElementById("rankingBtn");
      var rulesBtn = document.getElementById("rulesBtn");
      var kitBtn = document.getElementById("kitBtn");
      var mainRankingBox = document.getElementById("mainRankingBox");
      var backMenuButtons = document.querySelectorAll(".backMenuBtn");
      var restartBtn = document.getElementById("restartBtn");
      var gameOverMainBtn = document.getElementById("gameOverMainBtn");
      var rankingBox = document.getElementById("rankingBox");
      var nicknameInput = document.getElementById("nicknameInput");
      var employeeInput = document.getElementById("employeeInput");
      var saveScoreBtn = document.getElementById("saveScoreBtn");
      var timerBarWrap = document.getElementById("timerBarWrap");
      var shareBtn = document.getElementById("shareBtn");
      var touchGuide = document.getElementById("touchGuide");
      var directionGuide = document.getElementById("directionGuide");
      var bgmToggle = document.getElementById("bgmToggle");
      var sfxToggle = document.getElementById("sfxToggle");
      var pauseBtn = document.getElementById("pauseBtn");
      var pauseScore = document.getElementById("pauseScore");
      var pauseBgmToggle = document.getElementById("pauseBgmToggle");
      var pauseSfxToggle = document.getElementById("pauseSfxToggle");
      var resumeBtn = document.getElementById("resumeBtn");
      var pauseMainBtn = document.getElementById("pauseMainBtn");
      var mainBgmToggle = document.getElementById("mainBgmToggle");
      var mainSfxToggle = document.getElementById("mainSfxToggle");

      var running = false;
      var paused = false;
      var userPaused = false;
      var pauseStartedAt = 0;
      var quizPausedAt = 0;
      var inputLocked = false;
      var moving = false;
      var score = 0;
      var seconds = 0;
      var currentIndex = 0;
      var cameraY = 0;
      var targetCameraY = 0;
      var revived = false;
      var booster = null;
      var boosterUntil = 0;
      var gameStartTime = 0;
      var lastQuizSecond = -1;
      var quizMode = "booster";
      var animationId = null;
      var steps = [];
      var playerPos = { x: 0, y: 0 };
      var playerStart = { x: 0, y: 0 };
      var playerTarget = { x: 0, y: 0 };
      var moveStartTime = 0;
      var moveDuration = 115;
      var stepDeadline = 0;
      var currentStepEl = null;
      var lastHudScoreInt = -1;
      var lastHudTimeInt = -1;
      var lastBoosterLabel = "";
      var currentStage = "ground";
      var activeBgLayer = "A";
      var lastLayoutWidth = 0;
      var lastLayoutHeight = 0;
      var lastPointerActionAt = 0;
      var lastPrunedIndex = 0;
      var lastFrameTime = 0;
      var lastTimerScale = -1;
      var timerUrgent = false;
      var audioPrepared = false;
      var gameStarting = false;
      var scoreUploadInProgress = false;
      var currentRecordSaved = false;
      var currentPublicRankingSaved = false;
      var currentAdminSheetSaved = false;
      var currentRecordCreatedAt = "";
      var STEP_W = 112;
      var STEP_GAP_X = 76;
      var STEP_GAP_Y = 62;
      var PLAYER_BASE_RATIO = 0.68;
      var BASE_STEP_TIME = 3400;
      var FRAME_INTERVAL = 1000 / 60;
      var HEAT_RULES_URL = "https://youtube.com/shorts/JonJSw9Eaxo?si=GrK2Yuo0xZKegQ9-";
      var HEAT_KIT_URL = "https://youtu.be/rsMf9EvUKt8?si=Hp1Ut4E_NMdFs_e0";

      /************************************************************
       * 사운드 설정
       ************************************************************/
      function safeStorageGet(key) {
        try {
          return window.localStorage ? localStorage.getItem(key) : null;
        } catch (err) {
          return null;
        }
      }

      function safeStorageSet(key, value) {
        try {
          if (window.localStorage) localStorage.setItem(key, value);
        } catch (err) {
          // iPhone 사파리 사설 모드/저장소 제한 상황에서도 게임은 계속 동작해야 합니다.
        }
      }

      function getBestScore() {
        var v = safeStorageGet("mirae_best");
        return v ? (parseInt(v, 10) || 0) : 0;
      }

      function saveBestScore(s) {
        if (s > getBestScore()) safeStorageSet("mirae_best", String(s));
      }

      var bgmEnabled = safeStorageGet("mirae_bgm") !== "off" && safeStorageGet("bgmEnabled") !== "false";
      var sfxEnabled = safeStorageGet("mirae_sfx") === "on";
      var isWebKit = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

      var bgm = new Audio("assets/bgm.mp3");
      var jumpSound = isWebKit ? null : new Audio("assets/Jump.wav");
      var quizSound = new Audio("assets/quiz.wav");
      var gameOverSound = new Audio("assets/gameover.mp3");

      bgm.preload = "none";
      if (jumpSound) { jumpSound.preload = "none"; }
      quizSound.preload = "none";
      gameOverSound.preload = "none";
      bgm.loop = true;
      bgm.volume = 0.35;

      if (jumpSound) { jumpSound.volume = 0.45; }
      quizSound.volume = 0.55;
      gameOverSound.volume = 0.6;

      function prepareAudio() {
        if (audioPrepared) return;
        audioPrepared = true;
        [bgm, jumpSound, quizSound, gameOverSound].filter(Boolean).forEach(function (sound) {
          try {
            sound.load();
          } catch (err) {
            // 사용자 입력 시점에도 오디오 로드가 제한되면 재생 함수가 조용히 처리합니다.
          }
        });
      }

      function updateSoundButtons() {
        bgmToggle.textContent = "🎵";
        sfxToggle.textContent = "🔔";
        bgmToggle.classList.toggle("off", !bgmEnabled);
        sfxToggle.classList.toggle("off", !sfxEnabled);
        bgmToggle.setAttribute("aria-pressed", String(bgmEnabled));
        sfxToggle.setAttribute("aria-pressed", String(sfxEnabled));
        mainBgmToggle.textContent = bgmEnabled ? "🎵 BGM ON" : "🎵 BGM OFF";
        mainSfxToggle.textContent = sfxEnabled ? "🔔 효과음 ON" : "🔔 효과음 OFF";
        pauseBgmToggle.textContent = bgmEnabled ? "🎵 BGM ON" : "🎵 BGM OFF";
        pauseSfxToggle.textContent = sfxEnabled ? "🔔 효과음 ON" : "🔔 효과음 OFF";
        pauseBgmToggle.classList.toggle("off", !bgmEnabled);
        pauseSfxToggle.classList.toggle("off", !sfxEnabled);
        pauseBgmToggle.setAttribute("aria-pressed", String(bgmEnabled));
        pauseSfxToggle.setAttribute("aria-pressed", String(sfxEnabled));
      }

      function playSfx(sound) {
        if (!sfxEnabled || userPaused || !sound) return;
        try {
          var playPromise;
          sound.currentTime = 0;
          playPromise = sound.play();
          if (playPromise && playPromise.catch) playPromise.catch(function () {});
        } catch (err) {
          // 모바일 브라우저의 오디오 정책 때문에 재생이 거부되어도 게임은 계속 진행합니다.
        }
      }

      function playBgm() {
        if (!bgmEnabled) return;
        try {
          var playPromise;
          bgm.currentTime = 0;
          playPromise = bgm.play();
          if (playPromise && playPromise.catch) playPromise.catch(function () {});
        } catch (err) {
          // 사용자 제스처 전 BGM 재생이 막히는 모바일 환경을 조용히 통과합니다.
        }
      }

      function stopBgm() {
        try {
          bgm.pause();
        } catch (err) {
          // 오디오 중단 실패는 무시 (게임 진행에 영향 없음)
        }
      }

      function toggleBgm(e) {
        if (e && e.stopPropagation) e.stopPropagation();
        bgmEnabled = !bgmEnabled;
        safeStorageSet("mirae_bgm", bgmEnabled ? "on" : "off");
        safeStorageSet("bgmEnabled", String(bgmEnabled));
        updateSoundButtons();
        if (bgmEnabled && running) playBgm();
        else stopBgm();
      }

      function toggleSfx(e) {
        if (e && e.stopPropagation) e.stopPropagation();
        sfxEnabled = !sfxEnabled;
        safeStorageSet("mirae_sfx", sfxEnabled ? "on" : "off");
        safeStorageSet("sfxEnabled", String(sfxEnabled));
        updateSoundButtons();
      }

      function initSupabase() {
        if (!window.supabase) return;
        if (SUPABASE_URL.indexOf("여기에_") !== -1 || SUPABASE_ANON_KEY.indexOf("여기에_") !== -1) return;
        try {
          supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        } catch (err) {
          console.error("Supabase 초기화 오류:", err);
          supabaseClient = null;
        }
      }

      var cachedW = 360;
      var cachedH = 640;
      var cachedWrapLeft = 0;
      function refreshLayoutCache() {
        var r = gameWrap.getBoundingClientRect();
        cachedW = r.width || gameWrap.clientWidth || 360;
        cachedH = r.height || gameWrap.clientHeight || 640;
        cachedWrapLeft = r.left;
      }
      function wrapW() { return cachedW; }
      function wrapH() { return cachedH; }
      function isSupabaseReady() {
        // Supabase CDN은 첫 화면을 막지 않도록 async로 불러옵니다.
        // 랭킹/기록 버튼을 누르는 시점에 준비되어 있으면 여기서 다시 연결합니다.
        if (!supabaseClient) initSupabase();
        return supabaseClient !== null;
      }

      function waitForSupabaseReady() {
        return new Promise(function (resolve) {
          var tries = 0;

          function check() {
            if (isSupabaseReady()) {
              resolve(true);
              return;
            }

            tries += 1;
            if (tries >= 20) {
              resolve(false);
              return;
            }

            setTimeout(check, 100);
          }

          check();
        });
      }
      function isGoogleSheetsReady() { return GOOGLE_SHEETS_WEBAPP_URL.indexOf("여기에_") === -1; }
      function escapeHtml(text) {
        return String(text)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/\"/g, "&quot;")
          .replace(/'/g, "&#039;");
      }

      function showToast(message, ms) {
        if (typeof ms !== "number") ms = 1200;
        toast.textContent = message;
        toast.classList.remove("hidden");
        clearTimeout(showToast.timer);
        showToast.timer = setTimeout(function () { toast.classList.add("hidden"); }, ms);
      }

      function updateHud() {
        var floorScore = Math.floor(score);
        if (lastHudScoreInt !== floorScore) {
          scoreEl.textContent = String(floorScore);
          lastHudScoreInt = floorScore;
        }
        if (lastHudTimeInt !== seconds) {
          timeEl.textContent = String(seconds);
          lastHudTimeInt = seconds;
        }
        if (!booster) {
          if (lastBoosterLabel !== "⚡ x0") {
            boosterText.classList.remove("active");
            boosterText.textContent = "⚡ x0";
            lastBoosterLabel = "⚡ x0";
          }
        }
      }

      function addDecor(className, left, top, text) {
        var el = document.createElement("div");
        el.className = "decor " + className;
        el.style.left = left + "%";
        el.style.top = top + "%";
        if (text) el.textContent = text;
        decorLayer.appendChild(el);
      }

      function renderDecor(stage) {
        if (!decorLayer) return;
        decorLayer.innerHTML = "";
        if (stage === "space") {
          addDecor("star", 20, 18);
          addDecor("star", 62, 35);
          return;
        }
        addDecor("sun", 10, 9);
        addDecor("cloud", 60, 22);
        // 온도 배지는 화면을 깔끔하게 보이도록 제거
        if (stage === "sky") addDecor("cloud", 18, 42);
      }

      function stageImage(stage) {
        if (stage === "sky") return "assets/bg_stage2.png";
        if (stage === "space") return "assets/bg_stage3.png";
        return "assets/bg_stage1.png";
      }

      function preloadStageBackgrounds() {
        var loadLaterStages = function () {
          ["sky", "space"].forEach(function (stage) {
            var img = new Image();
            img.src = stageImage(stage);
          });
        };
        if ("requestIdleCallback" in window) {
          window.requestIdleCallback(loadLaterStages, { timeout: 3000 });
        } else {
          setTimeout(loadLaterStages, 1500);
        }
      }

      var criticalImages = [
        "assets/main_background.png",
        "assets/bg_stage1.png",
        "assets/mirae.png",
        "assets/sun.png"
      ];

      function preloadImage(src) {
        return new Promise(function (resolve) {
          var img = new Image();
          var done = false;

          function finish(ok) {
            if (done) return;
            done = true;
            resolve(ok);
          }

          img.onload = function () { finish(true); };
          img.onerror = function () { finish(false); };
          img.src = src;

          // 네트워크나 파일 문제로 로딩이 오래 걸려도 첫 화면이 멈춰 보이지 않게 합니다.
          setTimeout(function () { finish(false); }, 2500);
        });
      }

      function preloadCriticalImages() {
        return Promise.all(criticalImages.map(preloadImage));
      }

      function waitForFonts() {
        if (!document.fonts || !document.fonts.ready) {
          return Promise.resolve();
        }

        return Promise.race([
          document.fonts.ready,
          new Promise(function (resolve) {
            setTimeout(resolve, 1800);
          })
        ]);
      }

      function revealMainMenuAfterLayout() {
        return new Promise(function (resolve) {
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              gameWrap.classList.add("mainReady");
              resolve();
            });
          });
        });
      }

      function hideLoadingOverlay() {
        if (!loadingOverlay) return;
        loadingOverlay.classList.add("hide");
        setTimeout(function () {
          loadingOverlay.style.display = "none";
        }, 400);
      }

      function setGameWrapStageClass(stage) {
        gameWrap.classList.remove("stage-ground", "stage-sky", "stage-space");
        gameWrap.classList.add("stage-" + stage);
      }

      function setStageBackground(stage, instant) {
        var currentLayer = activeBgLayer === "A" ? bgLayerA : bgLayerB;
        var nextLayer = activeBgLayer === "A" ? bgLayerB : bgLayerA;
        var image = 'url("' + stageImage(stage) + '")';
        if (!bgLayerA || !bgLayerB) return;

        if (instant) {
          bgLayerA.style.transition = "none";
          bgLayerB.style.transition = "none";
          bgLayerA.style.backgroundImage = image;
          bgLayerA.classList.add("active");
          bgLayerB.classList.remove("active");
          bgLayerB.style.backgroundImage = "";
          activeBgLayer = "A";
          requestAnimationFrame(function () {
            bgLayerA.style.transition = "";
            bgLayerB.style.transition = "";
          });
          return;
        }

        nextLayer.style.backgroundImage = image;
        nextLayer.classList.add("active");
        currentLayer.classList.remove("active");
        activeBgLayer = activeBgLayer === "A" ? "B" : "A";
      }

      function updateStage() {
        var stage = score < 500 ? "ground" : score < 1000 ? "sky" : "space";
        if (stage === currentStage) return;
        currentStage = stage;
        setGameWrapStageClass(stage);
        setStageBackground(stage, false);
        renderDecor(stage);
        if (stage === "sky") showToast("하늘 구간 진입!", 1000);
        if (stage === "space") showToast("우주 구간 진입!", 1000);
      }

      function clearWorld() {
        while (world.firstChild) world.removeChild(world.firstChild);
        steps = [];
        currentStepEl = null;
      }
      function clampX(x) { var margin = 70; return Math.max(margin, Math.min(wrapW() - margin, x)); }

      function makeStep(index, x, y, type, renderStep) {
        var el = null;
        if (renderStep !== false) {
          el = document.createElement("div");
          el.className = "step";
          el.style.left = (x - STEP_W / 2) + "px";
          el.style.top = y + "px";
          world.appendChild(el);
        }
        steps[index] = { index: index, x: x, y: y, type: type, el: el };
      }

      function appendNextStep(index, renderStep) {
        var prev = steps[index - 1];
        var dir = Math.random() > 0.5 ? 1 : -1;
        var nextX = prev.x + dir * STEP_GAP_X;
        if (nextX < 70 || nextX > wrapW() - 70) nextX = prev.x - dir * STEP_GAP_X;
        makeStep(index, clampX(nextX), prev.y - STEP_GAP_Y, "normal", renderStep);
      }

      function generateMap(targetIndex) {
        var i;
        var safeIndex = typeof targetIndex === "number" ? Math.max(0, targetIndex) : 0;
        var renderFrom = Math.max(0, safeIndex - 18);
        var totalSteps = Math.max(48, safeIndex + 25);
        var x = wrapW() / 2;
        var y = Math.floor(wrapH() * PLAYER_BASE_RATIO);
        clearWorld();
        makeStep(0, x, y, "normal", 0 >= renderFrom);
        // 과거 발판은 좌표 데이터만 유지하고 화면 주변 발판만 DOM으로 만듭니다.
        for (i = 1; i < totalSteps; i++) appendNextStep(i, i >= renderFrom);
        lastPrunedIndex = renderFrom;
      }

      function pruneOldSteps() {
        var pruneUntil = currentIndex - 18;
        var i;
        for (i = lastPrunedIndex; i < pruneUntil; i++) {
          if (steps[i] && steps[i].el && steps[i].el.parentNode) {
            steps[i].el.parentNode.removeChild(steps[i].el);
            steps[i].el = null;
          }
        }
        if (pruneUntil > lastPrunedIndex) lastPrunedIndex = pruneUntil;
      }
      function ensureMoreSteps() {
        var i;
        var start;
        var end;
        pruneOldSteps();
        if (currentIndex <= steps.length - 24) return;
        start = steps.length;
        end = start + 32;
        for (i = start; i < end; i++) appendNextStep(i);
      }

      function currentStep() { return steps[currentIndex]; }
      function nextStep() { return steps[currentIndex + 1]; }
      function getNextDirection() {
        var cur = currentStep();
        var nxt = nextStep();
        if (!cur || !nxt) return null;
        return nxt.x < cur.x ? "left" : "right";
      }
      function markCurrent() {
        if (currentStepEl) currentStepEl.classList.remove("current");
        currentStepEl = steps[currentIndex] ? steps[currentIndex].el : null;
        if (currentStepEl) currentStepEl.classList.add("current");
      }
      function renderWorld() { world.style.transform = "translate3d(0," + Math.round(cameraY) + "px,0)"; }
      function renderPlayer(extraScale, tilt) {
        if (typeof extraScale !== "number") extraScale = 1;
        if (typeof tilt !== "number") tilt = 0;
        player.style.transform = "translate3d(" + Math.round(playerPos.x) + "px, " + Math.round(playerPos.y + cameraY) + "px, 0) translate(-50%, -100%) scale(" + extraScale.toFixed(3) + ") rotate(" + tilt + "deg)";
      }
      function snapToCurrentStep() {
        var s = currentStep();
        if (!s) return;
        moving = false;
        inputLocked = false;
        cameraY = wrapH() * PLAYER_BASE_RATIO - s.y;
        targetCameraY = cameraY;
        playerPos.x = s.x;
        playerPos.y = s.y;
        playerStart.x = s.x;
        playerStart.y = s.y;
        playerTarget.x = s.x;
        playerTarget.y = s.y;
        renderWorld();
        renderPlayer(1, 0);
        markCurrent();
      }
      function getStepTimeLimit() {
        var limit = BASE_STEP_TIME - Math.min(1300, score * 4);
        if (booster === "slow") limit += 1100;
        return Math.max(2000, limit);
      }
      function resetDeadline() { stepDeadline = performance.now() + getStepTimeLimit(); }

      function shiftGameClock(duration) {
        if (!duration || duration <= 0) return;
        gameStartTime += duration;
        stepDeadline += duration;
        if (boosterUntil > 0) boosterUntil += duration;
        if (moving) moveStartTime += duration;
      }

      function updatePauseButtonVisibility() {
        var shouldShow = running && !userPaused && !paused && startOverlay.classList.contains("hidden") && quizOverlay.classList.contains("hidden") && gameOverOverlay.classList.contains("hidden");
        pauseBtn.classList.toggle("hidden", !shouldShow);
      }

      function updatePausePanel() {
        pauseScore.textContent = String(Math.floor(score)) + "점";
        updateSoundButtons();
      }

      function pauseGame(e) {
        if (e && e.stopPropagation) e.stopPropagation();
        if (!running || paused || !quizOverlay.classList.contains("hidden") || !gameOverOverlay.classList.contains("hidden")) return;
        userPaused = true;
        paused = true;
        pauseStartedAt = performance.now();
        updatePausePanel();
        pauseOverlay.classList.remove("hidden");
        updatePauseButtonVisibility();
      }

      function resumeGame(e) {
        var pauseDuration;
        if (e && e.stopPropagation) e.stopPropagation();
        if (!running || !userPaused) return;
        pauseDuration = performance.now() - pauseStartedAt;
        shiftGameClock(pauseDuration);
        userPaused = false;
        paused = false;
        pauseStartedAt = 0;
        pauseOverlay.classList.add("hidden");
        updatePauseButtonVisibility();
        startLoop();
      }

      function quitPausedGame(e) {
        if (e && e.stopPropagation) e.stopPropagation();
        if (animationId !== null) cancelAnimationFrame(animationId);
        animationId = null;
        running = false;
        paused = true;
        userPaused = false;
        pauseStartedAt = 0;
        quizPausedAt = 0;
        moving = false;
        inputLocked = false;
        stopBgm();
        pauseOverlay.classList.add("hidden");
        quizOverlay.classList.add("hidden");
        gameOverOverlay.classList.add("hidden");
        closeMenuPages();
        startOverlay.classList.remove("hidden");
        updatePauseButtonVisibility();
      }

      function closeMenuPages() {
        tutorialOverlay.classList.add("hidden");
        guideOverlay.classList.add("hidden");
        rankingOverlay.classList.add("hidden");
      }

      function showMainMenu(e) {
        if (e && e.stopPropagation) e.stopPropagation();
        closeMenuPages();
        gameOverOverlay.classList.add("hidden");
        quizOverlay.classList.add("hidden");
        pauseOverlay.classList.add("hidden");
        userPaused = false;
        quizPausedAt = 0;
        startOverlay.classList.remove("hidden");
        updatePauseButtonVisibility();
      }

      function openTutorial(e) {
        if (e && e.stopPropagation) e.stopPropagation();
        startOverlay.classList.add("hidden");
        closeMenuPages();
        tutorialOverlay.classList.remove("hidden");
      }

      function openExternalGuide(url, e) {
        if (e && e.stopPropagation) e.stopPropagation();
        window.open(url, "_blank", "noopener");
      }

      function openGuide(e) {
        if (e && e.stopPropagation) e.stopPropagation();
        startOverlay.classList.add("hidden");
        closeMenuPages();
        guideOverlay.classList.remove("hidden");
      }

      function openRanking(e) {
        if (e && e.stopPropagation) e.stopPropagation();
        startOverlay.classList.add("hidden");
        closeMenuPages();
        rankingOverlay.classList.remove("hidden");
        loadRanking(mainRankingBox);
      }

      async function loadRanking(targetBox) {
        var result;
        var html;
        var box = targetBox || rankingBox;
        if (!box) return;
        if (!(await waitForSupabaseReady())) {
          box.innerHTML = "🏆 현재 랭킹을 불러올 수 없어요. 잠시 후 다시 시도해주세요.";
          return;
        }
        box.innerHTML = "🏆 랭킹 불러오는 중...";
        result = await supabaseClient
          .from("scores")
          .select("nickname, score, created_at")
          .order("score", { ascending: false })
          .order("created_at", { ascending: true })
          .limit(5);
        if (result.error) {
          console.error(result.error);
          box.innerHTML = "🏆 랭킹 불러오기 실패";
          return;
        }
        if (!result.data || result.data.length === 0) {
          box.innerHTML = "🏆 아직 등록된 점수가 없어요";
          return;
        }
        html = '<div class="rankingTitle">🏆 TOP 5</div><table class="rankingTable"><thead><tr><th>순위</th><th>닉네임</th><th>점수</th></tr></thead><tbody>';
        result.data.forEach(function (row, index) {
          html += "<tr><td>" + String(index + 1) + "위</td><td>" + escapeHtml(row.nickname) + "</td><td>" + String(row.score) + "점</td></tr>";
        });
        html += "</tbody></table>";
        box.innerHTML = html;
      }

      async function savePublicRanking(nickname, finalScore) {
        if (!(await waitForSupabaseReady())) return { ok: false, skipped: true };
        var result = await supabaseClient.from("scores").insert([{ nickname: nickname, score: finalScore }]);
        if (result.error) {
          console.error(result.error);
          return { ok: false };
        }
        return { ok: true };
      }

      async function saveAdminSheet(nickname, employeeId, finalScore, survivalSeconds, createdAt) {
        if (!isGoogleSheetsReady()) return { ok: false, skipped: true };
        try {
          await fetch(GOOGLE_SHEETS_WEBAPP_URL, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({
              nickname: nickname,
              employee_id: employeeId,
              score: finalScore,
              survival_seconds: survivalSeconds,
              game: "미래 폭염계단",
              created_at: createdAt
            })
          });
          return { ok: true };
        } catch (err) {
          console.error(err);
          return { ok: false };
        }
      }

      function lockEmployeeInput() {
        employeeInput.readOnly = true;
        employeeInput.style.opacity = "0.55";
        employeeInput.style.cursor = "not-allowed";
      }
      function unlockEmployeeInput() {
        employeeInput.readOnly = false;
        employeeInput.style.opacity = "";
        employeeInput.style.cursor = "";
      }

      async function submitScoreRecord(e) {
        if (e && e.stopPropagation) e.stopPropagation();
        var nickname = nicknameInput.value.trim().slice(0, 8);
        var employeeId = employeeInput.value.trim().slice(0, 12);
        var finalScore = Math.floor(score);
        var publicResult = { ok: currentPublicRankingSaved, skipped: !currentPublicRankingSaved };
        var sheetResult = { ok: currentAdminSheetSaved, skipped: !currentAdminSheetSaved };

        if (scoreUploadInProgress) { showToast("이미 기록 중이에요!", 1200); return; }
        if (currentRecordSaved) { showToast("이미 업로드된 기록이에요!", 1300); return; }
        if (!employeeId) { showToast("사번을 입력해줘!", 1200); return; }
        if (!nickname) nickname = "익명";

        scoreUploadInProgress = true;
        saveScoreBtn.disabled = true;
        saveScoreBtn.textContent = "기록 중...";
        if (!currentPublicRankingSaved) {
          publicResult = await savePublicRanking(nickname, finalScore);
          currentPublicRankingSaved = publicResult.ok;
        }
        if (!currentAdminSheetSaved) {
          sheetResult = await saveAdminSheet(nickname, employeeId, finalScore, seconds, currentRecordCreatedAt);
          currentAdminSheetSaved = sheetResult.ok;
        }

        scoreUploadInProgress = false;
        saveScoreBtn.disabled = false;

        if ((!publicResult.ok && !publicResult.skipped) || (!sheetResult.ok && !sheetResult.skipped)) {
          showToast("일부 저장에 실패했어요. 다시 시도해주세요.", 2000);
          saveScoreBtn.textContent = currentAdminSheetSaved && !currentPublicRankingSaved
            ? "랭킹 반영 재시도"
            : (currentPublicRankingSaved && !currentAdminSheetSaved ? "기록 접수 재시도" : "기록하기");
          return;
        }
        if (currentAdminSheetSaved && !currentPublicRankingSaved) {
          showToast("기록은 접수됐지만 공개 랭킹 반영은 지연될 수 있어요.", 2800);
          saveScoreBtn.textContent = "랭킹 반영 재시도";
          return;
        }
        if (currentPublicRankingSaved && !currentAdminSheetSaved) {
          showToast("공개 랭킹은 반영됐지만 기록 접수가 완료되지 않았어요.", 2400);
          saveScoreBtn.textContent = "기록 접수 재시도";
          return;
        }
        if (!currentPublicRankingSaved && !currentAdminSheetSaved) {
          showToast("저장 설정 필요!", 1600);
          saveScoreBtn.textContent = "기록하기";
          return;
        }

        currentRecordSaved = true;
        safeStorageSet("mirae_employee_id", employeeId);
        lockEmployeeInput();
        saveScoreBtn.textContent = "기록 완료";
        showToast("기록과 공개 랭킹 반영 완료!", 1600);
        await loadRanking();
      }

      function resetGame() {
        if (animationId !== null) cancelAnimationFrame(animationId);
        animationId = null;
        stopBgm();
        running = true;
        paused = false;
        userPaused = false;
        pauseStartedAt = 0;
        quizPausedAt = 0;
        inputLocked = false;
        moving = false;
        score = 0;
        seconds = 0;
        revived = false;
        booster = null;
        boosterUntil = 0;
        gameStartTime = performance.now();
        lastQuizSecond = -1;
        currentIndex = 0;
        lastPrunedIndex = 0;
        lastFrameTime = 0;
        lastTimerScale = -1;
        lastHudScoreInt = -1;
        lastHudTimeInt = -1;
        timerUrgent = false;
        cameraY = 0;
        targetCameraY = 0;
        currentStage = "ground";
        refreshLayoutCache();
        lastLayoutWidth = cachedW;
        lastLayoutHeight = cachedH;
        pauseOverlay.classList.add("hidden");
        setGameWrapStageClass("ground");
        setStageBackground("ground", true);
        renderDecor("ground");
        player.classList.remove("invincible");
        timerBar.style.transform = "scaleX(1)";
        timerBarWrap.classList.remove("urgent");
        touchGuide.style.transition = "";
        touchGuide.style.opacity = "1";
        directionGuide.style.transition = "";
        directionGuide.style.opacity = "1";
        generateMap();
        snapToCurrentStep();
        resetDeadline();
        updateHud();
        updatePauseButtonVisibility();
      }

      function isAnyOverlayOpen() {
        return !startOverlay.classList.contains("hidden") || !tutorialOverlay.classList.contains("hidden") || !guideOverlay.classList.contains("hidden") || !rankingOverlay.classList.contains("hidden") || !quizOverlay.classList.contains("hidden") || !pauseOverlay.classList.contains("hidden") || !gameOverOverlay.classList.contains("hidden");
      }

      function startGame(e) {
        if (e && e.stopPropagation) e.stopPropagation();
        if (gameStarting) return;
        gameStarting = true;
        try {
          startOverlay.classList.add("hidden");
          closeMenuPages();
          gameOverOverlay.classList.add("hidden");
          quizOverlay.classList.add("hidden");
          pauseOverlay.classList.add("hidden");
          prepareAudio();
          resetGame();
          // 2프레임 대기 중 터치 입력 차단 (resetGame이 inputLocked=false로 열어두므로 재잠금)
          inputLocked = true;
          showToast("준비!", 350);
          playBgm();
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              // DOM 커밋·페인트 완료 후 타이머/입력을 실제 루프 기준으로 재설정
              gameStarting = false;
              gameStartTime = performance.now();
              resetDeadline();
              lastFrameTime = 0;
              inputLocked = false;
              startLoop();
            });
          });
        } catch (err) {
          gameStarting = false;
          console.error("게임 시작 오류:", err);
          showToast("게임을 시작할 수 없어요. 페이지를 새로고침 해주세요.", 3500);
          startOverlay.classList.remove("hidden");
        }
      }

      function applyBooster() {
        var types = ["shield", "slow", "double"];
        booster = types[Math.floor(Math.random() * types.length)];
        boosterUntil = performance.now() + 5000;
        if (booster === "shield") {
          player.classList.add("invincible");
          playSfx(quizSound);
          showToast("정답! 실수방어 5초", 1500);
        } else if (booster === "slow") {
          playSfx(quizSound);
          showToast("정답! 시간 여유 5초", 1500);
        } else {
          playSfx(quizSound);
          showToast("정답! 점수 2배 5초", 1500);
        }
      }
      function clearBooster() {
        booster = null;
        boosterUntil = 0;
        player.classList.remove("invincible");
        boosterText.classList.remove("active");
        boosterText.textContent = "⚡ x0";
        lastBoosterLabel = "⚡ x0";
      }
      function openQuiz(mode) {
        var q = getNextQuiz();
        paused = true;
        quizPausedAt = performance.now();
        updatePauseButtonVisibility();
        quizMode = mode;
        quizOverlay.classList.remove("hidden");
        choices.innerHTML = "";

        quizTitle.textContent = mode === "revive" ? "부활 폭염퀴즈" : "보너스 폭염퀴즈";
        quizQuestion.textContent = q.question;
        quizExplanation.textContent = "";
        quizExplanation.className = "hidden";
        quizConfirmBtn.className = "hidden";
        q.choices.forEach(function (choice, index) {
          var btn = document.createElement("button");
          btn.type = "button";
          btn.className = "choiceBtn";
          btn.textContent = String(index + 1) + ". " + choice;
          btn.addEventListener("click", function (event) {
            event.stopPropagation();
            var correct = index === q.answer;
            choices.querySelectorAll(".choiceBtn").forEach(function (b) { b.disabled = true; });
            btn.classList.add(correct ? "choiceCorrect" : "choiceWrong");
            if (!correct) {
              choices.querySelectorAll(".choiceBtn")[q.answer].classList.add("choiceCorrect");
            }
            quizExplanation.textContent = (correct ? "✅ 정답! " : "❌ 오답! ") + q.explanation;
            quizExplanation.className = correct ? "quizExplanationCorrect" : "quizExplanationWrong";
            quizConfirmBtn.className = "";
            quizConfirmBtn._correct = correct;
          });
          choices.appendChild(btn);
        });
      }
      function answerQuiz(correct) {
        var quizPauseDuration = quizPausedAt ? performance.now() - quizPausedAt : 0;
        shiftGameClock(quizPauseDuration);
        quizPausedAt = 0;
        quizOverlay.classList.add("hidden");
        if (quizMode === "booster") {
          if (correct) applyBooster();
          else showToast("오답! 부스터 없음");
          paused = false;
          updatePauseButtonVisibility();
          startLoop();
          return;
        }
        if (quizMode === "revive") {
          if (correct) {
            revived = true;
            showToast("부활 성공!", 1500);
            paused = false;
            snapToCurrentStep();
            resetDeadline();
            updatePauseButtonVisibility();
            startLoop();
          } else {
            endGame();
          }
        }
      }
      function gameOver(reason) {
        if (!running || paused) return;
        if (!revived) {
          paused = true;
          updatePauseButtonVisibility();
          showToast("퀴즈를 맞히면 부활할 수 있어요! 💪", 600);
          setTimeout(function () {
            if (!running) return;
            openQuiz("revive");
          }, 400);
        } else {
          endGame();
        }
      }
      function endGame() {
        running = false;
        paused = true;
        userPaused = false;
        pauseStartedAt = 0;
        quizPausedAt = 0;
        stopBgm();
        playSfx(gameOverSound);
        if (animationId !== null) cancelAnimationFrame(animationId);
        animationId = null;
        pauseOverlay.classList.add("hidden");
        gameOverOverlay.classList.remove("hidden");
        updatePauseButtonVisibility();
        currentRecordCreatedAt = new Date().toISOString();
        scoreUploadInProgress = false;
        currentRecordSaved = false;
        currentPublicRankingSaved = false;
        currentAdminSheetSaved = false;
        var finalScore = Math.floor(score);
        var prevBest = getBestScore();
        var isNewBest = finalScore > prevBest;
        saveBestScore(finalScore);
        var bestLine = isNewBest
          ? '<span class="resultBest newBest">🎉 최고 기록 갱신!</span>'
          : (prevBest > 0 ? '<span class="resultBest">최고 기록 ' + prevBest + '점</span>' : '');
        finalText.innerHTML = '<span class="resultLabel">최종 점수</span><strong class="resultScore">' + finalScore + '점</strong>' + bestLine + '<span class="resultTime">생존 시간 ' + seconds + '초</span>';
        nicknameInput.value = "";
        var _savedId = safeStorageGet("mirae_employee_id");
        if (_savedId) {
          employeeInput.value = _savedId;
          lockEmployeeInput();
        } else {
          employeeInput.value = "";
          unlockEmployeeInput();
        }
        saveScoreBtn.disabled = false;
        saveScoreBtn.textContent = "기록하기";
        if (navigator.share) {
          shareBtn.classList.remove("hidden");
        } else {
          shareBtn.classList.add("hidden");
        }
        loadRanking();
      }
      function handleTimedQuiz() {
        if (seconds > 0 && seconds % 20 === 0 && lastQuizSecond !== seconds) {
          lastQuizSecond = seconds;
          openQuiz("booster");
          updateHud();
          return true;
        }
        return false;
      }
      function updateBooster(now) {
        var remain;
        var label;
        if (!booster) return;
        remain = Math.max(0, Math.ceil((boosterUntil - now) / 1000));
        label = booster === "shield" ? "🛡 " : booster === "slow" ? "⏳ " : "⚡ x2 ";
        label = label + remain + "s";
        if (lastBoosterLabel !== label) {
          boosterText.classList.add("active");
          boosterText.textContent = label;
          lastBoosterLabel = label;
        }
        if (now >= boosterUntil) clearBooster();
      }
      function beginMoveToNext(direction) {
        var expected = getNextDirection();
        var nxt = nextStep();
        var cur = currentStep();
        if (!running || paused || inputLocked || moving || !nxt || !cur) return;
        if (direction !== expected) {
          if (booster === "shield") {
            clearBooster();
            showToast("실수 방어!", 900);
            resetDeadline();
            return;
          }
          // B안: 첫 3스텝은 실수해도 경고만 주고 계속 진행 (조작법 학습 유예)
          if (score < 3) {
            showToast("반대 방향이에요! (" + (3 - score) + "번 더 연습 가능)", 1100);
            resetDeadline();
            return;
          }
          gameOver("방향 실수!");
          return;
        }
        inputLocked = true;
        moving = true;
        playSfx(jumpSound);
        moveStartTime = performance.now();
        playerStart.x = cur.x;
        playerStart.y = cur.y;
        playerTarget.x = nxt.x;
        playerTarget.y = nxt.y;
        currentIndex += 1;
        score += booster === "double" ? 2 : 1;
        targetCameraY = wrapH() * PLAYER_BASE_RATIO - nxt.y;
        resetDeadline();
        markCurrent();
        updateHud();
        updateStage();
        if (score >= 5 && touchGuide.style.opacity !== "0") {
          touchGuide.style.transition = "opacity 0.8s";
          touchGuide.style.opacity = "0";
          directionGuide.style.transition = "opacity 0.8s";
          directionGuide.style.opacity = "0";
        }
      }
      function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
      function updateMovement(now, dt) {
        if (!moving) return;
        var t = Math.min(1, (now - moveStartTime) / moveDuration);
        var e = easeOutCubic(t);
        var arc = Math.sin(t * Math.PI) * 18;
        var dir = playerTarget.x < playerStart.x ? -1 : 1;
        playerPos.x = playerStart.x + (playerTarget.x - playerStart.x) * e;
        playerPos.y = playerStart.y + (playerTarget.y - playerStart.y) * e - arc;
        var camAlpha = 1 - Math.pow(0.68, dt / 16.67);
        cameraY = cameraY + (targetCameraY - cameraY) * camAlpha;
        renderWorld();
        renderPlayer(1 + Math.sin(e * Math.PI) * 0.08, dir * 8);
        if (t >= 1) {
          moving = false;
          inputLocked = false;
          playerPos.x = playerTarget.x;
          playerPos.y = playerTarget.y;
          cameraY = targetCameraY;
          renderWorld();
          renderPlayer(1, 0);
          markCurrent();
        }
      }
      function updateTimer(now) {
        var remain = Math.max(0, stepDeadline - now);
        var ratio = remain / getStepTimeLimit();
        var scale = Math.round(Math.max(0, Math.min(1, ratio)) * 120) / 120;
        var urgent = ratio < 0.25;
        if (scale !== lastTimerScale) {
          timerBar.style.transform = "scaleX(" + scale + ")";
          lastTimerScale = scale;
        }
        if (urgent !== timerUrgent) {
          timerBarWrap.classList.toggle("urgent", urgent);
          timerUrgent = urgent;
        }
        if (remain <= 0 && !moving) gameOver("시간 초과!");
      }
      function startLoop() {
        if (!running || paused || animationId !== null) return;
        animationId = requestAnimationFrame(loop);
      }
      function loop(now) {
        animationId = null;
        if (!running || paused) return;
        animationId = requestAnimationFrame(loop);
        var dt = lastFrameTime > 0 ? Math.min(33, now - lastFrameTime) : 16.67;
        lastFrameTime = now;
        seconds = Math.floor((now - gameStartTime) / 1000);
        if (handleTimedQuiz()) return;
        updateBooster(now);
        updateMovement(now, dt);
        updateTimer(now);
        updateHud();
        ensureMoreSteps();
      }

      function stopOverlayTouch(e) { if (e && e.stopPropagation) e.stopPropagation(); }
      function handleStartButton(e) { if (e && e.stopPropagation) e.stopPropagation(); startGame(e); }
      function handleSaveButton(e) { if (e && e.stopPropagation) e.stopPropagation(); submitScoreRecord(e); }
      function handleFallbackClick(e, handler) {
        if (Date.now() - lastPointerActionAt < 650) {
          stopOverlayTouch(e);
          return;
        }
        handler(e);
      }

      document.addEventListener("pointerup", function () {
        lastPointerActionAt = Date.now();
      }, true);

      gameWrap.addEventListener("pointerdown", function (e) {
        if (!running || paused || isAnyOverlayOpen()) return;
        beginMoveToNext((e.clientX - cachedWrapLeft) < cachedW / 2 ? "left" : "right");
      });
      window.addEventListener("keydown", function (e) {
        if (!running || paused || isAnyOverlayOpen()) return;
        if (e.key === "ArrowLeft") beginMoveToNext("left");
        if (e.key === "ArrowRight") beginMoveToNext("right");
      });
      var _resizeRafPending = false;
      window.addEventListener("resize", function () {
        refreshLayoutCache(); // wrapW()/wrapH() 즉시 최신화
        if (!running) return;
        // 주소창 접힘 등 미세 변화는 무시, orientation change 등 큰 변화만 처리
        if (Math.abs(cachedW - lastLayoutWidth) < 24 && Math.abs(cachedH - lastLayoutHeight) < 120) return;
        if (_resizeRafPending) return; // 한 프레임에 한 번만 실행
        _resizeRafPending = true;
        requestAnimationFrame(function () {
          _resizeRafPending = false;
          refreshLayoutCache(); // 레이아웃이 완전히 정착된 뒤 다시 읽기
          if (Math.abs(cachedW - lastLayoutWidth) < 24 && Math.abs(cachedH - lastLayoutHeight) < 120) return;
          lastLayoutWidth = cachedW;
          lastLayoutHeight = cachedH;
          var savedIndex = currentIndex;
          generateMap(savedIndex);
          currentIndex = savedIndex;
          snapToCurrentStep();
          resetDeadline();
        });
      });

      document.addEventListener("visibilitychange", function () {
        if (!document.hidden && running && !paused) {
          lastFrameTime = 0;
          if (animationId === null) startLoop();
        }
      });

      startOverlay.addEventListener("pointerdown", stopOverlayTouch);
      tutorialOverlay.addEventListener("pointerdown", stopOverlayTouch);
      guideOverlay.addEventListener("pointerdown", stopOverlayTouch);
      rankingOverlay.addEventListener("pointerdown", stopOverlayTouch);
      quizOverlay.addEventListener("pointerdown", stopOverlayTouch);
      quizConfirmBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        answerQuiz(!!quizConfirmBtn._correct);
      });
      pauseOverlay.addEventListener("pointerdown", stopOverlayTouch);
      gameOverOverlay.addEventListener("pointerdown", stopOverlayTouch);
      nicknameInput.addEventListener("pointerdown", stopOverlayTouch);
      employeeInput.addEventListener("pointerdown", stopOverlayTouch);
      nicknameInput.addEventListener("click", stopOverlayTouch);
      employeeInput.addEventListener("click", stopOverlayTouch);
      nicknameInput.addEventListener("touchstart", stopOverlayTouch);
      employeeInput.addEventListener("touchstart", stopOverlayTouch);
      bgmToggle.addEventListener("pointerdown", stopOverlayTouch);
      sfxToggle.addEventListener("pointerdown", stopOverlayTouch);
      pauseBtn.addEventListener("pointerdown", stopOverlayTouch);
      pauseBgmToggle.addEventListener("pointerdown", stopOverlayTouch);
      pauseSfxToggle.addEventListener("pointerdown", stopOverlayTouch);
      resumeBtn.addEventListener("pointerdown", stopOverlayTouch);
      pauseMainBtn.addEventListener("pointerdown", stopOverlayTouch);

      startBtn.addEventListener("pointerup", handleStartButton);
      tutorialBtn.addEventListener("pointerup", openTutorial);
      guideBtn.addEventListener("pointerup", openGuide);
      rankingBtn.addEventListener("pointerup", openRanking);
      rulesBtn.addEventListener("pointerup", function (e) { openExternalGuide(HEAT_RULES_URL, e); });
      kitBtn.addEventListener("pointerup", function (e) { openExternalGuide(HEAT_KIT_URL, e); });
      backMenuButtons.forEach(function (btn) {
        btn.addEventListener("pointerup", showMainMenu);
        btn.addEventListener("click", function (e) { handleFallbackClick(e, showMainMenu); });
      });
      restartBtn.addEventListener("pointerup", handleStartButton);
      gameOverMainBtn.addEventListener("pointerup", showMainMenu);
      saveScoreBtn.addEventListener("pointerup", handleSaveButton);
      shareBtn.addEventListener("pointerup", function (e) {
        e.stopPropagation();
        if (!navigator.share) return;
        navigator.share({
          title: "미래의 계단(폭염편)",
          text: "\n나 " + Math.floor(score) + "점 찍었어! 같이 도전해봐 ☀️",
          url: "https://mirae-stairs.netlify.app/"
        }).catch(function () {});
      });
      shareBtn.addEventListener("click", function (e) { handleFallbackClick(e, function () {
        if (!navigator.share) return;
        navigator.share({
          title: "미래의 계단(폭염편)",
          text: "\n나 " + Math.floor(score) + "점 찍었어! 같이 도전해봐 ☀️",
          url: "https://mirae-stairs.netlify.app/"
        }).catch(function () {});
      }); });
      pauseBtn.addEventListener("pointerup", pauseGame);
      resumeBtn.addEventListener("pointerup", resumeGame);
      pauseMainBtn.addEventListener("pointerup", quitPausedGame);
      startBtn.addEventListener("click", function (e) { handleFallbackClick(e, handleStartButton); });
      tutorialBtn.addEventListener("click", function (e) { handleFallbackClick(e, openTutorial); });
      guideBtn.addEventListener("click", function (e) { handleFallbackClick(e, openGuide); });
      rankingBtn.addEventListener("click", function (e) { handleFallbackClick(e, openRanking); });
      rulesBtn.addEventListener("click", function (e) { handleFallbackClick(e, function (event) { openExternalGuide(HEAT_RULES_URL, event); }); });
      kitBtn.addEventListener("click", function (e) { handleFallbackClick(e, function (event) { openExternalGuide(HEAT_KIT_URL, event); }); });
      restartBtn.addEventListener("click", function (e) { handleFallbackClick(e, handleStartButton); });
      gameOverMainBtn.addEventListener("click", function (e) { handleFallbackClick(e, showMainMenu); });
      saveScoreBtn.addEventListener("click", function (e) { handleFallbackClick(e, handleSaveButton); });
      pauseBtn.addEventListener("click", function (e) { handleFallbackClick(e, pauseGame); });
      resumeBtn.addEventListener("click", function (e) { handleFallbackClick(e, resumeGame); });
      pauseMainBtn.addEventListener("click", function (e) { handleFallbackClick(e, quitPausedGame); });

      bgmToggle.addEventListener("pointerup", toggleBgm);
      sfxToggle.addEventListener("pointerup", toggleSfx);
      pauseBgmToggle.addEventListener("pointerup", toggleBgm);
      pauseSfxToggle.addEventListener("pointerup", toggleSfx);
      mainBgmToggle.addEventListener("pointerup", toggleBgm);
      mainSfxToggle.addEventListener("pointerup", toggleSfx);
      bgmToggle.addEventListener("click", function (e) { handleFallbackClick(e, toggleBgm); });
      sfxToggle.addEventListener("click", function (e) { handleFallbackClick(e, toggleSfx); });
      pauseBgmToggle.addEventListener("click", function (e) { handleFallbackClick(e, toggleBgm); });
      pauseSfxToggle.addEventListener("click", function (e) { handleFallbackClick(e, toggleSfx); });
      mainBgmToggle.addEventListener("click", function (e) { handleFallbackClick(e, toggleBgm); });
      mainSfxToggle.addEventListener("click", function (e) { handleFallbackClick(e, toggleSfx); });

      function runSelfTests() {
        console.assert(Array.isArray(quizzes), "퀴즈 데이터는 배열이어야 합니다.");
        console.assert(quizzes.length > 0, "퀴즈 데이터가 있어야 합니다.");
        console.assert(quizzes.every(function (q) { return q.choices[q.answer] !== undefined; }), "모든 퀴즈의 정답 번호가 보기 범위 안이어야 합니다.");
        console.assert(player && player.id === "player", "캐릭터 요소가 있어야 합니다.");
        console.assert(typeof submitScoreRecord === "function", "점수 기록 함수가 있어야 합니다.");
        console.assert(typeof startGame === "function", "게임 시작 함수가 있어야 합니다.");
        console.assert(typeof initSupabase === "function", "Supabase 초기화 함수가 있어야 합니다.");
      }

      history.pushState(null, "", location.href);
      window.addEventListener("popstate", function () {
        history.pushState(null, "", location.href);
        if (running && !paused) pauseGame();
      });

      function initGame() {
        try {
          var _initSavedId = safeStorageGet("mirae_employee_id");
          if (_initSavedId) {
            employeeInput.value = _initSavedId;
            lockEmployeeInput();
          }
          updateSoundButtons();
          initSupabase();
          preloadStageBackgrounds();
          setGameWrapStageClass("ground");
          setStageBackground("ground", true);
          renderDecor("ground");
          refreshLayoutCache();
          lastLayoutWidth = cachedW;
          lastLayoutHeight = cachedH;
          updatePauseButtonVisibility();
        } catch (err) {
          console.error("초기화 오류:", err);
          gameWrap.classList.add("mainReady");
          startOverlay.classList.remove("hidden");
          hideLoadingOverlay();
          return;
        }

        Promise.all([preloadCriticalImages(), waitForFonts()]).then(function () {
          return revealMainMenuAfterLayout();
        }).then(function () {
          hideLoadingOverlay();
          runSelfTests();
        });
      }

      initGame();
    })();
