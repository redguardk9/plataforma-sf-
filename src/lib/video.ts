// Converte um link de vídeo (YouTube/Vimeo/embed) num URL de embed utilizável em <iframe>.
export function toEmbedUrl(url: string | null | undefined): string {
  if (!url) return "";
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return url; // assume que já é um embed/ficheiro
}
