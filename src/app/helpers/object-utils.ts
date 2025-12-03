type NonFalsy<T> = T extends null | undefined | false | '' | 0 ? never : T;

export type FilterFalsyValues<T> = {
  [K in keyof T as NonFalsy<T[K]> extends never ? never : K]: T[K];
};

function filterFalsyValues<T extends object>(obj: T): FilterFalsyValues<T> {
  return Object.keys(obj).reduce((acc, key) => {
    const value = obj[key as keyof T];
    if (value) {
      (acc as any)[key] = value;
    }
    return acc;
  }, {} as FilterFalsyValues<T>);
}

export default filterFalsyValues;
