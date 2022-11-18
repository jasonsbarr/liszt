export const Integer = (value: string | number | bigint) => {
  const num = Number(value);

  if (String(value).includes(".")) {
    throw new Error(`${value} cannot be converted to an Integer`);
  }

  return num <= Number.MAX_SAFE_INTEGER && num >= Number.MIN_SAFE_INTEGER
    ? num
    : BigInt(value);
};

export const extendNumberProto = () => {
  const self = Number.prototype;
  const extendedProto = {
    __type__(): string {
      return Number.isInteger(self.valueOf()) ? "Integer" : "Float";
    },

    __string__(): string {
      const value = self.valueOf();
      return this.__type__() === "Float" && Number.isInteger(value)
        ? `${value}.0`
        : value.toString();
    },
  };

  Object.assign(Number.prototype, extendedProto);
};
