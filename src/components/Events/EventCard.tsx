import { FaClock } from "react-icons/fa";
import { IoPin } from "react-icons/io5";

import { Evento } from "@/types/entities/Evento";
import { TipoEventoEnum } from "@/types/enums/TipoEvento";

import { useDeleteEvent } from '@/services/querys/event.query'
import Link from "next/link";

type EventCardProps = {
  evento: Evento;
  tipoNombre: TipoEventoEnum;
  ubicacion?: { lat: number; lng: number };
  time?: string;
  Icon: any;
};

export default function EventCard({ evento, tipoNombre, ubicacion, time, Icon }: EventCardProps) {
  const { mutateAsync: deleteEvent } = useDeleteEvent();
  
  const handleDelete = async (id: any) => {
    try {
      await deleteEvent(id);
      console.log("Evento eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar el evento:", error);
    }
  };

  const toEdit = () => {

  }

  return (
    <div className="block rounded-md border border-gray-300 p-4 shadow-md sm:p-6">
      <div className="flex flex-col gap-2 h-full">
        <div>
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
        <div className="grow">
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
        <div className="flex items-center flex-row justify-center gap-5">
          <button className="border border-red-500 hover:bg-red-500/50 text-red-500 hover:text-white px-4 py-2 rounded-md hover:cursor-pointer" onClick={() => handleDelete(evento?.id_evento)}>Eliminar</button>
          <Link href={`/eventos/${evento?.id_evento}`}>
            <button className="border border-blue-500 hover:bg-blue-500/50 text-blue-500 hover:text-white px-4 py-2 rounded-md hover:cursor-pointer">Editar</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
