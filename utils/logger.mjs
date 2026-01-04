import fs from "fs";
import path from "path";

const logDir = path.resolve("logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logFile = path.join(logDir, "errors.log");

export function logError(err) {
  let errorMessage = "";
  let errorLocation = "";

  if (err instanceof Error) {
    errorMessage = err.message;

    if (err.stack) {
      const lines = err.stack.split("\n");
      // Usually the 2nd line in stack trace contains the file path
      const locationLine = lines[1]?.trim();
      errorLocation = locationLine || "";
    }
  } else {
    errorMessage = String(err);
  }

  // Format time in IST (India Standard Time)
  const timestamp = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour12: true, // 12-hour clock with AM/PM
  });

  const logEntry = `[${timestamp}] ${errorMessage} ${errorLocation}\n`;
  fs.appendFileSync(logFile, logEntry, "utf8");
}
