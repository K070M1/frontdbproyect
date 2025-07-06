"use client";

import { useEffect, useState } from "react";
import styles from "./ZoneForm.module.css";
import {
  FaHospital,
  FaShieldAlt,
  FaSchool,
  FaStore,
  FaTrash,
} from "react-icons/fa";
import Swal from 'sweetalert2'
import { useGetZones, useAddZone, useUpdateZone } from '@/services/querys/zone.query'
import { useSelectableList } from '@/hooks/useList'
import { useRouter } from "next/navigation";

type PolygonType = "rectangle" | "circle" | "polygon";

export default function ZoneForm({
  onLocationSelected,
  onPolygonTypeChange,
  onMapReload,
  onDrawingModeChange,
  drawnShape: externalDrawnShape,
  polygonType: externalPolygonType,
  drawnShapeType: externalDrawnShapeType,
  editMode = false,
  initialData = null,
  zoneId = null,
}: {
  onLocationSelected?: (location: any) => void;
  onPolygonTypeChange?: (type: PolygonType | null) => void;
  onMapReload?: () => void;
  onDrawingModeChange?: (mode: PolygonType | null) => void;
  drawnShape?: any;
  polygonType?: PolygonType | null;
  drawnShapeType?: PolygonType | null;
  editMode?: boolean;
  initialData?: any;
  zoneId?: string | number | null;
}) {

  const router = useRouter();
  const [form, setForm] = useState({ nombre: "", descripcion: "" });
  const [selectedPolygon, setSelectedPolygon] = useState<PolygonType | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [drawnShapeType, setDrawnShapeType] = useState<PolygonType | null>(null);

  const { data: zones, refetch: refetchZones } = useGetZones();
  const { mutateAsync: addZone } = useAddZone();
  const { mutateAsync: updateZone } = useUpdateZone();

  const listZones = useSelectableList(zones)

  useEffect(() => setMounted(true), []);

  // Inicializar formulario con datos existentes en modo edición
  useEffect(() => {
    if (editMode && initialData) {
      setForm({
        nombre: initialData.nombre || "",
        descripcion: initialData.descripcion || "",
      });
      
      // Si hay datos de forma existente, configurar el tipo
      if (initialData.forma) {
        const shapeType = initialData.forma.toLowerCase() as PolygonType;
        setDrawnShapeType(shapeType);
        setSelectedPolygon(shapeType);
      }
    }
  }, [editMode, initialData]);

  // Sincronizar con los estados externos
  useEffect(() => {
    if (externalPolygonType !== undefined) {
      setSelectedPolygon(externalPolygonType);
      setIsDrawingMode(externalPolygonType !== null);
    }
  }, [externalPolygonType]);

  useEffect(() => {
    if (externalDrawnShapeType) {
      setDrawnShapeType(externalDrawnShapeType);
    } else {
      setDrawnShapeType(null);
    }
  }, [externalDrawnShapeType]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePolygonSelection = (type: PolygonType) => {
    // Activar modo de dibujo
    console.log("ZoneForm: Seleccionando tipo de polígono:", type);
    setSelectedPolygon(type);
    setIsDrawingMode(true);
    
    // Notificar al componente padre para activar el modo de dibujo
    onPolygonTypeChange?.(type);
    onDrawingModeChange?.(type);
    console.log("ZoneForm: Callbacks llamados para tipo:", type);
  };

  const handleClearPolygon = () => {
    setSelectedPolygon(null);
    setIsDrawingMode(false);
    setDrawnShapeType(null);
    onPolygonTypeChange?.(null);
    onDrawingModeChange?.(null);
    if (onMapReload) {
      onMapReload();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // En modo edición, permitir guardar sin nueva forma dibujada
    if (!editMode && (!externalDrawnShape || !drawnShapeType)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debes dibujar una figura en el mapa antes de guardar la zona segura.',
      });
      return;
    }

    // Extraer datos de la forma dibujada (solo si hay una nueva forma)
    let shapeData = null;
    if (externalDrawnShape && drawnShapeType) {
      if (drawnShapeType === "circle") {
        shapeData = {
          center: {
            lat: externalDrawnShape.getCenter().lat(),
            lng: externalDrawnShape.getCenter().lng(),
          },
          radius: externalDrawnShape.getRadius(),
        };
      } else if (drawnShapeType === "rectangle") {
        const bounds = externalDrawnShape.getBounds();
        shapeData = {
          bounds: {
            north: bounds.getNorthEast().lat(),
            south: bounds.getSouthWest().lat(),
            east: bounds.getNorthEast().lng(),
            west: bounds.getSouthWest().lng(),
          },
        };
      } else if (drawnShapeType === "polygon") {
        const path = externalDrawnShape.getPath();
        shapeData = {
          coordinates: path.getArray().map((point: any) => ({
            lat: point.lat(),
            lng: point.lng(),
          })),
        };
      }
    }

    const dataToSave = {
      ...form,
      ...(shapeData && {
        tipoPoligono: drawnShapeType,
        shapeData: shapeData,
      }),
    };

    const actionText = editMode ? 'actualizar' : 'guardar';
    const actionPastText = editMode ? 'actualizada' : 'guardada';
    
    console.log(`ZoneForm: ${actionText} zona segura con datos:`, dataToSave);
    
    Swal.fire({
      title: `Confirmar ${editMode ? 'Actualización' : 'Guardado'}`,
      text: `¿Estás seguro de que deseas ${actionText} la zona segura "${form.nombre}"?`,
      showCancelButton: true,
      confirmButtonText: editMode ? 'Actualizar' : 'Guardar',
      cancelButtonText: 'Cancelar',
      icon: 'question',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          let response;
          if (editMode && zoneId) {
            response = await updateZone({ id: zoneId, form: dataToSave });
          } else {
            response = await addZone(dataToSave);
          }
          
          console.log("Respuesta del servidor:", response);
          
          if (response) {
            Swal.fire({
              icon: 'success',
              title: `Zona Segura ${editMode ? 'Actualizada' : 'Guardada'}`,
              text: `La zona segura ha sido ${actionPastText} exitosamente.`,
            });
            console.log(`Zona segura ${actionPastText}:`, response);
            router.push("/zonas");
          } else {
            throw new Error('No se recibió respuesta del servidor');
          }
        } catch (error) {
          console.error(`Error al ${actionText} zona:`, error);
          Swal.fire({
            icon: 'error',
            title: `Error al ${editMode ? 'Actualizar' : 'Guardar'}`,
            text: `No se pudo ${actionText} la zona segura. Inténtalo de nuevo.`,
          });
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.formTitle}>
        {editMode ? 'Editar Zona Segura' : 'Crear Zona Segura'}
      </h2>

      <div className={styles.suggestions}>
        <p className={styles.suggestionsTitle}>
          Sugerencias de lugares seguros:
        </p>
        <div className={styles.suggestionsList}>
          <span className={styles.suggestionItem}>
            <FaShieldAlt /> Comisarías
          </span>
          <span className={styles.suggestionItem}>
            <FaHospital /> Hospitales
          </span>
          <span className={styles.suggestionItem}>
            <FaSchool /> Universidades
          </span>
          <span className={styles.suggestionItem}>
            <FaStore /> Centros comerciales
          </span>
        </div>
      </div>

      <div className={styles.instructionsSection}>
        <h3 className={styles.instructionsTitle}>Instrucciones:</h3>
        <div className={styles.instructionsList}>
          <p>1. Selecciona el tipo de figura que deseas dibujar</p>
          <p>2. Haz clic en el mapa para comenzar a dibujar</p>
          <p>3. Completa la figura según el tipo seleccionado:</p>
          <ul>
            <li><strong>Rectángulo:</strong> Haz clic y arrastra</li>
            <li><strong>Círculo:</strong> Haz clic y arrastra desde el centro</li>
            <li><strong>Polígono:</strong> Haz clic en cada punto y doble clic para finalizar</li>
          </ul>
          <p>4. Completa la información de la zona y guarda</p>
        </div>
      </div>

      {/* Estado de la forma dibujada */}
      {externalDrawnShape && drawnShapeType && (
        <div className={styles.drawnShapeStatus}>
          <p className={styles.statusText}>
            ✅ Forma dibujada: <strong>{drawnShapeType}</strong>
          </p>
        </div>
      )}

      <div className={styles.inputGroup}>
        <label>Nombre de la Zona</label>
        {mounted && (
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
          />
        )}
      </div>

      <div className={styles.inputGroup}>
        <label>Descripción</label>
        {mounted && (
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            placeholder="Describe por qué este lugar es seguro"
            rows={3}
            required
          />
        )}
      </div>

      <div className={styles.polygonSection}>
        <label>Seleccionar tipo de figura para dibujar</label>
        <div className={styles.polygonOptions}>
          {["rectangle", "circle", "polygon"].map((type) => (
            <button
              key={type}
              type="button"
              className={`${styles.polygonButton} ${
                selectedPolygon === type ? styles.selected : ""
              } ${selectedPolygon === type ? styles[type] : ""} ${
                isDrawingMode ? styles.drawing : ""
              }`}
              onClick={() => handlePolygonSelection(type as PolygonType)}
              disabled={isDrawingMode && selectedPolygon !== type}
              title={
                isDrawingMode && selectedPolygon === type
                  ? "Dibuja en el mapa"
                  : isDrawingMode
                  ? "Termina de dibujar la figura actual"
                  : `Seleccionar ${type}`
              }
            >
              <svg width="40" height="40" viewBox="0 0 40 40">
                {type === "rectangle" && (
                  <rect
                    x="8"
                    y="12"
                    width="24"
                    height="16"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeDasharray="3,3"
                  />
                )}
                {type === "circle" && (
                  <circle
                    cx="20"
                    cy="20"
                    r="12"
                    fill="none"
                    stroke="#60a5fa"
                    strokeWidth="2"
                    strokeDasharray="3,3"
                  />
                )}
                {type === "polygon" && (
                  <polygon
                    points="20,8 30,16 26,28 14,28 10,16"
                    fill="none"
                    stroke="#fb923c"
                    strokeWidth="2"
                    strokeDasharray="3,3"
                  />
                )}
              </svg>
            </button>
          ))}

          {/* Botón de eliminar figura */}
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClearPolygon}
            disabled={!selectedPolygon && !externalDrawnShape}
            title="Eliminar figura del mapa"
          >
            <FaTrash />
          </button>
        </div>
      </div>

      <button type="submit" className={styles.submitButton}>
        {editMode ? 'Actualizar Zona Segura' : 'Guardar Zona Segura'}
      </button>
    </form>
  );
}
