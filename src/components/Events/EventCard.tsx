import Link from "next/link";
import Swal from 'sweetalert2'
import dayjs from 'dayjs'
import { IoPin, IoTimeOutline } from "react-icons/io5";
import { Evento } from "@/types/entities/Evento";
import { TipoEventoEnum } from "@/types/enums/TipoEvento";
import { useDeleteEvent } from '@/services/querys/event.query'
import styles from "./EventCard.module.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useSocketStore } from '@/services/socket';

type EventCardProps = {
  evento: Evento;
  tipoNombre: TipoEventoEnum;
  ubicacion?: { lat: number; lng: number };
  time?: string;
  Icon: any;
};

export default function EventCard({ evento, tipoNombre, ubicacion, time, Icon }: EventCardProps) {
  const { mutateAsync: deleteEvent } = useDeleteEvent();
  const { sendSocket } = useSocketStore();

  const handleDelete = async (id: any) => {
    try {
      Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción eliminará el evento permanentemente.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          // Llamar a la función de eliminación
          const res = await deleteEvent(id);
          if (res) {
            sendSocket({
              process: "changes_event",
              action: "event",
              data: {
                response: res
              }
            })
            Swal.fire("Eliminado", "El evento ha sido eliminado correctamente.", "success");
          } else {
            Swal.fire("Error", "No se pudo eliminar el evento. Inténtalo de nuevo más tarde.", "error");
          }
        }
      })
    } catch (error) {
      Swal.fire("Error", "Ocurrió un error al eliminar el evento. Inténtalo de nuevo más tarde.", "error");
    }
  };

  return (
    <div className={styles.card}>
      <div className="flex flex-col gap-2 h-full">
        <div>
          <div className="flex items-center justify-between">
            {
              Icon && (<Icon />)
            }
            {time && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <IoTimeOutline className="size-4" />
                {dayjs(time).format('DD/MM/YYYY HH:mm')}
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
        <div className={styles.actionButtons}>
          <Link href={`/eventos/${evento?.id_evento}`}>
            <button className={styles.editButton}> <FaEdit /> Editar</button>
          </Link>
          <button className={styles.deleteButton} onClick={() => handleDelete(evento?.id_evento)}> <FaTrash /> Eliminar</button>
        </div>
      </div>
    </div>
  );
}
