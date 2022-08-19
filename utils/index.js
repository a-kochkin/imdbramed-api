const getRandomSix = (arr) => {
  const shallowClone = [...arr];

  let currentIndex = shallowClone.length;

  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    [shallowClone[currentIndex], shallowClone[randomIndex]] = [
      shallowClone[randomIndex], shallowClone[currentIndex]];
  }

  return shallowClone.slice(0, 6);
};

module.exports = {
  getRandomSix,
};
