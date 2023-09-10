// Constants for game configuration
const MAX_SCORE = 5;

// Variables for tracking game state
let score = 0;
let runAgainAt = Date.now() + 100;

// Function to get the next time interval for sad state
function getSadInterval() {
  return Date.now() + 1000;
}

// Function to get the next time interval for gone state
function getGoneInterval() {
  return Date.now() + Math.floor(Math.random() * 18000) + 2000;
}

// Function to get the next time interval for hungry state
function getHungryInterval() {
  return Date.now() + Math.floor(Math.random() * 3000) + 2000;
}

// Function to determine if a mole should be a king mole
function getKingStatus() {
  return Math.random() > 0.9;
}

// Mole objects representing each hole
const moles = Array.from({ length: 10 }, (_, index) => ({
  status: "sad",
  next: getSadInterval(),
  king: false,
  node: document.getElementById(`hole-${index}`),
}));

// Function to handle transitioning to the next mole status
function getNextStatus(mole) {
  switch (mole.status) {
    case "sad":
    case "fed":
      mole.next = getSadInterval();
      mole.status = "leaving";
      mole.node.children[0].src = mole.king
        ? "./assets/king-mole-leaving.png"
        : "./assets/mole-leaving.png";
      break;
    case "leaving":
      mole.next = getGoneInterval();
      mole.status = "gone";
      mole.node.children[0].classList.add("gone");
      break;
    case "gone":
      mole.status = "hungry";
      mole.king = getKingStatus();
      mole.next = getHungryInterval();
      mole.node.children[0].classList.add("hungry");
      mole.node.children[0].classList.remove("gone");
      mole.node.children[0].src = mole.king
        ? "./assets/king-mole-hungry.png"
        : "./assets/mole-hungry.png";
      break;
    case "hungry":
      mole.status = "sad";
      mole.next = getSadInterval();
      mole.node.children[0].classList.remove("hungry");
      mole.node.children[0].src = mole.king
        ? "./assets/king-mole-sad.png"
        : "./assets/mole-sad.png";
      break;
  }
}

// Function to handle feeding a mole
function feed(event) {
  if (!event.target.classList.contains("hungry")) {
    return;
  }

  const moleIndex = parseInt(event.target.dataset.index);
  const mole = moles[moleIndex];

  mole.status = "fed";
  mole.next = getSadInterval();
  if (mole.king) {
    score += 2;
    mole.node.children[0].src = "./assets/king-mole-fed.png";
  } else {
    score++;
    mole.node.children[0].src = "./assets/mole-fed.png";
  }
  mole.node.children[0].classList.remove("hungry");

  if (score >= MAX_SCORE) {
    win();
  }

  document.querySelector(".worm-container").style.width = `${
    (score / MAX_SCORE) * 100
  }%`;
}

// Function to handle the game win condition
function win() {
  document.querySelector(".bg").classList.add("hide");
  document.querySelector(".win").classList.remove("hide");
}

// Function for the game loop
function nextFrame() {
  const now = Date.now();

  if (runAgainAt <= now) {
    for (let i = 0; i < moles.length; i++) {
      if (moles[i].next <= now) {
        getNextStatus(moles[i]);
      }
    }
    runAgainAt = now + 100;
  }
  requestAnimationFrame(nextFrame);
}

// Event listener for clicking on mole holes
document.querySelector(".bg").addEventListener("click", feed);

// Start the game loop
nextFrame();
