function generateRandomNumber() {
  const randomNumber = Math.random() * 1000000000;
  return Math.ceil(randomNumber);
}

module.exports = generateRandomNumber;
