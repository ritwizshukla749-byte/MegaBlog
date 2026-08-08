export default function resizeImage(
  file,
  { maxDimension = 1600, quality = 0.85 } = {},
) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    const exportImage = (canvas, type, retry = true) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type }));
          } else if (retry && type !== "image/jpeg") {
            exportImage(canvas, "image/jpeg", false);
          } else {
            reject(new Error("Could not process the image."));
          }
        },
        type,
        quality,
      );
    };

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const { width, height } = image;
      if (width <= maxDimension && height <= maxDimension) {
        resolve(file);
        return;
      }

      const scale = Math.min(1, maxDimension / Math.max(width, height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      exportImage(canvas, file.type || "image/jpeg");
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not load the image."));
    };

    image.src = objectUrl;
  });
}
