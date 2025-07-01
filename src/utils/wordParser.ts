import mammoth from 'mammoth';
export async function parseWordDocument(file: File): Promise<string[]> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value.split('\n').filter(line => line.trim() !== '');
}
