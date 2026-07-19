// generate the lights
const lightsBox = document.getElementById("lights");
const COUNT = 28;

for (let i = 0; i < COUNT; i++) {
  const l = document.createElement("span");
  l.className = "light";

  l.style.left = 34 + Math.random() * 42 + "%";
  l.style.top = 2 + Math.random() * 17 + "%";

  const s = 0.9 + Math.random() * 1.1;
  l.style.width = l.style.height = 0.9 * s + "dvh";

  l.style.animationDelay =
    Math.random() * 1.5 + "s, " + Math.random() * 2.5 + "s";

  lightsBox.appendChild(l);
}

// elements
const overlay = document.getElementById("startOverlay");
const music = document.getElementById("bgMusic");

const envelope = document.getElementById("envelope");
const envelopeWrapper = document.getElementById("envelopeWrapper");
const card = document.getElementById("inviteCard");
const dark = document.getElementById("photoDark");
const glow = document.getElementById("envelopeGlow");

// click → play music + start animation
overlay.addEventListener("click", () => {
  overlay.style.opacity = "0";

  setTimeout(() => {
    overlay.style.display = "none";
  }, 800);

  // Music
  music.volume = 0;
  music.play().catch((e) => console.log(e));

  let v = 0;

  const fade = setInterval(() => {
    v += 0.05;

    if (v >= 1) {
      v = 1;
      clearInterval(fade);
    }

    music.volume = v;
  }, 100);

  // Lights ON
  document.querySelectorAll(".light").forEach((light) => {
    light.style.animationPlayState = "running, running";
  });

  // Brighten image
  setTimeout(() => {
    dark.style.opacity = "0";
  }, 3600);

  // Open envelope
  setTimeout(() => {
    envelope.classList.add("open");

    setTimeout(() => {
      document.querySelectorAll(".balloon").forEach((balloon) => {
        balloon.style.animationPlayState = "running, running";
      });
    }, 500);

    createSparkles();
    glow.style.opacity = "1";
  }, 600);

  // Pull invitation out
  setTimeout(() => {
    card.classList.add("show");
  }, 1500);

  // Hide envelope afterwards
  setTimeout(() => {
    envelopeWrapper.classList.add("hide");
    glow.style.opacity = "0";
  }, 2500);
});

function createSparkles() {
  for (let i = 0; i < 35; i++) {
    const s = document.createElement("span");

    s.className = "sparkle";

    s.style.left = "50%";
    s.style.top = "50%";

    s.style.setProperty("--x", Math.random() * 80 - 40 + "dvh");
    s.style.setProperty("--y", -Math.random() * 35 + "dvh");

    document.querySelector(".invite").appendChild(s);

    setTimeout(() => s.remove(), 1800);
  }
}

// add balloon strings
document.querySelectorAll(".balloon").forEach((balloon) => {
  const string = document.createElement("span");
  balloon.appendChild(string);
});

const confettiColors = ["#f5e6c8", "#800020", "#ffffff", "#d4af37", "#e8b4b8"];

function spawnConfetti(cx, cy) {
  for (let i = 0; i < 60; i++) {
    const piece = document.createElement("div");

    piece.className = "confetti";
    piece.style.left = cx + "px";
    piece.style.top = cy + "px";

    piece.style.background =
      confettiColors[Math.floor(Math.random() * confettiColors.length)];

    const dx = (Math.random() - 0.5) * window.innerWidth * 1.6;
    const dy = Math.random() * window.innerHeight * 1.1;

    piece.style.setProperty("--dx", dx + "px");
    piece.style.setProperty("--dy", dy + "px");

    piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "0";
    piece.style.animationDuration = 1.5 + Math.random() * 1.5 + "s";

    document.body.appendChild(piece);

    piece.addEventListener("animationend", () => piece.remove(), {
      once: true,
    });
  }
}

function popBalloon(balloon) {
  if (balloon.dataset.popped === "true") return;
  balloon.dataset.popped = "true";

  const rect = balloon.getBoundingClientRect();

  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  // Freeze balloon exactly where it is
  balloon.style.position = "fixed";
  balloon.style.left = rect.left + "px";
  balloon.style.top = rect.top + "px";
  balloon.style.width = rect.width + "px";
  balloon.style.height = rect.height + "px";
  balloon.style.marginLeft = "0";
  balloon.style.transform = "none";
  balloon.style.zIndex = "9999";

  // Stop rise/float animation
  balloon.style.animation = "none";

  spawnConfetti(cx, cy);

  // force browser to apply animation reset
  void balloon.offsetWidth;

  // Play pop animation directly with inline style
  balloon.classList.add("popped");
  balloon.style.animation = "balloonPop 0.45s ease-out forwards";

  balloon.addEventListener(
    "animationend",
    (e) => {
      if (e.animationName === "balloonPop") {
        balloon.remove();
      }
    },
    { once: true }
  );
}

// pop all balloons once the first one finishes rising
let firstBalloonFinished = false;

document.querySelectorAll(".balloon").forEach((balloon) => {
  balloon.addEventListener("animationend", (e) => {
    if (e.animationName === "balloonRise" && !firstBalloonFinished) {
      firstBalloonFinished = true;

      setTimeout(() => {
        document.querySelectorAll(".balloon").forEach(popBalloon);
      }, 300);
    }
  });
});
