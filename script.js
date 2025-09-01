// Timer variables
let timerInterval;
let timeRemaining = 0; // in seconds
let originalTime = 1500; // store the original timer duration
let isRunning = false;
let isPaused = false;
let heartsRemaining = 9;
let hungerRemaining = 4; // New hunger variable

// Get DOM elements
const btnStart = document.querySelector('.btnStart');
const btnPause = document.querySelector('.btnPause');
const btnEnd = document.querySelector('.btnEnd');
const btnOptions = document.querySelector('.btnOptions');
const btnFeed = document.querySelector('.btnFeed');
const focusTitle = document.querySelector('.focusTitle');

/* PET HEARTS */
function initializeHearts() {
    const heartsContainer = document.getElementById('heartsContainer');
    heartsContainer.innerHTML = ''; 
    
    for (let i = 0; i < 9; i++) {
        const heart = document.createElement('img');
        heart.className = 'heartImage';
        heart.src = i < heartsRemaining ? 'images/fullheart.png' : 'images/emptyheart.png';
        heart.alt = 'heart';
        heartsContainer.appendChild(heart);
    }
}

function updateHearts() {
    const hearts = document.querySelectorAll('.heartImage');
    hearts.forEach((heart, index) => {
        heart.src = index < heartsRemaining ? 'images/fullheart.png' : 'images/emptyheart.png';
    });
}

function loseHeart() {
    if (heartsRemaining > 0) {
        heartsRemaining--;
        updateHearts();
        
        if (heartsRemaining === 0) {
            alert('Oh no! Your pet is not feeling well. Take better care of them!');
        }
    }
}

function gainHeart() {
    if (heartsRemaining < 9) {
        heartsRemaining++;
        updateHearts();
    }
}

/* PET HUNGER */
function initializeHunger() {
    const hungerContainer = document.getElementById('hungerContainer');
    hungerContainer.innerHTML = ''; 
    
    for (let i = 0; i < hungerRemaining; i++) {
        const hunger = document.createElement('img');
        hunger.className = 'hungerImage';
        hunger.src = 'images/hunger.png';
        hunger.alt = 'hunger';
        hungerContainer.appendChild(hunger);
    }
}

function updateHunger() {
    const hungerContainer = document.getElementById('hungerContainer');
    hungerContainer.innerHTML = ''; 
    
    for (let i = 0; i < hungerRemaining; i++) {
        const hunger = document.createElement('img');
        hunger.className = 'hungerImage';
        hunger.src = 'images/hunger.png';
        hunger.alt = 'hunger';
        hungerContainer.appendChild(hunger);
    }
}

function loseHunger() {
    if (hungerRemaining > 0) {
        hungerRemaining--;
        updateHunger();
        
        if (hungerRemaining === 0) {
            alert('Your pet is very hungry! Feed them soon!');
        }
    }
}

// Pet interaction functions
function feedPet() {
    if (hungerRemaining <= 0) {
        alert('Your pet is not hungry right now!');
    } else if (heartsRemaining >= 9) {
        alert('Your pet is full!');
    } else {
        // Remove one hunger and gain one heart
        loseHunger();
        gainHeart();
        
        const onyxImage = document.querySelector('.onyxImage');
        onyxImage.style.transform = 'scale(1.1)';
        setTimeout(() => {
            onyxImage.style.transform = 'scale(1)';
        }, 200);
    }
}

function endTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    isPaused = false;
    
    btnStart.textContent = 'Start';
    btnStart.disabled = false;
    btnPause.textContent = 'Pause';
    
    // Only lose a heart if timer completed successfully (reached 0)
    if (timeRemaining <= 0) {
        alert('Time\'s up! Great job focusing!');
        gainHeart(); 
        // Restore some hunger when completing a timer
        if (hungerRemaining < 4) {
            hungerRemaining = Math.min(4, hungerRemaining + 1);
            updateHunger();
        }
    } else {
        // Timer was ended early so the user loses a heart
        loseHeart();
    }
    
    timeRemaining = originalTime;
    updateDisplay();
}

// Timer display
let timerDisplay = null;

document.addEventListener('DOMContentLoaded', function() {
    createTimerDisplay();
    initializeHearts(); 
    initializeHunger(); 
    
    // Event listeners for timer
    btnStart.addEventListener('click', startTimer);
    btnPause.addEventListener('click', pauseTimer);
    btnEnd.addEventListener('click', endTimer);
    btnOptions.addEventListener('click', openOptions);
    
    // Event listeners for pet interactions
    btnFeed.addEventListener('click', feedPet);
    
    // Default time (25 minutes = 1500 seconds)
    timeRemaining = 1500;
    originalTime = 1500;
    updateDisplay();
});

function createTimerDisplay() {
    timerDisplay = document.createElement('div');
    timerDisplay.className = 'timerDisplay';
    timerDisplay.textContent = '25:00';
    
    // Insert the timer after the title
    focusTitle.insertAdjacentElement('afterend', timerDisplay);
}

function startTimer() {
    if (timeRemaining <= 0) {
        alert('Please set a timer duration in Options first!');
        return;
    }
    
    if (!isRunning) {
        isRunning = true;
        isPaused = false;
        
        timerInterval = setInterval(function() {
            timeRemaining--;
            updateDisplay();
            
            if (timeRemaining <= 0) {
                endTimer();
            }
        }, 1000);
        
        btnStart.textContent = 'Running...';
        btnStart.disabled = true;
    }
}

function pauseTimer() {
    if (isRunning && !isPaused) {
        // Pauses the timer
        clearInterval(timerInterval);
        isPaused = true;
        btnPause.textContent = 'Resume';
        btnStart.textContent = 'Start';
        btnStart.disabled = false;
    } else if (isPaused) {
        // Resumes the timer
        startTimer();
        btnPause.textContent = 'Pause';
    }
}

function openOptions() {
    const minutes = prompt('Set timer duration in minutes:', '25');
    
    if (minutes !== null && !isNaN(minutes) && minutes > 0) {
        originalTime = parseInt(minutes) * 60; 
        timeRemaining = originalTime;
        updateDisplay();
        
        // If the timer is running, stop it
        if (isRunning) {
            endTimer();
        }
    }
}

function updateDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const displayTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    if (timerDisplay) {
        timerDisplay.textContent = displayTime;
    }
}