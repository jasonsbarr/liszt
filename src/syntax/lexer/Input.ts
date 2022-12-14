import os from "os";

export class Input {
  private _buffer: string;
  public pos: number;
  public line: number;
  public col: number;
  public length: number;

  constructor(buffer: string) {
    this._buffer = buffer;
    this.pos = 0;
    this.line = 1;
    this.col = 1;
    this.length = buffer.length;
  }

  public static new(buffer: string) {
    return new Input(buffer);
  }

  public get buffer() {
    return this._buffer;
  }

  public eof() {
    return this.pos >= this.length;
  }

  public lookahead(chars: number = 1) {
    return this._buffer.charAt(this.pos + chars);
  }

  public next() {
    const char = this._buffer.charAt(this.pos++);

    if (this.peek() === os.EOL || this._buffer.slice(0, -2) === os.EOL) {
      this.line++;
      this.col = 1;
    } else {
      this.col++;
    }

    return char;
  }

  public peek() {
    return this._buffer.charAt(this.pos);
  }

  public readWhile(test: (char: string) => boolean) {
    let result = "";

    while (test(this.peek()) && !this.eof()) {
      result += this.next();
    }

    return result;
  }
}
