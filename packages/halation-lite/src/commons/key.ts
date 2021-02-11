interface SeenKeys {
  [key: string]: boolean;
}

const seenKeys: SeenKeys = {};
const MULTIPLIER = Math.pow(2, 24) // eslint-disable-line

export const generateRandomKey = () => {
  let key;

  while (key === undefined || seenKeys.hasOwnProperty(key) || !isNaN(+key)) { // eslint-disable-line
    key = Math.floor(Math.random() * MULTIPLIER).toString(32);
  }

  seenKeys[key] = true;
  return key;
};
