const board = document.querySelector(".board");
const clone = document.querySelector(".clone");
const overlay = document.querySelector(".overlay");
const reset = document.querySelector(".reset");
const tileOptions = ["erupt", "ptero", "tri", "ahahah", "egg", "dino"];

const state = {
  selections: [],
  boardLocked: false,
  matches: 0,
};

reset.addEventListener("click", () => {
  if (state.boardLocked) return;
  resetGame();
});

function resetGame() {
  state.boardLocked = true;
  state.selections = [];
  state.matches = 0;

  document.querySelectorAll(".cube").forEach((tile) => {
    tile.removeEventListener("click", () => selectTile(tile));
    tile.remove();
  });

  overlay.classList.add("hidden");
  createBoard();
}

function createBoard() {
  const tiles = shuffleArray([...tileOptions, ...tileOptions]);
  const length = tiles.length;

  for (let i = 0; i < length; i++) {
    window.setTimeout(() => {
      board.appendChild(buildTile(tiles.pop(), i));
    }, i * 100);
  }

  window.setTimeout(() => {
    document.querySelectorAll(".cube").forEach((tile) => {
      tile.addEventListener("click", () => selectTile(tile));
    });

    state.boardLocked = false;
  }, tiles.length * 100);
}

function buildTile(option, id) {
  const tile = clone.cloneNode(true);
  tile.classList.remove("clone");
  tile.classList.add("cube");
  tile.setAttribute("data-tile", option);
  tile.setAttribute("data-id", id);
  return tile;
}

function selectTile(selectedTile) {
  if (state.boardLocked || selectedTile.classList.contains("flipped")) return;

  state.boardLocked = true;

  if (state.selections.length <= 1) {
    selectedTile.classList.add("flipped");
    state.selections.push({
      id: selectedTile.dataset.id,
      tile: selectedTile.dataset.tile,
      el: selectedTile,
    });
  }

  /* =================================*
   *      Welcome to Timeout City     *
   *  Time since last incident: 300ms *
   * =================================*/
  if (state.selections.length === 2) {
    if (state.selections[0].tile === state.selections[1].tile) {
      window.setTimeout(() => {
        state.selections[0].el.classList.add("matched");
        state.selections[1].el.classList.add("matched");

        state.boardLocked = false;
        state.matches = state.matches + 1;

        if (state.matches === tileOptions.length) {
          showWinAlert();
        }
        state.selections = [];
        document.querySelector(`.audio-${selectedTile.dataset.tile}`).play();
      }, 600);
    } else {
      setTimeout(() => {
        document.querySelectorAll(".cube").forEach((tile) => {
          tile.classList.remove("flipped");
        });
        state.boardLocked = false;
      }, 800);
      state.selections = [];
    }
  } else {
    state.boardLocked = false;
  }
}

function showWinAlert() {
  // Display an alert indicating the user has won
  alert(
    "Congratulations! You won the game. Please click next to play other game."
  );
  stopTimerFunction();
  // Show the "Next" button after the alert is closed
  showNextButton();
}
function showNextButton() {
  const nextButton = document.getElementById("nextButton");
  if (nextButton) {
    nextButton.style.display = "block";
  }
}

// 🍝 Copy-Pasta - "ain't nobody got time for that"
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

createBoard();

document.getElementById("controls").addEventListener("click", function (e) {
  var t = e.target;

  if (t.nodeName.toLowerCase() === "button") {
    game[t.dataset.action]();
  }
});

function goHome() {
  window.location.href = "home.html";
}

function goNext() {
  const timeTaken = document.getElementById("timer").innerText;
  fetch("/insert-creative-time", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ timeTaken }),
  })
    .then((response) => {
      // Handle response
      console.log("Time taken sent to server");
      window.location.href = "logic.html?start=0"; // Redirect user
    })
    .catch((error) => {
      console.error("Error sending time taken to server:", error);
    });
}

// Function to start the timer
// Function to start the timer
function startTimer(startTime) {
  startTime = Date.now();
  const timerInterval = setInterval(updateTimer, 1000);

  function updateTimer() {
    const elapsedTime = Date.now() - startTime;
    const minutes = Math.floor(elapsedTime / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);
    document.getElementById("timer").innerText = `${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  // Function to stop the timer
  function stopTimer() {
    clearInterval(timerInterval);
    updateTimer(); // Update the timer display with the stopped time
  }

  // Store the stopTimer function in the global variable
  stopTimerFunction = stopTimer;

  // Stop the timer when leaving the page
  window.addEventListener("beforeunload", function () {
    stopTimer(); // Call stopTimer when leaving the page
  });

  // Return the stopTimer function so it can be used externally if needed
  return stopTimer;
}

// Function to extract start time from URL parameter
function getStartTimeFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("start");
}

// Start the timer when the document is loaded
document.addEventListener("DOMContentLoaded", function (event) {
  const startTime = getStartTimeFromURL();
  if (startTime) {
    // Start the timer and store the stopTimer function for later use
    const stopTimer = startTimer(parseInt(startTime));
    console.log(parseInt(startTime));

    // Example of how to stop the timer manually if needed
    setTimeout(() => {
      stopTimer();
      console.log("Timer stopped manually after 5 seconds.");
    }, 5000);
  } else {
    console.error("Start time not found in URL parameters.");
  }
});

// Function to extract start time from URL parameter
function getStartTimeFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("start");
}

// Start the timer when the document is loaded
document.addEventListener("DOMContentLoaded", function (event) {
  const startTime = getStartTimeFromURL();
  if (startTime) {
    startTimer(parseInt(startTime));
    console.log(parseInt(startTime));
  } else {
    console.error("Start time not found in URL parameters.");
  }
});
