export interface PrettyPrintable {
  get children(): (PrettyPrintable | PrettyPrintable[])[];
  toString(): string;
}
