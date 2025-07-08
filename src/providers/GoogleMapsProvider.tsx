"use client";

import { LoadScript } from "@react-google-maps/api";

interface GoogleMapsProviderProps {
    children: React.ReactNode;
}

const libraries: ("drawing" | "geometry" | "places" | "visualization")[] = [
    "drawing",
    "places",
];

export const GoogleMapsProvider = ({ children }: GoogleMapsProviderProps) => {
    return (
        <LoadScript
            googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
            libraries={libraries}
            id="google-maps-script"
            version="weekly"
        >
            {children}
        </LoadScript>
    );
};
