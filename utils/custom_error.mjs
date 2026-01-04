export class CustomError extends Error {
  constructor(message, statusCode = 400, data = null) {
    super(message);
    this.statusCode = statusCode;
    this.data = data; // ✅ This should work — unless something is overwriting it later
  }
}
