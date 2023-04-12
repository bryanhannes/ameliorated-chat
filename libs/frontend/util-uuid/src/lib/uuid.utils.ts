export function generateUUID(): string {
  const uuidTimestamp = new Date().getTime();
  const uuidSequence = generateUUIDSequence();
  return (
    hex(uuidTimestamp & 0xffffffff) +
    '-' +
    hex((uuidTimestamp >> 32) & 0xffff) +
    '-' +
    hex(((uuidTimestamp >> 48) & 0x0fff) | 0x4000) +
    '-' +
    hex((uuidSequence[0] << 8) | uuidSequence[1]) +
    '-' +
    hex((uuidSequence[2] << 8) | uuidSequence[3]) +
    hex((uuidSequence[4] << 8) | uuidSequence[5]) +
    hex((uuidSequence[6] << 8) | uuidSequence[7]) +
    hex((uuidSequence[8] << 8) | uuidSequence[9]) +
    hex((uuidSequence[10] << 8) | uuidSequence[11])
  );
}

function generateUUIDSequence(): Uint8Array {
  const uuidSequence = new Uint8Array(12);
  for (let i = 0; i < uuidSequence.length; i++) {
    uuidSequence[i] = Math.floor(Math.random() * 256);
  }
  return uuidSequence;
}

function hex(value: number): string {
  return ('0' + value.toString(16)).slice(-4);
}
