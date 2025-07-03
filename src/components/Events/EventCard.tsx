import { FaExclamationTriangle, FaShieldAlt, FaCarCrash, FaClock } from "react-icons/fa";
import { IoWarningOutline, IoPin } from "react-icons/io5";
import { GiNinjaMask } from "react-icons/gi";

import styles from "./EventCard.module.css";

import { Evento } from "@/types/entities/Evento";
import { TipoEventoEnum } from "@/types/enums/TipoEvento";

type EventCardProps = {
  evento: Evento;
  tipoNombre: TipoEventoEnum;
  ubicacion?: { lat: number; lng: number };
  time?: string;
  Icon: any;
};

export default function EventCard({ evento, tipoNombre, ubicacion, time, Icon }: EventCardProps) {
  return (
    <div className="block rounded-md border border-gray-300 p-4 shadow-md sm:p-6">
      <div className="pb-3">
        <div className="flex items-center justify-between">
          {
            Icon && ( <Icon />)
          }
          {time && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <FaClock className="h-3 w-3" />
              {time}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex-1">
          <h3 className="font-medium text-sm text-gray-500 mb-1">Descripción</h3>
          <p className="text-sm leading-relaxed">{evento.descripcion}</p>
        </div>
        <div className="flex items-start gap-2">
          <IoPin className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" />
          <div>
            <h3 className="font-medium text-sm text-gray-500">Ubicación</h3>
            <div className="grid grid-cols-2 gap-5 text-sm mt-2">
              <span className="truncate"> {ubicacion?.lat || "-"} </span>
              <span className="truncate"> {ubicacion?.lng || "-"} </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
