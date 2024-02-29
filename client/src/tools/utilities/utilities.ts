export function randomFifthyFifthy() {
  return Math.random() < 0.5;
}

export function randomNumberInRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
