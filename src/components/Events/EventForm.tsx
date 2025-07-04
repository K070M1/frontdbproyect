"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import styles from "./EventForm.module.css";
import { TipoEventoEnum } from "@/types/enums/TipoEvento";
import BaseMap from "@/components/Map/BaseMap";
import { useSelectableList } from '@/hooks/useList'
import { useGetTypeEvents } from '@/services/querys/type_event.query'
import { useAddEvent, useUpdateEvent } from '@/services/querys/event.query'
import { MapMarker, Marker, InfoWindow, Polyline, Polygon } from '@/components/Map/MapShell'
import { FaPerson, FaPersonRunning, FaMapLocationDot, FaRoute } from 'react-icons/fa6'
import { Button } from '@heroui/button'

export default function EventForm({ evento }: { evento?: any }) {
  const isEditing = !!evento;
  const router = useRouter();
  const { data: queryTypeEvent } = useGetTypeEvents();
  const { mutateAsync: updateEvent } = useUpdateEvent();
  const { mutateAsync: addEvent } = useAddEvent();
  const listTypeEvents = useSelectableList(queryTypeEvent);

  const defaultCenter = useMemo(() => ({ lat: -12.127, lng: -76.973 }), []);
  const [userPosition, setUserPosition] = useState<{ lat: number; lng: number } | null>(evento ? { lat: evento.lat, lng: evento.lng } : null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isEditingPosition, setIsEditingPosition] = useState(false);
  const [form, setForm] = useState<any>({ 
    tipo: evento?.id_tipo_evento || "", 
    iconUrl: "", 
    descripcion: evento?.descripcion || ""
  });

  const currentPositionUser = () => {
    if (!navigator.geolocation) {
      setLocationError("Tu navegador no soporta geolocalización.");
      return;
    }

    const options = { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const current = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserPosition(current);
      },
      (error) => {
        let errorMessage = "";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Permiso de ubicación denegado. Habilítalo en tu navegador.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Ubicación no disponible. Verifica tu conexión o hardware.";
            break;
          case error.TIMEOUT:
            errorMessage = "Tiempo de espera agotado. Intenta nuevamente.";
            break;
          default:
            errorMessage = "Error desconocido al obtener la ubicación.";
        }
        console.error("Error de geolocalización:", errorMessage, error);
        setLocationError(errorMessage);
      },
      options
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev:any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(userPosition){
      form.lat = userPosition.lat;
      form.lng = userPosition.lng;
    };
    if(form.tipo) form.id_tipo_evento = parseFloat(form.tipo);
    try {
      const res = await (isEditing ? updateEvent({ id: evento?.id_evento, form}) : addEvent(form));
      if (res) {
        console.log("Evento guardado exitosamente:", res);
        // Redirigir a la página de eventos
        router.push("/eventos");
      }
    } catch (error) {
      console.error("Error al guardar el evento:", error);
    }
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (isEditingPosition && e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      const newPosition = { lat, lng };
      setUserPosition(newPosition);
      setIsEditingPosition(false);
    }
  };

  useEffect(() => {
    if (form.tipo) {
      const t_ev:any = listTypeEvents.list.find((type: any) => type.id_tipo_evento == form.tipo);
      console.log("Tipo de evento seleccionado:", t_ev);
      switch (t_ev?.nombre) {
        case "Robo":
          setForm((prev:any) => ({ ...prev, iconUrl: "/map-icons/iThiefMap.png"}));
          break;
        case "Choque":
          setForm((prev:any) => ({ ...prev, iconUrl: "/map-icons/iCarMap.png"}));
          break;
        case "Policia":
          setForm((prev:any) => ({ ...prev, iconUrl: "/map-icons/iPoliceMap.png"}));
          break;
        default:
          setForm((prev:any) => ({ ...prev, iconUrl: "/map-icons/iWarningMap.png"}));
          break;
      }
    }
  }, [form.tipo]);

  useEffect(() => {
    if (isEditing && !userPosition) {
      currentPositionUser();
    } else if (!isEditing) {
      currentPositionUser();
    }
  }, []);

  // Configurar el icono cuando se está editando un evento existente
  useEffect(() => {
    if (isEditing && evento && listTypeEvents.list.length > 0 && !form.iconUrl) {
      const t_ev: any = listTypeEvents.list.find((type: any) => type.id_tipo_evento == evento.id_tipo_evento);
      if (t_ev) {
        switch (t_ev.nombre) {
          case "Robo":
            setForm((prev: any) => ({ ...prev, iconUrl: "/map-icons/iThiefMap.png" }));
            break;
          case "Choque":
            setForm((prev: any) => ({ ...prev, iconUrl: "/map-icons/iCarMap.png" }));
            break;
          case "Policia":
            setForm((prev: any) => ({ ...prev, iconUrl: "/map-icons/iPoliceMap.png" }));
            break;
          default:
            setForm((prev: any) => ({ ...prev, iconUrl: "/map-icons/iWarningMap.png" }));
            break;
        }
      }
    }
  }, [isEditing, evento, listTypeEvents.list, form.iconUrl]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <form onSubmit={handleSubmit} className="col-span-1 p-4 border border-gray-300 bg-white rounded-lg shadow-lg">
        <label className={styles.label}>Tipo de Evento</label>
        <select
          name="tipo"
          value={form.tipo}
          onChange={handleChange}
          required
          className={styles.input}
        >
          <option value="" disabled> Selecciona un tipo de evento</option>
          {listTypeEvents.list.map((type:any) => (
            <option key={type.id_tipo_evento} value={type.id_tipo_evento}>
              {type.nombre}
            </option>
          ))}
        </select>

        <label className={styles.label}>Descripción</label>
        <textarea
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          required
          className={styles.textarea}
        ></textarea>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <Button
            startContent={isEditingPosition ? <FaPersonRunning className="size-4" /> : <FaPerson className="size-4" />}
            className="flex flex-row gap-2 rounded-sm bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:cursor-pointer shadow-md!"
            radius="md" onPress={() => setIsEditingPosition(!isEditingPosition)}
          >
            {isEditingPosition ? "Asignando posición..." : "Asignar Posición"}
          </Button>

          <button type="submit" className={`rounded-sm bg-blue-500 px-4 py-3 text-sm font-medium text-white hover:cursor-pointer shadow-md!`}>
            {isEditing ? "Actualizar Evento" : "Guardar Evento"}
          </button>
        </div>
      </form>
      <div className="col-span-2 h-[calc(100vh-300px)] rounded-2xl overflow-hidden border border-gray-300 shadow-lg">
        <BaseMap key={`${userPosition ? userPosition.toString() : defaultCenter.toString()}${form.iconUrl}`} center={userPosition || defaultCenter} onClick={handleMapClick} >
          {(userPosition && form.iconUrl) && <MapMarker position={userPosition} iconUrl={form.iconUrl} iconSize={{ height: 50, width: 50 }}/>}
        </BaseMap>
      </div>
    </div>
  );
}
