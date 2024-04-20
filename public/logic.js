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
function goResult() {
  const timeTaken = document.getElementById("timer").innerText;
  fetch("/insert-logical-time", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ timeTaken }),
  })
    .then((response) => {
      // Handle response
      console.log("Time taken sent to server");
      window.location.href = "result.html"; // Redirect user
    })
    .catch((error) => {
      console.error("Error sending time taken to server:", error);
    });
}
