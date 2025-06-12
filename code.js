var clicks = 0;
var pointsPerClick = 1;
var powerUpMessage = "";
var messageTimer = 0;
var lastClickTime = 0;
var clickHistory = [];
var regularCPS = 0;
var powerUpCPS = 0;
var musicStarted = false;

var shopItems = {
  doubleClick: { cost: 100, active: false },
  autoClicker: { cost: 200, active: false },
  clickMultiplier: { cost: 500, active: false, multiplier: 2 }
}
var shopMessage = "";
var isShopOpen = false;

var lastCPSCalculationTime = 0;

// NEW: Particle System
var particles = [];

// NEW: Achievements
var achievements = [];

// NEW: Background Stars
var stars = [];
for (var i = 0; i < 100; i++) {
  stars.push({ x: randomNumber(0, 400), y: randomNumber(0, 400), size: randomNumber(1, 3) });
}

// Preload sounds (must be uploaded in assets)
var clickSound = "sound://category_pop/click_1.mp3";
var powerUpSound = "sound://category_achievements/power_up.mp3";
var criticalSound = "sound://category_explosion/explosion_2.mp3";

function draw() {
  drawBackgroundStars();

  if (!musicStarted) {
    playSound("Undertale-OST---031-Waterfall.mp3", true); // loop the music, no .mp3 extension
    musicStarted = true;
  }

  checkPowerUps();
  displayScoreBox();
  displayTitle();
  displayPowerUpMessage();
  calculateCPS();
  displayCPS(regularCPS, powerUpCPS);
  displayShopButton();
  if (isShopOpen) displayShop();

  if (keyWentDown("space")) {
    var critical = randomNumber(1, 100) <= 10; // 10% critical chance
    var pointsEarned = pointsPerClick;
    if (critical) {
      pointsEarned *= 3;
      playSound("sound://category_collect/retro_game_coin_pickup_12.mp3");
    } else {
      playSound("sound://category_tap/puzzle_game_organic_wood_block_tone_tap_4_app_click.mp3");
    }

    clicks += pointsEarned;
    clickHistory.push(frameCount);
    lastClickTime = millis();

    spawnParticles(pointsEarned, critical);
    checkAchievements();
  }

  if (shopItems.autoClicker.active) {
    autoClick();
  }

  updateAndDrawParticles();
  drawSprites();
}

// ===== VISUALS =====

function drawBackgroundStars() {
  background(20, 29, 48);
  fill("white");
  for (var i = 0; i < stars.length; i++) {
    ellipse(stars[i].x, stars[i].y, stars[i].size, stars[i].size);
    stars[i].y += stars[i].size * 0.1;
    if (stars[i].y > 400) {
      stars[i].y = 0;
      stars[i].x = randomNumber(0, 400);
    }
  }
}

function spawnParticles(amount, critical) {
  for (var i = 0; i < amount; i++) {
    particles.push({
      x: 200,
      y: 200,
      dx: randomNumber(-2, 2),
      dy: randomNumber(-4, -1),
      life: 50,
      color: critical ? "gold" : "white"
    });
  }
}

function updateAndDrawParticles() {
  for (var i = particles.length - 1; i >= 0; i--) {
    var p = particles[i];
    fill(p.color);
    ellipse(p.x, p.y, 4, 4);
    p.x += p.dx;
    p.y += p.dy;
    p.dy += 0.1; // gravity
    p.life--;
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
}

// ===== UI & GAMEPLAY =====

function displayScoreBox() {
  fill(255, 255, 255, 40);
  noStroke();
  rect(10, 10, 140, 40, 10);

  fill("white");
  textSize(16);
  textFont("Courier New");
  textAlign(LEFT, TOP);
  text("Score:", 20, 18);
  textSize(20);
  text(clicks, 95, 16);
}

function displayTitle() {
  textAlign(CENTER);
  textSize(24);
  fill(255);
  text("Spacebar Clicker", 200, 60);
}

function displayPowerUpMessage() {
  if (messageTimer > 0) {
    textSize(18);
    fill("yellow");
    text(powerUpMessage, 200, 100);
    messageTimer--;
  }
}

function calculateCPS() {
  if (millis() - lastCPSCalculationTime >= 1000) {
    regularCPS = clickHistory.length;
    clickHistory = [];
    lastCPSCalculationTime = millis();
  }
  powerUpCPS = regularCPS * pointsPerClick;
}

function displayCPS(regular, powerUp) {
  fill("white");
  textSize(16);
  textAlign(LEFT, TOP);
  text("CPS (Regular): " + regular, 10, 140);
  text("CPS (Power-up): " + powerUp, 10, 160);
}

function checkPowerUps() {
  // Removed milestone-based power-ups to keep upgrades only through shop
  if (clicks === 200) showMessage("Auto Clicker Available!");
  if (clicks === 250) showMessage("Click Multiplier Available!");
}

function powerUp(message, newPoints) {
  powerUpMessage = "Power-Up: " + message;
  pointsPerClick = newPoints;
  messageTimer = 100;
  playSound("sound://category_pop/deep_bubble_notification.mp3");
}

function showMessage(message) {
  powerUpMessage = message;
  messageTimer = 100;
  playSound(powerUpSound);
}

function displayShopButton() {
  fill(255, 255, 255, 80);
  noStroke();
  rect(10, 200, 100, 40, 5);
  fill("white");
  textSize(18);
  textAlign(CENTER, CENTER);
  text("Shop", 60, 220);

  if (mouseIsPressed && mouseX > 10 && mouseX < 110 && mouseY > 200 && mouseY < 240) {
    isShopOpen = !isShopOpen;
  }
}

function displayShop() {
  fill(255, 255, 255, 100);
  noStroke();
  rect(10, 240, 380, 150, 10);

  textSize(18);
  textAlign(CENTER, TOP);
  fill("white");
  text("Shop Items", 200, 250);

  displayShopItem("2x Click", 100, 270, shopItems.doubleClick);
  displayShopItem("AutoClick", 200, 270, shopItems.autoClicker);
  displayShopItem("Multiplier", 300, 270, shopItems.clickMultiplier);

  fill("yellow");
  text(shopMessage, 200, 380);
}

function displayShopItem(name, x, y, item) {
  fill("white");
  textSize(6);
  textAlign(CENTER, CENTER);
  text(name + " - " + item.cost + " points", x, y);
  rect(x - 50, y + 20, 100, 30, 5);

  if (mouseIsPressed && mouseX > x - 50 && mouseX < x + 50 && mouseY > y + 20 && mouseY < y + 50) {
    if (clicks >= item.cost && !item.active) {
      purchaseItem(item);
    } else if (item.active) {
      shopMessage = name + " already purchased!";
    } else {
      shopMessage = "Not enough points!";
    }
  }
}

function purchaseItem(item) {
  clicks -= item.cost;
  item.active = true;
  shopMessage = "You bought " + (item.multiplier ? item.multiplier + "x Multiplier!" : "a power-up!");

  if (item === shopItems.doubleClick) {
    pointsPerClick *= 2;
  } else if (item === shopItems.autoClicker) {
    shopItems.autoClicker.active = true;
  } else if (item === shopItems.clickMultiplier) {
    pointsPerClick *= item.multiplier;
  }

  playSound(powerUpSound);
}

function autoClick() {
  if (frameCount % 60 === 0) {
    clicks += pointsPerClick;
    playSound(clickSound);
  }
}

// ===== ACHIEVEMENTS =====

function checkAchievements() {
  if (!Array.isArray(achievements)) {
    achievements = [];
  }

  if (clicks >= 50 && achievements.indexOf("Starter") === -1) {
    achievements.push("Starter");
    showMessage("Achievement: Starter!");
  }

  if (clicks >= 100 && achievements.indexOf("Rising Star") === -1) {
    achievements.push("Rising Star");
    showMessage("Achievement: Rising Star!");
  }

  if (clicks >= 500 && achievements.indexOf("Click Master") === -1) {
    achievements.push("Click Master");
    showMessage("Achievement: Click Master!");
  }

  if (clicks >= 1000 && achievements.indexOf("Legendary Clicker") === -1) {
    achievements.push("Legendary Clicker");
    showMessage("Achievement: Legendary Clicker!");
  }
}
