export class SrcLoc {
  constructor(public pos: number, public line: number, public col: number) {}

  public static new(pos: number, line: number, col: number) {
    return new SrcLoc(pos, line, col);
  }
}
