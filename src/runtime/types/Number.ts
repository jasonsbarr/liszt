enum NumType {
  Integer = "Integer",
  Float = "Float",
}

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

  const thisType = (type: NumType) =>
    extendedProto.__type__.call(self) === type;

  // var so above function can access its type via forward reference
  var extendedProto = {
    __type__(): string {
      return Number.isInteger(self.valueOf()) ? "Integer" : "Float";
    },

    __string__(): string {
      const value = self.valueOf() as number | bigint;
      return thisType(NumType.Float) && isInteger(value)
        ? `${value}.0`
        : value.toString();
    },

    __eq__(other: number | bigint) {
      return self.valueOf() == other.valueOf();
    },

    __lte__(other: number | bigint) {
      return self.valueOf() <= other.valueOf();
    },

    __plus__(other: number | bigint): number | bigint {
      const me = self.valueOf();
      const them = other.valueOf();

      if (thisType(NumType.Float) || isInteger(them)) {
        return me + Number(them);
      } else if (thisType(NumType.Integer) && typeof them === "bigint") {
        return Integer(BigInt(me) + them);
      } else if (isInteger(me) && isInteger(them)) {
        return Integer(me + (them as number));
      }
      return me + (them as number);
    },

    __sub__(other: number | bigint): number | bigint {
      const me = self.valueOf();
      const them = other.valueOf();

      if (thisType(NumType.Float) || isInteger(them)) {
        return me - Number(them);
      } else if (thisType(NumType.Integer) && typeof them === "bigint") {
        return Integer(BigInt(me) - them);
      } else if (isInteger(me) && isInteger(them)) {
        return Integer(me - (them as number));
      }
      return me - (them as number);
    },

    __mul__(other: number | bigint): number | bigint {
      const me = self.valueOf();
      const them = other.valueOf();

      if (thisType(NumType.Float) || isInteger(them)) {
        return me * Number(them);
      } else if (thisType(NumType.Integer) && typeof them === "bigint") {
        return Integer(BigInt(me) * them);
      } else if (isInteger(me) && isInteger(them)) {
        return Integer(me * (them as number));
      }
      return me * (them as number);
    },

    __div__(other: number | bigint): number | bigint {
      const me = self.valueOf();
      const them = other.valueOf();

      if (them === 0 || them === 0n) {
        throw new Error("Cannot divide by zero");
      }

      if (thisType(NumType.Float) || isInteger(them)) {
        return me / Number(them);
      } else if (thisType(NumType.Integer) && typeof them === "bigint") {
        return Integer(BigInt(me) / them);
      } else if (isInteger(me) && isInteger(them)) {
        return Integer(me / (them as number));
      }
      return me / (them as number);
    },

    __mod__(other: number | bigint): number | bigint {
      const me = self.valueOf();
      const them = other.valueOf();

      if (them === 0 || them === 0n) {
        throw new Error("Cannot divide by zero");
      }

      if (thisType(NumType.Float) || isInteger(them)) {
        return me % Number(them);
      } else if (thisType(NumType.Integer) && typeof them === "bigint") {
        return Integer(BigInt(me) % them);
      } else if (isInteger(me) && isInteger(them)) {
        return Integer(me % (them as number));
      }
      return me % (them as number);
    },

    __exp__(other: number | bigint): number | bigint {
      const me = self.valueOf();
      const them = other.valueOf();

      if (thisType(NumType.Float) || isInteger(them)) {
        return me ** Number(them);
      } else if (thisType(NumType.Integer) && typeof them === "bigint") {
        return Integer(BigInt(me) ** them);
      } else if (isInteger(me) && isInteger(them)) {
        return Integer(me ** (them as number));
      }
      return me ** (them as number);
    },

    __band__(other: number | bigint): number | bigint {
      const me = self.valueOf();
      const them = other.valueOf();

      if (thisType(NumType.Float) || isInteger(them)) {
        return me & Number(them);
      } else if (thisType(NumType.Integer) && typeof them === "bigint") {
        return Integer(BigInt(me) & them);
      } else if (isInteger(me) && isInteger(them)) {
        return Integer(me & (them as number));
      }
      return me & (them as number);
    },

    __bor__(other: number | bigint): number | bigint {
      const me = self.valueOf();
      const them = other.valueOf();

      if (thisType(NumType.Float) || isInteger(them)) {
        return me | Number(them);
      } else if (thisType(NumType.Integer) && typeof them === "bigint") {
        return Integer(BigInt(me) | them);
      } else if (isInteger(me) && isInteger(them)) {
        return Integer(me | (them as number));
      }
      return me | (them as number);
    },

    __bnot__() {
      return ~(self.valueOf() as number | bigint);
    },

    __bleft__(other: number | bigint): number | bigint {
      const me = self.valueOf();
      const them = other.valueOf();

      if (thisType(NumType.Float) || isInteger(them)) {
        return me << Number(them);
      } else if (thisType(NumType.Integer) && typeof them === "bigint") {
        return Integer(BigInt(me) << them);
      } else if (isInteger(me) && isInteger(them)) {
        return Integer(me << (them as number));
      }
      return me << (them as number);
    },

    __bright__(other: number | bigint): number | bigint {
      const me = self.valueOf();
      const them = other.valueOf();

      if (thisType(NumType.Float) || isInteger(them)) {
        return me >> Number(them);
      } else if (thisType(NumType.Integer) && typeof them === "bigint") {
        return Integer(BigInt(me) >> them);
      } else if (isInteger(me) && isInteger(them)) {
        return Integer(me >> (them as number));
      }
      return me >> (them as number);
    },
  };

  Object.assign(self, extendedProto);
};
