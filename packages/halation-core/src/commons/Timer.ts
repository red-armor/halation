interface Timer {
  startTime: number;
  time: number;
  endTime: number;
  executingTime: number;
}

interface Timers {
  [key: string]: Timer;
}

const NOOP = () => {};
let initialTime: number = 0;
let getElapsedTime: (startTime: number) => number = (startTime: number) =>
  getTimerTime() - startTime;
let timers: Timers = {};

const NODE_ENV = process.env.NODE_ENV;

const timeLogger = (
  moduleName: string,
  { message, timer }: { message: string; timer: Timer }
) => {
  if (NODE_ENV === 'production') return;

  const title: string = `[${moduleName}]`;
  const titleColor = '#b37feb';
  const messageColor = '#d3adf7';
  const timerColor = '#69c0ff';

  const titleStyle = `color: ${titleColor}; font-weight: bold`;
  const messageStyle = `color: ${messageColor}; font-weight: bold`;
  const timerStyle = `color: ${timerColor}; font-weight: bold`;

  const time = Number(timer.time).toFixed(0);
  const executingTime = Number(timer.executingTime).toFixed(0);
  let timeText = '';

  if (time) {
    timeText += `elapsed time ${time}ms; `;
  }

  if (executingTime) {
    timeText += `executing time ${executingTime}ms`;
  }

  console.log.apply(null, [
    '%c' + title + ' %c' + message + ' %c' + `(${timeText})`,
    titleStyle,
    messageStyle,
    timerStyle,
  ]);
};

const getTimerTime = () => performance.now();

const createTimerEntry = () => {
  return {
    startTime: getTimerTime(),
    endTime: 0,
    time: 0,
    executingTime: 0,
  };
};

const setupTimerHelper = () => {
  initialTime = getTimerTime();
};

export let timeStart: (label: string) => void = NOOP;
export let timeEnd: (label: string) => void = NOOP;
export let timeElapse: (label: string) => void = NOOP;

const getTimerKey = (label: string) => label;

const timeStartImpl = (label: string) => {
  const timerKey = getTimerKey(label);
  const timer = timers[timerKey] || createTimerEntry();
  timers[timerKey] = timer;
};

const timeEndImpl = (label: string) => {
  const timerKey = getTimerKey(label);
  if (timers[timerKey]) {
    const timer = timers[timerKey];
    timer.endTime = getTimerTime();
    const startTime = timer.startTime;
    timer.executingTime = getElapsedTime(startTime);
    timer.time = getElapsedTime(initialTime);
    timeLogger('Timer', {
      message: label,
      timer,
    });
  }
};

const timeElapseImpl = (label: string) => {
  const timerKey = getTimerKey(label);
  const timer = createTimerEntry();
  timers[timerKey] = timer;

  timer.startTime = timer.endTime = getTimerTime();
  timer.time = getElapsedTime(initialTime);
  timeLogger('Timer', {
    message: label,
    timer,
  });
};

export const initializeTimer = (perf: boolean) => {
  if (perf) {
    timers = {};
    setupTimerHelper();
    timeStart = timeStartImpl;
    timeEnd = timeEndImpl;
    timeElapse = timeElapseImpl;
  } else {
    timeStart = NOOP;
    timeEnd = NOOP;
    timeElapse = NOOP;
  }
};
