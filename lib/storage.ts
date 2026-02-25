export function signedUrl(key: string) {
  const cdnBase = process.env.CDN_BASE_URL ?? 'https://cdn.example.com';
  const token = Buffer.from(`${key}:${Date.now() + 3600_000}`).toString('base64url');
  return `${cdnBase}/${key}?sig=${token}`;
}

export async function uploadPlaceholder(fileName: string) {
  return {
    thumbnailUrl: signedUrl(`thumb/${fileName}`),
    mediumUrl: signedUrl(`medium/${fileName}`),
    largeUrl: signedUrl(`large/${fileName}`),
    imageUrl: signedUrl(`orig/${fileName}`)
  };
}
