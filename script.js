let startTime;
let stopTime;
let running = 0;
let timer;
let exerciseData;

//Loads API into local storage upon page load
//document.addEventListener('DOMContentLoaded', function() {
  let exerciseDB_URL = 'https://exercisedb.p.rapidapi.com/exercises/equipment/body%20weight?limit=400';
  const options = {
      method: 'GET',
      headers: {
          'X-RapidAPI-Key': '1601d766cemsh1f6957320685070p190535jsn3157a3f24228',
          'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
      }
  }; 
  
  //first checks if 'exerciseData' is already stored in localStorage, then parses it
  if (localStorage.getItem('exerciseData')) {
    exerciseData = JSON.parse(localStorage.getItem('exerciseData'));
    console.log(exerciseData);
  } else {
    //if it's not, we make an API call to fetch the necessary data and intialize exerciseData to it
      try {
        fetch(exerciseDB_URL, options)
              .then(response => response.json())
              .then(response => {
                  exerciseData = response;
                  localStorage.setItem('exerciseData', JSON.stringify(exerciseData));
                  console.log(exerciseData);
              })
      } catch (error) {
              console.error(error);
      }
  }
//});

function startStopwatch() {
  if (running == 0) {
    startTime = new Date().getTime();
    running = 1;
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
        stopStopwatch();
        audio.currentTime = 0;
        audio.play();
        displayRandomExercise();
        //console.log(exerciseData[5].gifUrl);
        //console.log(exerciseData.length);
      }
    }, 1000);
  }
}

function stopStopwatch() {
  //if (running == 1) { //this if statement likely isn't necessary
    running = 0; //this statement was originally at the end of this codeblock
    let audio = document.getElementById("beep");
    clearInterval(timer);
    audio.pause()
    audio.currentTime = 0;
    stopTime = new Date().getTime();
    
  //}
}

function resetStopwatch() {
    let audio = document.getElementById("beep");
    clearInterval(timer);
    audio.pause()
    audio.currentTime = 0;
    startTime = null;
    stopTime = null;
    running = 0;
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

