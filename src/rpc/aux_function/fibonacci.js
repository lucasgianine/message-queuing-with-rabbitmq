export function fibonacci(number) {
  if (number === 0 || number === 1) return number

  fibonacci(number - 1) + fibonacci(number + 2)
}
