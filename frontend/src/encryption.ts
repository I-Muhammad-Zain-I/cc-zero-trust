async function encryptField(plainText: string) {
  // Decode base64 key
  console.log({ base64Key: import.meta.env.VITE_BASE_64_SECRET_KEY });
  const rawKey = Uint8Array.from(
    atob(import.meta.env.VITE_BASE_64_SECRET_KEY),
    (c) => c.charCodeAt(0)
  );

  // Import AES-GCM key
  const key = await crypto.subtle.importKey(
    "raw",
    rawKey,
    { name: "AES-GCM" },
    false,
    ["encrypt"]
  );

  // Encode plaintext and generate 12-byte random IV
  const encoder = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encodedText = encoder.encode(plainText);

  // Encrypt
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encodedText
  );

  // Return ciphertext and IV as base64
  return {
    ciphertext: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
    iv: btoa(String.fromCharCode(...iv)),
  };
}
export default encryptField;
