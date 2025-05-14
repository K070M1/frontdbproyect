import { Polygon, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

type ZonePolygonProps = {
  coordinates: [number, number][];
  label?: string;
};

export default function ZonePolygon({ coordinates, label }: ZonePolygonProps) {
  return (
    <Polygon positions={coordinates} color="green" fillOpacity={0.3}>
      {label && <Popup>{label}</Popup>}
    </Polygon>
  );
}
