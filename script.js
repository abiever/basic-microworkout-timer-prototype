//Utilizes ExerciseDB API from here:
//https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb

//declare all globally used variables here
let startTime;
let stopTime;
let running = false;
let timer;
let exerciseData;
let lastUpdateTime;

let startStopbutton;
let resetButton;

//Loads API into local storage upon page load
document.addEventListener('DOMContentLoaded', function() {
  //Having the buttons' HTML id gets here ensures they are initialized prior to Javascript functions using them
  startStopbutton = document.getElementById("button-start");
  resetButton = document.getElementById("button-reset");

  //Prepares the API call
  let exerciseDB_URL = 'https://exercisedb.p.rapidapi.com/exercises/equipment/body%20weight?limit=330';
  const options = {
      method: 'GET',
      headers: {
          'X-RapidAPI-Key': '1601d766cemsh1f6957320685070p190535jsn3157a3f24228',
          'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
      }
  }; 
  
  if (localStorage.getItem('exerciseData')) {
    exerciseData = JSON.parse(localStorage.getItem('exerciseData'));
    lastUpdateTime = new Date(localStorage.getItem('lastUpdateTime'));
    console.log(exerciseData);
    console.log(lastUpdateTime);

    // Check if data needs refresh and trigger the refresh
    if (shouldRefreshGIFs(lastUpdateTime)) {
      try {
        fetch(exerciseDB_URL, options)
          .then(response => response.json())
          .then(response => {
            exerciseData = response;
            lastUpdateTime = new Date().toISOString();
            localStorage.setItem('exerciseData', JSON.stringify(exerciseData));
            localStorage.setItem('lastUpdateTime', lastUpdateTime);
            console.log(exerciseData);
            console.log(lastUpdateTime);
          })
      } catch (error) {
        console.error(error);
      }
    }
  } else {
    try {
      fetch(exerciseDB_URL, options)
            .then(response => response.json())
            .then(response => {
                exerciseData = response;
                lastUpdateTime = new Date().toISOString();
                localStorage.setItem('exerciseData', JSON.stringify(exerciseData));
                localStorage.setItem('lastUpdateTime', lastUpdateTime); // Save the current time as the last update time for daily gifURL refresh
                console.log(exerciseData);
                console.log(lastUpdateTime);
            })
    } catch (error) {
            console.error(error);
    }
  }


/*   //first checks if 'exerciseData' is already stored in localStorage, then parses it and sets update time to what was stored in local storage
  if (localStorage.getItem('exerciseData')) {
    exerciseData = JSON.parse(localStorage.getItem('exerciseData'));
    lastUpdateTime = localStorage.getItem('lastUpdateTime');
    console.log(exerciseData);
    console.log(lastUpdateTime);
  } else if (!localStorage.getItem('exerciseData')) {
    //if it's not, we make an API call to fetch the necessary data and intialize exerciseData to it, and set the time in which this happened
      try {
        fetch(exerciseDB_URL, options)
              .then(response => response.json())
              .then(response => {
                  exerciseData = response;
                  lastUpdateTime = new Date().toISOString();
                  localStorage.setItem('exerciseData', JSON.stringify(exerciseData));
                  localStorage.setItem('lastUpdateTime', lastUpdateTime); // Save the current time as the last update time for daily gifURL refresh
                  console.log(exerciseData);
                  console.log(lastUpdateTime);
              })
      } catch (error) {
              console.error(error);
      }
  //if the API data is already stored, but the GifURLs are expired (12PM Central Time), this checks for expiration then sends another API call to update URLs
  } else if (localStorage.getItem('exerciseData') && shouldRefreshGIFs(lastUpdateTime)) {
      try {
        fetch(exerciseDB_URL, options)
              .then(response => response.json())
              .then(response => {
                  exerciseData = response;
                  lastUpdateTime = new Date().toISOString();
                  localStorage.setItem('exerciseData', JSON.stringify(exerciseData));
                  localStorage.setItem('lastUpdateTime', lastUpdateTime); // Save the current time as the last update time for daily gifURL refresh
                  console.log(exerciseData);
                  console.log(lastUpdateTime);
              })
      } catch (error) {
              console.error(error);
      }
  } */

  ///This way, when the start button is clicked, it checks if running is false or true and then calls the appropriate function accordingly (startStopwatch() or stopStopwatch()). This will dynamically handle the start and stop functionalities based on the current state of running.
  startStopbutton.addEventListener("click", function() {
    if (running === false) {
      startStopwatch();
    } else {
      stopStopwatch();
    }
  });
});


function startStopwatch() {
    if (running === false) {
      startTime = new Date().getTime();
      running = true;
      startStopbutton.innerHTML = "Stop";
      startStopbutton.classList.remove("btn-success");
      startStopbutton.classList.add("btn-danger");
      

      //Creates timer/stopwatch interface 
      timer = setInterval(function() {
        let elapsedTime = new Date().getTime() - startTime;
        let hours = Math.floor((elapsedTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
        let timeLimit = document.getElementById("timeLimit").value;
        let audio = document.getElementById("beep");
  
        if (hours < 10) {
          hours = "0" + hours;
        }
        if (minutes < 10) {
          minutes = "0" + minutes;
        }
        if (seconds < 10) {
          seconds = "0" + seconds;
        }
  
        document.getElementById("stopwatch").innerHTML = hours + ":" + minutes + ":" + seconds;
  
        if (elapsedTime >= timeLimit * 60 * 1000) {
          displayRandomExercise();
          stopStopwatch();
          audio.currentTime = 0;
          audio.play();
          document.getElementById("stopwatch").innerHTML = "00:00:00";
        }
      }, 1000);
    }
  };

//TODO: edit this so that it RESUMES the time, and doesn't JUST reset/restart at 00:00:00
function stopStopwatch() {
  if (running === true) { 
    running = false; 
    startStopbutton.innerHTML = "Start";
    startStopbutton.classList.remove("btn-danger");
      startStopbutton.classList.add("btn-primary");
    let audio = document.getElementById("beep");
    clearInterval(timer);
    audio.pause()
    audio.currentTime = 0;
    stopTime = new Date().getTime();
    }
}

function resetStopwatch() {
    let audio = document.getElementById("beep");
    clearInterval(timer);
    audio.pause()
    audio.currentTime = 0;
    startTime = null;
    stopTime = null;
    running = false;
    document.getElementById("stopwatch").innerHTML = "00:00:00";
}

//sets up the click event to display random exercise
function displayRandomExercise() {
      // generate a random number to select a random exercise
      let randomIndex = Math.floor(Math.random() * exerciseData.length);
      let randomExercise = exerciseData[randomIndex];
      document.getElementById('exercise-name').innerHTML = randomExercise.name;
      document.getElementById('exercise-gif').src = randomExercise.gifUrl;
      //console.log(exerciseData.length);
}

// Function to check if it's time to refresh the GIF URLs
function shouldRefreshGIFs(time) {
  const now = new Date();
  const lastUpdateDate = new Date(time);

  // Check if it's past 12:00 pm (noon) Central US time
  return (
    now.getUTCHours() >= 17 && // Adjust UTC hours to correspond to Central US time (12 pm Central time is 17:00 UTC)
    now.getDate() > lastUpdateDate.getDate() // Check if it's a new day since the last update
  );
}