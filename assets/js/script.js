// generate the lights (only in the empty upper-left background)
const lightsBox = document.getElementById("lights");
const COUNT = 28;

for (let i = 0; i < COUNT; i++) {
  const l = document.createElement("span");
  l.className = "light";

  // Keep the extra lights in the open sky between the built-in
  // balloon cluster and the invitation card.
  l.style.left = 34 + Math.random() * 42 + "%"; // 34% → 76%
  l.style.top = 2 + Math.random() * 17 + "%"; // 2% → 19%
  const s = 0.9 + Math.random() * 1.1;
  l.style.width = l.style.height = 0.9 * s + "dvh";

  // one delay for lightOn, another for twinkle
  l.style.animationDelay =
    Math.random() * 1.5 + "s, " + Math.random() * 2.5 + "s";

  lightsBox.appendChild(l);
}
// click → play music + turn lights on
const overlay = document.getElementById("startOverlay");
const music = document.getElementById("bgMusic");

const envelope = document.getElementById("envelope");
const envelopeWrapper = document.getElementById("envelopeWrapper");
const card = document.getElementById("inviteCard");
const dark = document.getElementById("photoDark");

overlay.addEventListener("click", () => {
  // Hide start screen
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
    light.style.animationPlayState = "running,running";
  });

  // Brighten image
  // Wait before turning the lights on
  setTimeout(() => {
    dark.style.opacity = "0";
  }, 3600);
  // Wait a little
  setTimeout(() => {
    // Open envelope
    envelope.classList.add("open");
    setTimeout(() => {
      document.querySelectorAll(".balloon").forEach((balloon) => {
        balloon.style.animationPlayState = "running,running";
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
const glow = document.getElementById("envelopeGlow");
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

    // spread across the full viewport width and height
    const dx = (Math.random() - 0.5) * window.innerWidth * 1.6;
    const dy = Math.random() * window.innerHeight * 1.1;
    piece.style.setProperty("--dx", dx + "px");
    piece.style.setProperty("--dy", dy + "px");

    piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "0";
    piece.style.animationDuration = 1.5 + Math.random() * 1.5 + "s";
    document.body.appendChild(piece);
    piece.addEventListener("animationend", () => piece.remove());
  }
}

function popBalloon(balloon) {
  const rect = balloon.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  // Freeze the balloon exactly where it is on screen,
  // so removing the rise/float animations doesn't move it
  balloon.style.animation = "none";
  balloon.style.position = "fixed";
  balloon.style.left = rect.left + "px";
  balloon.style.top = rect.top + "px";
  balloon.style.transform = "none";

  spawnConfetti(cx, cy);

  // force reflow, then apply the pop animation
  void balloon.offsetWidth;
  balloon.classList.add("popped");
  balloon.addEventListener("animationend", () => balloon.remove(), { once: true });
}

// pop each balloon once its rise animation finishes
// pop all balloons once the first one finishes rising
let firstBalloonFinished = false;
document.querySelectorAll(".balloon").forEach((balloon) => {
  balloon.addEventListener("animationend", (e) => {
    if (e.animationName === "balloonRise" && !firstBalloonFinished) {
      firstBalloonFinished = true;
      // pop all of them together
      document.querySelectorAll(".balloon").forEach(popBalloon);
    }
  });
});
