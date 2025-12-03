const getObjectKeys = (obj: object): string[] => {
  return Object.keys(obj);
};

const haveSameProperties = (obj1: any, obj2: any): boolean => {
  const keys1 = getObjectKeys(obj1);
  const keys2 = getObjectKeys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (!keys2.includes(key)) {
      return false;
    }

    if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
      if (!haveSameProperties(obj1[key], obj2[key])) {
        return false;
      }
    } else if (typeof obj1[key] !== typeof obj2[key]) {
      return false;
    }
  }

  return true;
};

export default haveSameProperties;
