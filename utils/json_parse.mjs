export const stringToJson = (data) => {
  try {
    // If it's already an object, just return it
    if (typeof data === "object" && data !== null) {
      return data;
    }

    // If it's a string, try parsing
    if (typeof data === "string") {
      return JSON.parse(data);
    }

    // If it's something else (number, boolean, undefined...)
    return null;
  } catch (err) {
    console.error("❌ Failed to parse Redis message:", data, err.message);
    return null;
  }
};
