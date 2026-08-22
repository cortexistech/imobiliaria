const MAX_BYTES = 8 * 1024 * 1024;
const MAX_FILES = 12;

const MAGIC: Array<{ ext: string; mime: string; test: (b: Uint8Array) => boolean }> = [
  {
    ext: ".jpg",
    mime: "image/jpeg",
    test: (b) => b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  },
  {
    ext: ".png",
    mime: "image/png",
    test: (b) =>
      b.length > 8 &&
      b[0] === 0x89 &&
      b[1] === 0x50 &&
      b[2] === 0x4e &&
      b[3] === 0x47,
  },
  {
    ext: ".gif",
    mime: "image/gif",
    test: (b) =>
      b.length > 6 &&
      b[0] === 0x47 &&
      b[1] === 0x49 &&
      b[2] === 0x46 &&
      b[3] === 0x38,
  },
  {
    ext: ".webp",
    mime: "image/webp",
    test: (b) =>
      b.length > 12 &&
      b[0] === 0x52 &&
      b[1] === 0x49 &&
      b[2] === 0x46 &&
      b[3] === 0x46 &&
      b[8] === 0x57 &&
      b[9] === 0x45 &&
      b[10] === 0x42 &&
      b[11] === 0x50,
  },
];

export function sniffImage(buffer: Buffer) {
  const bytes = buffer.subarray(0, 16);
  return MAGIC.find((entry) => entry.test(bytes)) ?? null;
}

export { MAX_BYTES, MAX_FILES };
