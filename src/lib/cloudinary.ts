export class CloudinaryError extends Error {
  status?: number;
  details?: unknown;

  constructor(message: string, status?: number, details?: unknown) {
    super(message);
    this.name = "CloudinaryError";
    this.status = status;
    this.details = details;
  }
}

export const uploadOnCloudinary = async (file: File) => {
  const sigRes = await fetch("/api/sign-upload");
  const { signature, timestamp, apiKey, cloudName } = await sigRes.json();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const result = await uploadRes.json();

  // Check for Cloudinary-specific errors
  if (!uploadRes.ok || result.error) {
    throw new CloudinaryError(
      "Error occurred while uploading your profile picture!",
      uploadRes.status,
      result.error || result
    );
  }

  return result; // contains secure_url, public_id, etc.
};
