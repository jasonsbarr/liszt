export const Integer = (value: string | number | bigint) => {
  const num = Number(value);

  if (String(value).includes(".")) {
    throw new Error(`${value} cannot be converted to an Integer`);
  }

  return num <= Number.MAX_SAFE_INTEGER && num >= Number.MIN_SAFE_INTEGER
    ? num
    : BigInt(value);
};

const isInteger = (value: number | bigint) => {
  return typeof value === "bigint" || Number.isInteger(value);
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

    __plus__(other: number | bigint): number | bigint {
      const me = self.valueOf();
      const them = other.valueOf();

      if (this.__type__() === "Float" || isInteger(them)) {
        return me + Number(them);
      } else if (this.__type__() === "Integer" && typeof them === "bigint") {
        return Integer(BigInt(me) + them);
      } else if (isInteger(me) && isInteger(them)) {
        return Integer(me + (them as number));
      }
      return me + (them as number);
    },
  };

  Object.assign(Number.prototype, extendedProto);
};
