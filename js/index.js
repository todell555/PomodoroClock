// parts of this code were modified from this tutorial by Yaphi Berhanu: https://www.sitepoint.com/build-javascript-countdown-timer-no-dependencies/

var counter = 25;
var breakCounter = 5;
var timeInMinutes = 25;
var currentTime = 0;
var deadline = 0;
var running = false;
var doBreak = false;
var timeinterval = 0;
var ss = document.getElementById("sessionSet");
var bs = document.getElementById("breakSet");
var clock = document.getElementById('clockdiv');
var minutesSpan = clock.querySelector('.minutes');
var secondsSpan = clock.querySelector('.seconds');
var soundDing = new Audio("http://bit.ly/2wSuKY0");

var add = (function () {
  return function () {return counter += 1;};
})();

var subtract = (function () {
  return function () {return counter -= 1;};
})();

function addTime(){
  ss.value = add();
  ss.innerHTML = counter;
  if (doBreak != true) {
    running = false;
    clearInterval(timeinterval); 
    minutesSpan.innerHTML = counter;
    secondsSpan.innerHTML = "00";
  }
}

function minusTime(){
  if (doBreak === false) {
    running = false;
    clearInterval(timeinterval); 
  }
  if (counter > 1){
    ss.value = subtract();
    ss.innerHTML = counter;
    if (doBreak === false) {
      minutesSpan.innerHTML = counter;
      secondsSpan.innerHTML = "00";
    }
  }
}

var breakAdd = (function () {
  return function () {return breakCounter += 1;};
})();

var breakSubtract = (function () {
  return function () {return breakCounter -= 1;};
})();

function breakAddTime(){
  if (doBreak === true) {
    running = false;
    clearInterval(timeinterval);
    minutesSpan.innerHTML = breakCounter+1;
    secondsSpan.innerHTML = "00"; 
  }
  bs.value = breakAdd();
  bs.innerHTML = breakCounter;
}

function breakMinusTime(){
  if (doBreak === true) {
    running = false;
    clearInterval(timeinterval);
    if (breakCounter > 1){
      minutesSpan.innerHTML = breakCounter-1;
      secondsSpan.innerHTML = "00"; 
    }
  }
  if (breakCounter > 1){
    bs.value = breakSubtract();
    bs.innerHTML = breakCounter;
  }
}

function getTimeRemaining(endtime){
var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor( (t/1000) % 60 );
  var minutes = Math.floor( (t/1000/60) % 60 );
  return {
    'total': t,
    'minutes': minutes,
    'seconds': seconds
  };
}

function initializeClock(endtime){
  timeInMinutes = counter;
  currentTime = Date.parse(new Date());
  deadline = new Date(currentTime + timeInMinutes*60*1000);
    function updateClock() {
      if (running === true) {   
        document.getElementById('clockdiv').style.color = 'black';
        var t = getTimeRemaining(endtime);
        minutesSpan.innerHTML = t.minutes;
        secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);
        if(t.total<=0){
          soundDing.play();
          running = false;
          clearInterval(timeinterval);
          startBreak ();
        }
      }
    }
  clearInterval(timeinterval);
  updateClock(); // run function once at first to avoid delay
  timeinterval = setInterval(updateClock,1000);
}

function breakClock(endtime){
  timeInMinutes = breakCounter;
  currentTime = Date.parse(new Date());
  deadline = new Date(currentTime + timeInMinutes*60*1000);
    function updateClock() {
      if (running === true) {
        document.getElementById('clockdiv').style.color = 'pink';
        var t = getTimeRemaining(endtime);
        minutesSpan.innerHTML = t.minutes;
        secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);
        if(t.total<=0){
          soundDing.play();
          running = false;
          doBreak = false;
          clearInterval(timeinterval);
          restartTimer();
        }
      }
    }
  clearInterval(timeinterval);
  updateClock(); // run function once at first to avoid delay
  timeinterval = setInterval(updateClock,1000);
}

function startBreak () {
  running = true;
  doBreak = true;
  clearInterval(timeinterval);
  timerinterval = null;
  currentTime = Date.parse(new Date());
  var endtime = new Date(currentTime + bs.innerHTML*60*1000);
  breakClock(endtime);
}

function startTimer() {
  if (running === false) {
    soundDing.load();
    running = true;
    clearInterval(timeinterval);
    timerinterval = null;
    currentTime = Date.parse(new Date());
    var endtime = new Date(currentTime + document.getElementById('minutes').innerHTML*60*1000 + document.getElementById('seconds').innerHTML*1000); //if user presses start again after pause, including seconds will start clock at correct time
    initializeClock(endtime);
  }
}

$('#pause').on('click', function(){
  running = false;
  clearInterval(timeinterval);
  timerinterval = null;
});

$('#resume').on('click', function(){
  clearInterval(timeinterval);
  timerinterval = null;  
  currentTime = Date.parse(new Date()); 
  var endtime = new Date(currentTime + minutesSpan.innerHTML*60*1000 + secondsSpan.innerHTML*1000);
  running = true;
  if (doBreak === false) { 
    initializeClock(endtime);
  } else {
    breakClock(endtime);
  }
});

$('#reset').on('click', function(){
  running = false;
  doBreak = false;
  document.getElementById('clockdiv').style.color = 'black';
  minutesSpan.innerHTML = counter;
  secondsSpan.innerHTML = ('0' + '0').slice(-2);
  ss.value = counter;
  ss.innerHTML = counter;
  bs.value = breakCounter;
  bs.innerHTML = breakCounter;
  clearInterval(timeinterval);
  timerinterval = null;
});

function restartTimer() {
  running = true;
  doBreak = false;
  clearInterval(timeinterval);
  timerinterval = null;
  currentTime = Date.parse(new Date());
  var endtime = new Date(currentTime + ss.innerHTML*60*1000);
  initializeClock(endtime);
}