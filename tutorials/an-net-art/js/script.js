
const scene = document.getElementById("p1");
const enterButton = document.getElementById("enterButton");
const music = document.getElementById("backgroundMusic");

// Set volume to 25%
music.volume = 0.25;

enterButton.addEventListener("click", () => {
  if (scene.classList.contains("walking")) {
    return;
  }

  // Play background music
  music.play().catch((error) => {
    console.log("Music could not play:", error);
  });

  // Start walking animation
  scene.classList.add("walking");
  enterButton.disabled = true;

  // Go to page 2
  setTimeout(() => {
    window.location.href = "page2.html";
  }, 2500);
});
