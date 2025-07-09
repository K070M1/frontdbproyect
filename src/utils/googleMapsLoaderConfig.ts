export const GOOGLE_MAPS_LIBRARIES: string[] = ["drawing", "places"];

export const GOOGLE_MAPS_LOADER_CONFIG = {
  id: "google-map-script",
  version: "weekly",
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  libraries: [...GOOGLE_MAPS_LIBRARIES], // mutable array
  language: "en",
  region: "US",
};
