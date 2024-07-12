const blinkingIf = (condition: boolean): string => {
  let result: string = "";
  if (condition) {
    result = "blinking";
  }
  return result;
};

export default blinkingIf;
