const timer = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4,
    sessions: 0,
}


let interval;

const mainButton = document.getElementById('js-btn')
mainButton.addEventListener('click', () => {
    const { action } = mainButton.dataset;
    if (action === 'start') {
        startTimer();
    }
    else {
        stopTimer();
    }
});

const modeButtons = document.querySelector('#js-mode-buttons');
modeButtons.addEventListener('click', handleMode);

function getRemainingTime(endTime) {
    const currentTime = Date.parse(new Date());
    const difference = endTime - currentTime;
    //Calculates the time difference to get the remaining time
    const total = Number.parseInt(difference / 1000, 10);
    const minutes = Number.parseInt((total / 60) % 60, 10); //Modulus operator helps to ignore seconds
    const seconds = Number.parseInt(total % 60, 10); //Here we only keep the numbers outside the division by 60

    return {
        total,
        minutes,
        seconds
    };
}

function startTimer() {
    let { total } = timer.remainingTime;
    const endTime = Date.parse(new Date ()) + total * 1000;
    
    if (timer.mode === 'pomodoro') timer.sessions++; 

    mainButton.dataset.action = 'stop';
    mainButton.textContent = 'stop';
    mainButton.classList.add('active');

    interval = setInterval(function () {
        timer.remainingTime = getRemainingTime (endTime);
        
        updateClock();

        total = timer.remainingTime.total;
        if (total <= 0) {
            clearInterval(interval);
        

        //This function switch between modes after the completion of the current mode
            switch (timer.mode) {
                case 'pomodoro':
                    if(timer.session % timer.longBreakInterval === 0) {
                        switchMode('longBreak'); 
                    } else {
                        switchMode('shortBreak');
                    }
                    break;
                default:
                    switchMode('pomodoro');
            }

            startTimer();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(interval);

    mainButton.dataset.action = 'start';
    mainButton.textContent = 'start';
    mainButton.classList.remove('active');
}

function updateClock(){
    const { remainingTime } = timer;           
    const minutes = `${remainingTime.minutes}`.padStart(2, '0');//Padding with 00's
    const seconds = `${remainingTime.seconds}`.padStart(2, '0');

    const min = document.getElementById('js-minutes');
    const sec = document.getElementById('js-seconds');
    min.textContent = minutes;
    sec.textContent = seconds;
}

function switchMode(mode) {
    //Adds two new properties to the timer object
    timer.mode = mode;
    timer.remainingTime = {
        total: timer[mode] * 60,
        minutes: timer[mode],
        seconds: 0,
    }
    //Active class is removed from all the mode buttons and set on the clicked one
    document
        .querySelectorAll('button[data-mode]')
        .forEach(e => e.classList.remove('active'));
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
    document.body.style.backgroundColor = `var(--${mode})`;

    updateClock();
}

function handleMode(event) {
    const { mode } = event.target.dataset;
    if (!mode) return;

    switchMode(mode);
    stopTimer();
}

document.addEventListener('DOMContentLoaded', () => {
    switchMode('pomodoro');
  });