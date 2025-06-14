const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const lanes = { "D": 150, "F": 300, "J": 500, "K": 650 };
const notes = [];
let score = 0, combo = 0, speed = 4;

// Create a falling note
function spawnNote() {
    const laneKeys = Object.keys(lanes);
    const noteLane = laneKeys[Math.floor(Math.random() * laneKeys.length)];
    notes.push({ x: lanes[noteLane], y: -40, key: noteLane });
}

// Game loop
function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw lanes
    ctx.fillStyle = "#333";
    for (const lane in lanes) ctx.fillRect(lanes[lane] - 30, 520, 60, 20);

    // Draw notes
    notes.forEach(note => {
        ctx.fillStyle = "#0a5";
        ctx.fillRect(note.x - 30, note.y, 60, 20);
        note.y += speed;
    });

    // Remove missed notes
    notes.forEach((note, i) => { if (note.y > 560) notes.splice(i, 1); });

    // Draw score & combo
    ctx.fillStyle = "white";
    ctx.fillText("Score: " + score, 20, 30);
    ctx.fillText("Combo: " + combo, 20, 60);

    requestAnimationFrame(updateGame);
}

// Key press detection
document.addEventListener("keydown", (event) => {
    if (lanes[event.key]) {
        for (let i = 0; i < notes.length; i++) {
            if (notes[i].key === event.key && Math.abs(notes[i].y - 520) < 20) {
                score += 10 + (combo * 2);
                combo++;
                notes.splice(i, 1);
                return;
            }
        }
        combo = 0;
    }
});

// Start game
setInterval(spawnNote, 800);
updateGame();
