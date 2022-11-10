export interface PrettyPrintable {
  get children(): PrettyPrintable[];
  toString(): string;
}
