import "./menger/index.js";

// Get canvas element
const canvas = document.getElementById('glCanvas');

// Set initial size
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Initial setup
resizeCanvas();

// Update on window resize
window.addEventListener('resize', resizeCanvas);