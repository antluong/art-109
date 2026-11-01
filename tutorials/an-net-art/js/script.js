
const scene = document.getElementById("p1");
const enterButton = document.getElementById("enterButton");
const music = document.getElementById("backgroundMusic");
const rotatingText = document.getElementById("rotatingText");

// Background music
music.volume = 0.25;

// Try autoplay
music.play().catch(() => {
  console.log("Autoplay blocked.");
});

// Play after first interaction if autoplay is blocked
document.addEventListener("pointerdown", () => {
  if (music.paused) {
    music.play().catch(console.error);
  }
}, { once: true });

// Three rotating questions
const messages = [
  "What will last forever...?",
  "What are you afraid to lose?",
  "What do you wish to hold on to forever?"
];

let currentIndex = 0;
let changeTimeout;

// Change question every 2 seconds
const textInterval = setInterval(() => {

  // Fade out current sentence
  rotatingText.style.opacity = 0;

  changeTimeout = setTimeout(() => {

    // Change to next sentence
    currentIndex = (currentIndex + 1) % messages.length;

    rotatingText.textContent = messages[currentIndex];

    // Fade in new sentence
    rotatingText.style.opacity = 1;

  }, 500);

}, 2000);

// Click to enter the tunnel
enterButton.addEventListener("click", () => {
  if (scene.classList.contains("walking")) {
    return;
  }

  // Stop changing questions
  clearInterval(textInterval);
  clearTimeout(changeTimeout);

  // Play music if needed
  if (music.paused) {
    music.play().catch(console.error);
  }

  scene.classList.add("walking");
  enterButton.disabled = true;

  // Go to Page 2
  setTimeout(() => {
    window.location.href = "page2.html";
  }, 2500);
});
