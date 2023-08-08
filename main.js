const timer = {
    activeTime: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4,
}

const modeButtons = document.querySelector('#js-mode-buttons');
modeButtons.addEventListener('click', handleMode);

function handleMode(event) {
    const { mode } = event.target.dataset;
    console.log(mode)
    if (!mode) return;

    switchMode(mode);
}

function switchMode(mode) {
    timer.mode = mode;
    timer.remainingTime = {
        total: timer[mode] * 60,
        minutes: timer[mode],
        seconds: 0,
    }
}

function updateClock(){
    const {remainingTime } = timer;
    const minutes = `${remainingTime.minutes}`.padStart(2, '0');
    const seconds = `${remainingTime.seconds}`.padStart(2, '0');

    const min = document.querySelector('#timer_minutes');
    const sec = document.querySelector('#timer_seconds');

    min.textContent = minutes;
    sec.textContent = seconds;
}

let interval;

const startBtn = document.querySelector('#startBtn')
startBtn.addEventListener('click', () => {
    // const { action } = start.Btn.dataset;
    // if (action === 'start') {
        startTimer();
    // }
});

function startTimer() {
    let { total } = timer.remainingTime;
    const endTime = Date.parse(new Date ()) + total * 1000;

    interval = setInterval(function () {
        timer.remainingTime = getRemainingTime (endTime);
        updateClock();

        total = timer.remainingTime.total;
        if (total <= 0) {
            clearInterval(interval);
        }
    }, 1000);
}

function getRemainingTime(endTime) {
    const currentTime = Date.parse(new Date());
    const difference = endTime - currentTime;

    const total = Number.parseInt(difference / 100, 10);
    const minutes = Number.parseInt((total / 60) % 60, 10);
    const seconds = Number.parseInt(total % 60, 10);

    return {
        total,
        minutes,
        seconds
    }
}