export function randomFifthyFifthy() {
  return Math.random() < 0.5;
}

export function randomNumberInRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function debounceFunction(
  callback: (args: any) => void,
  delay: number = 1000
) {
  let timeoutId: undefined | number = undefined;

  return (...args: any) => {
    window.clearTimeout(timeoutId);

    timeoutId = window.setTimeout(() => {
      callback(args);
    }, delay);
  };
}
