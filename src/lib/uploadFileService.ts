"use client";

export interface SignUrlResponse {
  timestamp: number | string;
  signature: string;
  cloud_name: string;
  api_key: string;
}

type RawSignResponse = {
  [key: string]: unknown;
  timestamp?: number | string;
  timeStamp?: number | string;
  signature?: string;
  cloud_name?: string;
  cloudName?: string;
  api_key?: string;
  apiKey?: string;
};

function normalizeSignResponse(raw: RawSignResponse): SignUrlResponse {
  const maybeContainer = raw as unknown as { data?: RawSignResponse };
  const base: RawSignResponse = (maybeContainer && typeof maybeContainer === "object" && maybeContainer.data && typeof maybeContainer.data === "object")
    ? maybeContainer.data
    : raw;

  const timestamp = base.timestamp ?? base.timeStamp;
  const signature = base.signature as string | undefined;
  const cloudName = (base.cloud_name ?? base.cloudName) as string | undefined;
  const apiKey = (base.api_key ?? base.apiKey) as string | undefined;

  if (!timestamp || !signature || !cloudName || !apiKey) {
    throw new Error("Invalid sign-url response: missing required fields");
  }

  return {
    timestamp,
    signature,
    cloud_name: cloudName,
    api_key: apiKey,
  };
}

export interface UploadResponse {
  secure_url: string;
  [key: string]: unknown;
}

export async function uploadFileToCloudinary(params: {
  file: File;
  sign: SignUrlResponse | RawSignResponse;
  uploadPreset?: string;
  resourceType?: "auto" | "image" | "video";
}): Promise<UploadResponse> {
  const { file, sign, uploadPreset = "", resourceType = "auto" } = params;
  const normalized = normalizeSignResponse(sign as RawSignResponse);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", normalized.api_key);
  formData.append("timestamp", String(normalized.timestamp));
  formData.append("signature", normalized.signature);
  if (uploadPreset) formData.append("upload_preset", uploadPreset);

  const cloudUrl = `https://api.cloudinary.com/v1_1/${normalized.cloud_name}/${resourceType}/upload`;
  const res = await fetch(cloudUrl, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Cloudinary upload failed: ${res.status} ${text}`);
  }

  const data: UploadResponse = await res.json();
  console.log(data);
  return data;
}

export async function uploadAndGetUrl(params: {
  file: File;
  sign: SignUrlResponse | RawSignResponse;
  uploadPreset?: string;
  resourceType?: "auto" | "image" | "video";
}): Promise<string> {
  const result = await uploadFileToCloudinary(params);
  if (!result.secure_url) {
    throw new Error("Upload succeeded but no secure_url returned from Cloudinary");
  }
  return result.secure_url;
}
