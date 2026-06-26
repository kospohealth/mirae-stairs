(function () {
      "use strict";

      var SUPABASE_URL = "https://efdvamzvbaazajcleasa.supabase.co";
      var SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmZHZhbXp2YmFhemFqY2xlYXNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NDcxNDgsImV4cCI6MjA5NDQyMzE0OH0.rJlBtts7lKC9VwZ7HLxrn1xOk8BXpsw1hvTl5HWCcRg";
      var GOOGLE_SHEETS_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbxPIFd_FeqGJQEz0MBxEcWVT10eeR4n9ZCJqtWhPv5OYFAUx-I_aehPQoJkJ7WxZCpa/exec";
      var supabaseClient = null;

      var quizzes = [
        { question: "폭염 시 가장 중요한 행동은?", choices: ["수분섭취와 휴식", "참고 버티기", "두꺼운 옷 입기"], answer: 0 },
        { question: "체감온도 33℃ 이상이면?", choices: ["쉬지 않고 작업", "물을 마시지 않기", "2시간마다 20분 휴식"], answer: 2 },
        { question: "폭염 때 시원한 물은?", choices: ["하루 한 번만 마신다", "충분히 자주 마신다", "뜨거운 커피만 마신다"], answer: 1 },
        { question: "온열질환 의심 시 가장 먼저 할 일은?", choices: ["시원한 곳으로 이동", "더 오래 작업", "햇볕 아래 있기"], answer: 0 },
        { question: "폭염 작업 시 좋은 휴식 장소는?", choices: ["그늘 또는 시원한 곳", "뜨거운 바닥", "직사광선 아래"], answer: 0 },
        { question: "폭염 예방에 도움이 되는 것은?", choices: ["보냉장구 착용", "두꺼운 담요", "밀폐된 공간"], answer: 0 },
        { question: "체감온도 35℃ 이상 폭염경보 때 권고되는 것은?", choices: ["가장 더울 때 작업하기", "휴식 줄이기", "무더위 시간대 옥외작업 중지"], answer: 2 },
        { question: "어지럽고 식은땀이 나면?", choices: ["더 빨리 움직이기", "즉시 쉬고 상태 확인", "물을 피하기"], answer: 1 },
        { question: "몸을 식히는 데 좋은 방법은?", choices: ["뜨거운 장소로 이동", "햇볕 오래 쬐기", "시원한 물과 그늘"], answer: 2 },
        { question: "체감온도 38℃ 이상이면?", choices: ["긴급작업 외 옥외작업 중지", "휴식 없이 작업", "작업속도 높이기"], answer: 0 },
        { question: "동료가 온열질환으로 의식이 이상하면?", choices: ["119에 신고", "혼자 쉬게 두기", "운동을 시키기"], answer: 0 },
        { question: "폭염 시 갈증이 나기 전에도 해야 할 일은?", choices: ["물을 참기", "카페인만 마시기", "물을 조금씩 자주 마시기"], answer: 2 },
        { question: "폭염으로 어지럽고 메스꺼우면 해야 하는 행동은?", choices: ["더 빨리 움직이기", "시원한 곳으로 이동하기", "그냥 참기"], answer: 1 },
        { question: "체감온도 33℃ 이상일 때 권장되는 것은?", choices: ["쉬지 않고 작업", "2시간마다 20분 이상 휴식", "물을 마시지 않기"], answer: 1 },
        { question: "폭염 시 가장 피해야 하는 행동은?", choices: ["그늘에서 쉬기", "갈증날 때까지 물 안 마시기", "시원한 물 마시기"], answer: 2 },
        { question: "온열질환 증상으로 맞는 것은?", choices: ["어지러움", "손발 얼음처럼 차가움", "콧물만 남"], answer: 0 },
        { question: "폭염 작업 시 좋은 복장은?", choices: ["두꺼운 검은 옷", "통풍 잘 되는 밝은 옷", "패딩점퍼"], answer: 1 },
        { question: "온열질환자가 의식이 없다면?", choices: ["물을 마시게 한다", "잠깐 기다린다", "즉시 119에 신고한다"], answer: 2 },
        { question: "폭염 시간대 중 가장 더운 시간은?", choices: ["오후 2~5시", "새벽 5시", "오전 8시"], answer: 0 },
        { question: "폭염 시 쉬기 좋은 장소는?", choices: ["햇볕 아래", "밀폐된 차량 안", "그늘지고 시원한 곳"], answer: 2 },
        { question: "온열질환 예방에 도움이 되는 것은?", choices: ["규칙적인 휴식", "무리한 운동", "물 안 마시기"], answer: 0 },
        { question: "폭염 속 차량 안이 위험한 이유는?", choices: ["너무 조용해서", "온도가 매우 빨리 올라가서", "창문이 많아서"], answer: 1 },
        { question: "땀을 많이 흘렸을 때 가장 필요한 것은?", choices: ["수분 보충", "뜨거운 커피", "두꺼운 담요"], answer: 0 },
        { question: "폭염 시 위험할 수 있는 장소는?", choices: ["그늘막 아래", "환기 안 되는 밀폐공간", "에어컨 있는 실내"], answer: 1 },
        { question: "야외 작업 시 도움이 되는 것은?", choices: ["목도리", "냉각조끼", "털장갑"], answer: 1 },
        { question: "사업장에서 폭염 대비 제공해야 하는 것은?", choices: ["시원한 물", "뜨거운 국물", "겨울 외투"], answer: 0 },
        { question: "온열질환자가 의식이 없을 때 해야 하는 행동은?", choices: ["따뜻한 곳으로 이동", "몸 식혀주기", "억지로 물 먹이기"], answer: 1 },
        { question: "몸을 식히는 방법으로 맞는 것은?", choices: ["두꺼운 옷 입기", "선풍기 사용하기", "햇볕 아래 있기"], answer: 1 },
        { question: "폭염주의보 기준 체감온도는?", choices: ["33℃ 이상", "20℃ 이상", "15℃ 이하"], answer: 0 },
        { question: "폭염경보 기준 체감온도는?", choices: ["25℃ 이상", "40℃ 이상", "35℃ 이상"], answer: 2 },
        { question: "폭염 속 건강을 지키는 가장 좋은 습관은?", choices: ["무리하지 않기", "쉬지 않고 움직이기", "물 안 마시기"], answer: 0 },
        { question: "폭우가 올 때 가장 안전한 행동은?", choices: ["하천 근처로 구경 간다", "지하주차장으로 이동한다", "높은 곳이나 실내로 대피한다"], answer: 2 },
        { question: "태풍이 올 때 창문 관리로 가장 올바른 것은?", choices: ["창문을 열어 둔다", "창문을 테이프로 보강하거나 단단히 닫는다", "창문을 조금만 열어둔다"], answer: 1 },
        { question: "집중호우 시 차량 운전 중 가장 위험한 행동은?", choices: ["속도를 줄인다", "침수 도로를 무리하게 통과한다", "라이트를 켠다"], answer: 1 },
        { question: "침수 위험이 있는 장소는?", choices: ["언덕 위 주택", "지하상가", "고층 아파트"], answer: 1 },
        { question: "태풍 대비로 미리 해야 할 일은?", choices: ["창문 주변 정리 및 외부 물건 고정", "집 밖으로 나가 상황 확인", "가벼운 옷 준비만 한다"], answer: 0 },
        { question: "호우 시 하천 근처에서 해야 할 행동은?", choices: ["사진 찍는다", "즉시 벗어난다", "물 흐름을 확인한다"], answer: 1 },
        { question: "정전이 예상되는 태풍 상황에서 준비물은?", choices: ["손전등, 비상식량", "선풍기만 준비", "휴대폰만 충전"], answer: 0 },
        { question: "폭우 중 가장 위험한 장소는?", choices: ["대형마트 내부", "산사태 위험 지역", "카페"], answer: 1 },
        { question: "침수된 길을 걸어야 한다면 가장 안전한 방법은?", choices: ["맨발로 빠르게 이동", "물 깊이를 확인하고 우회", "뛰어서 통과"], answer: 1 },
        { question: "재난 문자(긴급알림)를 받았을 때 해야 할 행동은?", choices: ["무시하고 하던 일 계속", "내용 확인 후 안내에 따라 행동", "바로 SNS에 공유만 한다"], answer: 1 }
      ];

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
      var lastHudScore = "";
      var lastHudTime = "";
      var lastBoosterLabel = "";
      var currentStage = "ground";
      var activeBgLayer = "A";
      var lastLayoutWidth = 0;
      var lastLayoutHeight = 0;
      var lastPointerActionAt = 0;
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

      var bgmEnabled = safeStorageGet("mirae_bgm") !== "off" && safeStorageGet("bgmEnabled") !== "false";
      var sfxEnabled = safeStorageGet("mirae_sfx") !== "off" && safeStorageGet("sfxEnabled") !== "false";

      var bgm = new Audio("assets/bgm.mp3");
      var jumpSound = new Audio("assets/Jump.wav");
      var quizSound = new Audio("assets/quiz.wav");
      var gameOverSound = new Audio("assets/gameover.mp3");

      bgm.preload = "auto";
      jumpSound.preload = "auto";
      quizSound.preload = "auto";
      gameOverSound.preload = "auto";
      bgm.loop = true;
      bgm.volume = 0.35;

      jumpSound.volume = 0.45;
      quizSound.volume = 0.55;
      gameOverSound.volume = 0.6;

      [bgm, jumpSound, quizSound, gameOverSound].forEach(function (sound) {
        try {
          sound.load();
        } catch (err) {
          // 일부 모바일 브라우저는 사용자 입력 전 오디오 로드를 제한합니다.
        }
      });

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
          console.error(err);
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

      function wrapW() { return gameWrap.clientWidth || 360; }
      function wrapH() { return gameWrap.clientHeight || 640; }
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
        var scoreText = String(Math.floor(score));
        var timeText = String(seconds);
        if (lastHudScore !== scoreText) {
          scoreEl.textContent = scoreText;
          lastHudScore = scoreText;
        }
        if (lastHudTime !== timeText) {
          timeEl.textContent = timeText;
          lastHudTime = timeText;
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
        ["ground", "sky", "space"].forEach(function (stage) {
          var img = new Image();
          img.src = stageImage(stage);
        });
      }

      var criticalImages = [
        "assets/main_background.png",
        "assets/bg_stage1.png",
        "assets/bg_stage2.png",
        "assets/bg_stage3.png",
        "assets/mirae.png",
        "assets/sun.png",
        "assets/tutorial_1.png"
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

      function clearWorld() { world.innerHTML = ""; steps = []; currentStepEl = null; }
      function clampX(x) { var margin = 70; return Math.max(margin, Math.min(wrapW() - margin, x)); }

      function makeStep(index, x, y, type) {
        var el = document.createElement("div");
        el.className = "step";
        el.style.left = (x - STEP_W / 2) + "px";
        el.style.top = y + "px";
        world.appendChild(el);
        steps[index] = { index: index, x: x, y: y, type: type, el: el };
      }

      function appendNextStep(index) {
        var prev = steps[index - 1];
        var dir = Math.random() > 0.5 ? 1 : -1;
        var nextX = prev.x + dir * STEP_GAP_X;
        if (nextX < 70 || nextX > wrapW() - 70) nextX = prev.x - dir * STEP_GAP_X;
        makeStep(index, clampX(nextX), prev.y - STEP_GAP_Y, "normal");
      }

      function generateMap() {
        var i;
        var x = wrapW() / 2;
        var y = Math.floor(wrapH() * PLAYER_BASE_RATIO);
        clearWorld();
        makeStep(0, x, y, "normal");
        // 모바일 렉 방지: 처음부터 수백 개를 만들지 않고, 앞쪽 계단만 준비한 뒤 진행 중 추가합니다.
        for (i = 1; i < 120; i++) appendNextStep(i);
      }

      function ensureMoreSteps() {
        var i;
        var start;
        var end;
        if (currentIndex <= steps.length - 45) return;
        start = steps.length;
        end = start + 70;
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
      function renderWorld() { world.style.transform = "translateY(" + cameraY + "px)"; }
      function renderPlayer(extraScale, tilt) {
        if (typeof extraScale !== "number") extraScale = 1;
        if (typeof tilt !== "number") tilt = 0;
        player.style.transform = "translate3d(" + playerPos.x + "px, " + (playerPos.y + cameraY) + "px, 0) translate(-50%, -100%) scale(" + extraScale + ") rotate(" + tilt + "deg)";
      }
      function snapToCurrentStep() {
        var s = currentStep();
        if (!s) return;
        cameraY = wrapH() * PLAYER_BASE_RATIO - s.y;
        targetCameraY = cameraY;
        playerPos.x = s.x;
        playerPos.y = s.y;
        renderWorld();
        renderPlayer(1, 0);
        markCurrent();
      }
      function getStepTimeLimit() {
        var limit = BASE_STEP_TIME - Math.min(1300, score * 7);
        if (booster === "slow") limit += 1100;
        return Math.max(1600, limit);
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

      async function submitScoreRecord(e) {
        if (e && e.stopPropagation) e.stopPropagation();
        var nickname = nicknameInput.value.trim().slice(0, 8);
        var employeeId = employeeInput.value.trim().slice(0, 12);
        var finalScore = Math.floor(score);
        var publicResult = { ok: true, skipped: true };
        var sheetResult = { ok: true, skipped: true };

        if (scoreUploadInProgress) { showToast("이미 기록 중이에요!", 1200); return; }
        if (currentRecordSaved) { showToast("이미 업로드된 기록이에요!", 1300); return; }
        if (!nickname) { showToast("닉네임을 입력해줘!", 1200); return; }
        if (!employeeId) { showToast("사번을 입력해줘!", 1200); return; }

        scoreUploadInProgress = true;
        saveScoreBtn.disabled = true;
        saveScoreBtn.textContent = "기록 중...";
        if (!currentPublicRankingSaved) {
          publicResult = await savePublicRanking(nickname, finalScore);
          currentPublicRankingSaved = publicResult.ok || publicResult.skipped;
        }
        if (!currentAdminSheetSaved) {
          sheetResult = await saveAdminSheet(nickname, employeeId, finalScore, seconds, currentRecordCreatedAt);
          currentAdminSheetSaved = sheetResult.ok || sheetResult.skipped;
        }

        if ((!publicResult.ok && !publicResult.skipped) || (!sheetResult.ok && !sheetResult.skipped)) {
          showToast("저장 실패!", 1400);
          scoreUploadInProgress = false;
          saveScoreBtn.disabled = false;
          saveScoreBtn.textContent = "기록하기";
          return;
        }
        if (publicResult.skipped && sheetResult.skipped) {
          showToast("저장 설정 필요!", 1400);
          scoreUploadInProgress = false;
          saveScoreBtn.disabled = false;
          saveScoreBtn.textContent = "기록하기";
          return;
        }
        currentRecordSaved = true;
        scoreUploadInProgress = false;
        saveScoreBtn.textContent = "기록 완료";
        showToast("기록 완료!", 1300);
        await loadRanking();
      }

      function resetGame() {
        if (animationId !== null) cancelAnimationFrame(animationId);
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
        cameraY = 0;
        targetCameraY = 0;
        currentStage = "ground";
        lastLayoutWidth = wrapW();
        lastLayoutHeight = wrapH();
        pauseOverlay.classList.add("hidden");
        setGameWrapStageClass("ground");
        setStageBackground("ground", true);
        renderDecor("ground");
        player.classList.remove("invincible");
        timerBar.style.transform = "scaleX(1)";
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
        try {
          startOverlay.classList.add("hidden");
          closeMenuPages();
          gameOverOverlay.classList.add("hidden");
          quizOverlay.classList.add("hidden");
          pauseOverlay.classList.add("hidden");
          resetGame();
          playBgm();
          animationId = requestAnimationFrame(loop);
        } catch (err) {
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
          showToast("정답! 실수방어 5초");
        } else if (booster === "slow") {
          playSfx(quizSound);
          showToast("정답! 시간 여유 5초");
        } else {
          playSfx(quizSound);
          showToast("정답! 점수 2배 5초");
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
        var q = quizzes[Math.floor(Math.random() * quizzes.length)];
        paused = true;
        quizPausedAt = performance.now();
        updatePauseButtonVisibility();
        quizMode = mode;
        quizOverlay.classList.remove("hidden");
        choices.innerHTML = "";
        quizTitle.textContent = mode === "revive" ? "부활 폭염퀴즈" : "보너스 폭염퀴즈";
        quizQuestion.textContent = q.question;
        q.choices.forEach(function (choice, index) {
          var btn = document.createElement("button");
          btn.type = "button";
          btn.className = "choiceBtn";
          btn.textContent = String(index + 1) + ". " + choice;
          btn.addEventListener("click", function (event) {
            event.stopPropagation();
            answerQuiz(index === q.answer);
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
          } else {
            endGame();
          }
        }
      }
      function gameOver(reason) {
        if (!running || paused) return;
        if (!revived) {
          showToast(reason || "실패!", 900);
          openQuiz("revive");
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
        finalText.innerHTML = '<span class="resultLabel">최종 점수</span><strong class="resultScore">' + Math.floor(score) + '점</strong><span class="resultTime">생존 시간 ' + seconds + '초</span>';
        nicknameInput.value = "";
        employeeInput.value = "";
        saveScoreBtn.disabled = false;
        saveScoreBtn.textContent = "기록하기";
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
        ensureMoreSteps();
      }
      function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
      function updateMovement(now) {
        if (!moving) return;
        var t = Math.min(1, (now - moveStartTime) / moveDuration);
        var e = easeOutCubic(t);
        var arc = Math.sin(e * Math.PI) * 18;
        var dir = playerTarget.x < playerStart.x ? -1 : 1;
        playerPos.x = playerStart.x + (playerTarget.x - playerStart.x) * e;
        playerPos.y = playerStart.y + (playerTarget.y - playerStart.y) * e - arc;
        cameraY = cameraY + (targetCameraY - cameraY) * 0.32;
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
        timerBar.style.transform = "scaleX(" + Math.max(0, Math.min(1, ratio)) + ")";
        if (remain <= 0 && !moving) gameOver("시간 초과!");
      }
      function loop(now) {
        if (!running) return;
        animationId = requestAnimationFrame(loop);
        if (paused) return;
        seconds = Math.floor((now - gameStartTime) / 1000);
        if (handleTimedQuiz()) return;
        updateBooster(now);
        updateMovement(now);
        updateTimer(now);
        updateHud();
        updatePauseButtonVisibility();
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
        var rect;
        var x;
        if (!running || paused || isAnyOverlayOpen()) return;
        rect = gameWrap.getBoundingClientRect();
        x = e.clientX - rect.left;
        beginMoveToNext(x < rect.width / 2 ? "left" : "right");
      });
      window.addEventListener("keydown", function (e) {
        if (!running || paused || isAnyOverlayOpen()) return;
        if (e.key === "ArrowLeft") beginMoveToNext("left");
        if (e.key === "ArrowRight") beginMoveToNext("right");
      });
      window.addEventListener("resize", function () {
        var width = wrapW();
        var height = wrapH();
        if (!running) return;
        // 모바일 브라우저 주소창이 접히고 펴질 때 resize가 자주 발생합니다.
        // 아주 작은 높이 변화마다 맵 전체를 다시 만들면 플레이 중 끊김이 생겨서 의미 있는 변화만 처리합니다.
        if (Math.abs(width - lastLayoutWidth) < 24 && Math.abs(height - lastLayoutHeight) < 120) return;
        lastLayoutWidth = width;
        lastLayoutHeight = height;
        var savedIndex = currentIndex;
        generateMap();
        // generateMap이 steps[]를 0~119로 초기화하므로, savedIndex가 범위를 벗어나면 추가 생성합니다.
        while (steps.length <= savedIndex + 45) {
          appendNextStep(steps.length);
        }
        currentIndex = savedIndex;
        snapToCurrentStep();
      });

      startOverlay.addEventListener("pointerdown", stopOverlayTouch);
      tutorialOverlay.addEventListener("pointerdown", stopOverlayTouch);
      guideOverlay.addEventListener("pointerdown", stopOverlayTouch);
      rankingOverlay.addEventListener("pointerdown", stopOverlayTouch);
      quizOverlay.addEventListener("pointerdown", stopOverlayTouch);
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

      function initGame() {
        try {
          updateSoundButtons();
          initSupabase();
          preloadStageBackgrounds();
          setGameWrapStageClass("ground");
          setStageBackground("ground", true);
          renderDecor("ground");
          lastLayoutWidth = wrapW();
          lastLayoutHeight = wrapH();
          updatePauseButtonVisibility();
        } catch (err) {
          console.error("초기화 오류:", err);
          gameWrap.classList.add("mainReady");
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
