//Global Variables
let pattern = [2, 2, 4, 3, 2, 1, 2, 4];
let progress = 0; 
let gamePlaying = false;
let tonePlaying = false;
let guessCounter = 0;
let volume = 0.5; 
let clueHoldTime = 1000;
const cluePauseTime = 333;
const nextClueWaitTime = 1000;
const startBtn = document.getElementById('startBtn')
const stopBtn = document.getElementById('stopBtn')

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
} 

function clearButton(btn) {
  document.getElementById("button"+btn).classList.remove("lit")
}


function startGame() {
  progress = 0;
  gamePlaying = true;
  startBtn.classList.add("hidden");
  stopBtn.classList.remove("hidden");
  playClueSequence()
}

function stopGame() {
  gamePlaying = false;
  stopBtn.classList.add("hidden");
  startBtn.classList.remove("hidden");
}

function loseGame() {
  stopGame();
  alert("Game over, sorry you lost!");
}

function winGame() {
  stopGame();
  alert("Congratulations! You won!");
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}
function playClueSequence(){
  guessCounter = 0;
  context.resume()
  let delay = nextClueWaitTime; 
  for(let i=0;i<=progress;i++){ 
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) 
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
}

function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }

  if(pattern[guessCounter] == btn){ //if the player pressed the correct button
    if(guessCounter == progress) { //has the player completed all guesses
      if(progress == pattern.length - 1) { //has the player completed the entire pattern
        winGame();
      }
      else{ //player moves to the next round
        progress++;
        playClueSequence();
      }
    }
    else{ //player makes a guess, they can make their next guess
      guessCounter++;
    }
  }
  else{ //player didn't guess correctly. Good Game. 
    loseGame();
  }
}    

const freqMap = {
    1: 261.6,
    2: 329.6,
    3: 392,
    4: 466.2
  }
  function playTone(btn,len){ 
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
    setTimeout(function(){
      stopTone()
    },len)
  }
  function startTone(btn){
    if(!tonePlaying){
      context.resume()
      o.frequency.value = freqMap[btn]
      g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
      context.resume()
      tonePlaying = true
    }
  }
  function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
  }

  let AudioContext = window.AudioContext || window.webkitAudioContext 
  let context = new AudioContext()
  let o = context.createOscillator()
  let g = context.createGain()
  g.connect(context.destination)
  g.gain.setValueAtTime(0,context.currentTime)
  o.connect(g)
  o.start(0)
