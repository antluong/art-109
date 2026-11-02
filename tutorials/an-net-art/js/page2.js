
const memories = document.querySelectorAll(".memory");
const ending = document.getElementById("ending");
const area = document.querySelector(".words");

const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");

const maxClicks = 3;
const particles = [];

let disappeared = 0;


// AUDIO SETTINGS
const page2Music = document.getElementById("backgroundmusic");
const warningSound = document.getElementById("warningsound");

// Volume: 0 = silent, 1 = maximum
page2Music.volume = 0.25;
warningSound.volume = 0.8;

// Start background music
page2Music.play().catch(() => {
  console.log("Background autoplay blocked.");
});

// If autoplay is blocked, retry on interaction
document.addEventListener("pointerdown", () => {
  if (page2Music.paused) {
    page2Music.play().catch(console.error);
  }
}, { once: true });



// 1. Set up Canvas
function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = Math.round(window.innerWidth * dpr);
  canvas.height = Math.round(window.innerHeight * dpr);

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

resizeCanvas();

// 2. Randomly position words
function placeWords() {
  const placed = [];
  const bounds = area.getBoundingClientRect();

  memories.forEach((word) => {
    const width = word.offsetWidth;
    const height = word.offsetHeight;

    const minX = width / 2 + 15;
    const maxX = Math.max(minX, bounds.width - width / 2 - 15);
    const minY = height / 2 + 15;
    const maxY = Math.max(minY, bounds.height - height / 2 - 15);

    let x, y, overlap;
    let attempts = 0;

    do {
      x = minX + Math.random() * (maxX - minX);
      y = minY + Math.random() * (maxY - minY);

      overlap = placed.some((item) =>
        Math.abs(x - item.x) <
          (width + item.width) / 2 + 20 &&
        Math.abs(y - item.y) <
          (height + item.height) / 2 + 20
      );

      attempts++;
    } while (overlap && attempts < 100);

    word.style.left = `${x}px`;
    word.style.top = `${y}px`;

    placed.push({ x, y, width, height });
  });
}

// 3. Create golden dust
function createDust(word, amount) {
  const rect = word.getBoundingClientRect();

  const offscreen = document.createElement("canvas");
  offscreen.width = Math.ceil(rect.width);
  offscreen.height = Math.ceil(rect.height);

  const offCtx = offscreen.getContext("2d");
  const style = getComputedStyle(word);

  offCtx.font = `${style.fontSize} ${style.fontFamily}`;
  offCtx.textAlign = "center";
  offCtx.textBaseline = "middle";
  offCtx.fillStyle = "white";

  offCtx.fillText(
    word.textContent.trim(),
    offscreen.width / 2,
    offscreen.height / 2
  );

  const data = offCtx.getImageData(
    0, 0, offscreen.width, offscreen.height
  ).data;

  const points = [];

  for (let y = 0; y < offscreen.height; y += 3) {
    for (let x = 0; x < offscreen.width; x += 3) {
      const alpha = data[(y * offscreen.width + x) * 4 + 3];

      if (alpha > 100) {
        points.push({ x, y });
      }
    }
  }

  for (let i = 0; i < amount; i++) {
    if (points.length === 0) break;

    const point = points[
      Math.floor(Math.random() * points.length)
    ];

    particles.push({
      x: rect.left + point.x,
      y: rect.top + point.y,

      vx: (Math.random() - 0.5) * 3,
      vy: (Math.random() - 0.5) * 3 - 1,

      size: Math.random() * 2 + 0.5,
      life: 1,
      decay: Math.random() * 0.015 + 0.008,

      color: Math.random() > 0.5
        ? "255, 190, 70"
        : "255, 225, 150"
    });
  }
}

// 4. Animate golden particles
function animateParticles() {
  ctx.clearRect(
    0, 0,
    window.innerWidth,
    window.innerHeight
  );

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];

    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.01;
    p.life -= p.decay;

    if (p.life <= 0) {
      particles.splice(i, 1);
      continue;
    }

    ctx.beginPath();

    ctx.fillStyle = `rgba(${p.color}, ${p.life})`;
    ctx.shadowBlur = 8;
    ctx.shadowColor = "rgba(255, 180, 70, 0.8)";

    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.shadowBlur = 0;

  requestAnimationFrame(animateParticles);
}


// 5. Automatic fading over 30 seconds

const totalDuration = 30000; // 30 seconds
const startTime = performance.now();

let finished = false;

// Track clicks for each word
const clickCounts = new Map();

memories.forEach((word) => {
  clickCounts.set(word, 0);

  word.addEventListener("click", () => {
    if (finished || word.disabled) return;

    const clicks = Math.min(
      maxClicks,
      clickCounts.get(word) + 1
    );

    clickCounts.set(word, clicks);

    // Create golden dust when clicked
    createDust(word, 35 + clicks * 25);
  });
});

// 6. Automatically fade all words
function autoFade(currentTime) {
  if (finished) return;

  const elapsed = currentTime - startTime;

  // Progress from 0 to 1
  const progress = Math.min(
    elapsed / totalDuration,
    1
  );

  memories.forEach((word) => {
    // Natural fading over time
    const timeBrightness = 1 - progress;

    // Additional fading from clicks
    const clicks = clickCounts.get(word);
    const clickBrightness = 1 - clicks / maxClicks;

    // Use the lower brightness
    const brightness = Math.max(
      0,
      Math.min(timeBrightness, clickBrightness)
    );

    word.style.opacity = brightness;

    // Golden glow becomes weaker
    word.style.textShadow = `
      0 0 ${8 * brightness}px
      rgba(255, 220, 130, ${brightness}),

      0 0 ${20 * brightness}px
      rgba(255, 180, 60, ${brightness}),

      0 0 ${40 * brightness}px
      rgba(255, 140, 20, ${brightness})
    `;

    if (brightness <= 0) {
      word.disabled = true;
      word.style.pointerEvents = "none";
    }
  });

  // Show ending after 30 seconds
  if (progress >= 1) {
    finished = true;

    memories.forEach((word) => {
      word.style.opacity = 0;
      word.disabled = true;
    });

    ending.classList.add("visible");
    return;
  }

  requestAnimationFrame(autoFade);
}

// 7. Start everything
window.addEventListener("load", () => {
  placeWords();
  requestAnimationFrame(autoFade);
});

window.addEventListener("resize", () => {
  resizeCanvas();
  placeWords();
});

animateParticles();


// Warning message every 5 seconds
const warningBox = document.getElementById("warningbox");

const warningMessages = [
  "Time is slipping away...",
  "How much time do you have left?",
  "Can you hold on before it's gone?"
];

let warningIndex = 0;

const warningInterval = setInterval(() => {

  //change warning text 
  warningBox.textContent = warningMessages[warningIndex];

  //show warning box
  warningBox.classList.add("show");

  //play bell sound 
  warningSound.pause();
  warningSound.currentTime = 0;
  warningSound.play().catch(console.error);


  //hide warning after 2.5s
  setTimeout(() => {
    warningBox.classList.remove("show");
  }, 2500);

  warningIndex++;

  if (warningIndex >= warningMessages.length) {
    clearInterval(warningInterval);
  }
}, 5000);



