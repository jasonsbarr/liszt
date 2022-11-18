export const extendStringProto = () => {
  const self = String.prototype;

  const extendedProto = {
    __type__() {
      return "String";
    },

    __string__() {
      return self.toString();
    },

    __eq__(other: string) {
      return self.toString() === other;
    },

    __lte__(other: string) {
      return self.toString() <= other;
    },

    __plus__(other: string) {
      return self.toString() + other;
    },
  };

  Object.assign(self, extendedProto);
};
