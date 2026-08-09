const VALID_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024;

export default async function validateImageFile(file) {
  if (!VALID_TYPES.includes(file.type)) {
    throw new Error("Image must be a PNG, JPEG, or GIF file.");
  }
  if (file.size > MAX_SIZE) {
    throw new Error("Image must be less than 5MB.");
  }

  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const isPNG = bytes[0] === 0x89 && bytes[1] === 0x50;
  const isJPEG = bytes[0] === 0xff && bytes[1] === 0xd8;
  const isGIF = bytes[0] === 0x47 && bytes[1] === 0x49;
  if (!isPNG && !isJPEG && !isGIF) {
    throw new Error("File content does not match an image.");
  }
}
