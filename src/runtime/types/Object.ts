import equal from "fast-deep-equal";

export const extendObjectProto = () => {
  const self = Object.prototype;

  const extendedProto = {
    __type__() {
      return "Object";
    },

    __string__() {
      return this.__type__();
    },

    __eq__(other: object) {
      return equal(this, other);
    },
  };

  Object.assign(self, extendedProto);
};
