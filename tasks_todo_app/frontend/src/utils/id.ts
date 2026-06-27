function randomHex(length: number): string {
  const alphabet = '0123456789abcdef';
  let result = '';

  for (let index = 0; index < length; index += 1) {
    result += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  return result;
}

export function createUuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `${randomHex(8)}-${randomHex(4)}-4${randomHex(3)}-a${randomHex(3)}-${randomHex(12)}`;
}
