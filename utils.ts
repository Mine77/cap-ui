import type { NuwaCapUIResource, NuwaCapUIURI } from "@/types/nuwa-iframe-ui";

const MAX_UI_HEIGHT = 500;

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

export function isValidName(name: string): boolean {
  return (
    typeof name === "string" &&
    name.trim().length > 0 &&
    /^[a-zA-Z0-9-]+$/.test(name)
  );
}

export interface CreateCapUIResourceProps {
  type: "embed-ui" | "artifact-ui";
  uiUrl: string;
  name: string;
  height?: number;
}

export const createCapUIResource = ({
  type,
  uiUrl,
  name,
  height,
}: CreateCapUIResourceProps): NuwaCapUIResource => {
  if (!isValidUrl(uiUrl)) throw new Error("Invalid URL");

  if (!isValidName(name)) throw new Error("Invalid Name");

  if (height && height > MAX_UI_HEIGHT)
    throw new Error("height exceeds max UI height");

  const uri = `capui://${type}/${name}` as NuwaCapUIURI;

  return {
    uri,
    name,
    text: uiUrl,
    annotations: {
      height,
    },
  };
};
