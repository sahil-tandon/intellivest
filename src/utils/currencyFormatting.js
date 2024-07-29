export function formatIndianRupee(num) {
  const numString = Math.abs(num).toFixed(2);
  const parts = numString.split(".");
  const integerPart = parts[0];
  const decimalPart = parts[1];

  let formattedInteger = integerPart.replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");

  const formattedNumber =
    formattedInteger + (decimalPart ? "." + decimalPart : "");

  return num < 0 ? "-" + formattedNumber : formattedNumber;
}
