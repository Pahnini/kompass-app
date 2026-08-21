const MAX_INPUT_SIZE = 12 * 1024 * 1024;
const MAX_OUTPUT_SIZE = 3 * 1024 * 1024;
const SUPPORTED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

interface EncodeOptions {
  maxDimension: number;
  quality: number;
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Das Foto konnte nicht gelesen werden.'));
    };
    image.src = objectUrl;
  });
}

function encodeImage(image: HTMLImageElement, options: EncodeOptions): Promise<Blob> {
  const scale = Math.min(
    1,
    options.maxDimension / Math.max(image.naturalWidth, image.naturalHeight)
  );
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) throw new Error('Das Foto kann in diesem Browser nicht verarbeitet werden.');

  canvas.width = width;
  canvas.height = height;
  context.drawImage(image, 0, 0, width, height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => {
        if (blob) resolve(blob);
        else reject(new Error('Das Foto konnte nicht vorbereitet werden.'));
      },
      'image/webp',
      options.quality
    );
  });
}

export async function prepareBackgroundImage(file: File): Promise<Blob> {
  if (!SUPPORTED_IMAGE_TYPES.has(file.type)) {
    throw new Error('Bitte wähle ein Foto im Format JPG, PNG oder WebP aus.');
  }
  if (file.size > MAX_INPUT_SIZE) {
    throw new Error('Das Foto ist zu groß. Bitte verwende ein Bild unter 12 MB.');
  }

  const image = await loadImage(file);
  let result = await encodeImage(image, { maxDimension: 1800, quality: 0.82 });

  if (result.size > MAX_OUTPUT_SIZE) {
    result = await encodeImage(image, { maxDimension: 1200, quality: 0.72 });
  }
  if (result.size > MAX_OUTPUT_SIZE) {
    throw new Error(
      'Das Foto bleibt nach der Verkleinerung zu groß. Bitte wähle ein anderes Bild.'
    );
  }

  return result;
}
