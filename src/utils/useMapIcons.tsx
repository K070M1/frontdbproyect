"use client";

import { useEffect, useState } from "react";
import { IconType } from "react-icons";
import { FaMapMarkerAlt, FaRoute, FaShieldAlt, FaExclamationTriangle } from "react-icons/fa";
import { renderToStaticMarkup } from "react-dom/server";

const ICON_WRAPPER_STYLE: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "24px",
  height: "24px",
};

const createMapIcon = async (IconComponent: IconType, color: string, size = 20) => {
  const leaflet = await import("leaflet"); // ✅ dinámico
  return new leaflet.DivIcon({
    html: renderToStaticMarkup(
      <div style={ICON_WRAPPER_STYLE}>
        <IconComponent color={color} size={size} />
      </div>
    ),
    className: "",
    iconSize: [24, 24],
  });
};

export const useMapIcons = () => {
  const [icons, setIcons] = useState<{
    MARKER?: L.DivIcon;
    ROUTE?: L.DivIcon;
    ZONE?: L.DivIcon;
    ALERT?: L.DivIcon;
  }>({});

  useEffect(() => {
    const loadIcons = async () => {
      const marker = await createMapIcon(FaMapMarkerAlt, "red");
      const route = await createMapIcon(FaRoute, "blue");
      const zone = await createMapIcon(FaShieldAlt, "green");
      const alert = await createMapIcon(FaExclamationTriangle, "orange");

      setIcons({ MARKER: marker, ROUTE: route, ZONE: zone, ALERT: alert });
    };

    loadIcons();
  }, []);

  return icons;
};

export type MapIconKey = "MARKER" | "ROUTE" | "ZONE" | "ALERT";
