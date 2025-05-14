import { Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

type RoutePolylineProps = {
  positions: [number, number][];
  label?: string;
};

export default function RoutePolyline({ positions, label }: RoutePolylineProps) {
  return (
    <Polyline positions={positions} color="blue">
      {label && <Popup>{label}</Popup>}
    </Polyline>
  );
}
