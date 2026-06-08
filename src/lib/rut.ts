export function formatRut(value: string): string {
  const clean = value.replace(/[^0-9kK]/g, "").toUpperCase();
  if (clean.length === 0) return "";
  if (clean.length === 1) return clean;

  const dv = clean.slice(-1);
  const body = clean.slice(0, -1);

  let formattedBody = "";
  for (let i = 0; i < body.length; i++) {
    const posFromRight = body.length - 1 - i;
    formattedBody += body[i];
    if (posFromRight > 0 && posFromRight % 3 === 0) formattedBody += ".";
  }

  return formattedBody + "-" + dv;
}

export function cleanRut(rut: string): string {
  const clean = rut.replace(/[.\s]/g, "").toUpperCase();
  if (clean.length < 2) return clean;
  if (clean.includes("-")) return clean;
  return clean.slice(0, -1) + "-" + clean.slice(-1);
}

export function isValidRut(rut: string): boolean {
  const clean = rut.replace(/[.\-\s]/g, "").toUpperCase();
  if (!/^\d{7,8}[0-9K]$/.test(clean)) return false;

  const digits = clean.slice(0, -1);
  const dv = clean.slice(-1);

  let sum = 0;
  let mul = 2;
  for (let i = digits.length - 1; i >= 0; i--) {
    sum += parseInt(digits[i]) * mul;
    mul = mul === 7 ? 2 : mul + 1;
  }

  const remainder = 11 - (sum % 11);
  const dvExpected = remainder === 11 ? "0" : remainder === 10 ? "K" : String(remainder);

  return dv === dvExpected;
}
