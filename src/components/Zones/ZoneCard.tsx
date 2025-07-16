"use client";

import styles from "./ZoneCard.module.css";
import {
  FaMapMarkerAlt,
  FaShieldAlt,
  FaCheckCircle,
  FaEdit,
  FaTrash
} from "react-icons/fa";

type ZoneCardProps = {
  nombre: string;
  descripcion?: string;
  direccion?: string;
  tipoPoligono?: "rectangle" | "circle" | "polygon";
  verificada?: boolean;
  area?: any;
  perimetro?: any;
  coordenadas?: string;
  fechaCreacion?: string;
  ultimaActualizacion?: string;
  inseguro?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
  id_usuario?: number;         // ← ID del creador de la ruta
  currentUserId?: number;      // ← ID del usuario logueado
  rolUsuario?: string | null;      // ← 'admin' | 'usuario'
};

export default function ZoneCard({
  nombre,
  descripcion,
  direccion,
  inseguro = false,
  tipoPoligono = "rectangle",
  verificada = false,
  area = 0,
  perimetro = 0,
  coordenadas = "",
  fechaCreacion = "",
  onDelete = () => { },
  onEdit = () => { },
  id_usuario,
  currentUserId,
  rolUsuario = null,
}: ZoneCardProps) {

  const puedeEditar = rolUsuario === "admin" || currentUserId === id_usuario;


  const renderShapeIcon = () => {
    const iconProps = {
      width: 60,
      height: 50,
      viewBox: "0 0 60 50",
      className: `${styles.shape} ${styles[tipoPoligono]}`,
    };

    switch (tipoPoligono) {
      case "rectangle":
        return (
          <svg {...iconProps}>
            <rect x="10" y="10" width="40" height="30" strokeWidth="2" rx="2" />
          </svg>
        );
      case "circle":
        return (
          <svg {...iconProps}>
            <circle cx="30" cy="25" r="20" strokeWidth="2" />
          </svg>
        );
      case "polygon":
        return (
          <svg {...iconProps}>
            <polygon points="30,5 50,20 45,40 15,40 10,20" strokeWidth="2" />
          </svg>
        );
    }
  };

  function metros2Km2(m2: number) {
    if (!m2) return "N/A";
    return (m2 / 1_000_000).toFixed(2) + " km²";
  }

  function metros2m(m: number) {
    if (!m) return "N/A";
    return (m * 1000).toFixed(5) + "m";
  }

  function extraerCoordenadas(geojson: any) {
    if (!geojson) return "N/A";
    const obj = typeof geojson === "string" ? JSON.parse(geojson) : geojson;
    // Muestra el centro o el primer punto, según tipo
    if (obj.type === "Point") {
      return `${obj.coordinates[1]}, ${obj.coordinates[0]}`;
    }
    if (obj.type === "Polygon" && obj.coordinates.length > 0) {
      const [lng, lat] = obj.coordinates[0][0];
      return `${lat}, ${lng}`;
    }
    if (obj.type === "MultiPolygon" && obj.coordinates.length > 0) {
      const [lng, lat] = obj.coordinates[0][0][0];
      return `${lat}, ${lng}`;
    }
    return "N/A";
  }

  return (
    <div className={`${styles.card} ${inseguro ? styles.cardInsegura : ''}`}>
      <div className={styles.cardHeader}>
        <div className={styles.zoneInfo}>
          <div className={styles.title}>
            <FaShieldAlt className={styles.zoneIcon} />
            <span>{nombre}</span>
          </div>
          <p className={styles.description}>{descripcion}</p>
        </div>

        <div className={styles.shapeContainer}>
          {renderShapeIcon()}
          {verificada && (
            <div className={styles.verifiedBadge}>
              <FaCheckCircle />
            </div>
          )}
        </div>
      </div>

      <div className={styles.cardFooter}>
        <div className={`${styles.safetyBadge} ${inseguro ? styles.safetyBadgeInseguro : styles.safetyBadgeSeguro}`}>
          <div className={`${styles.safetyIcon} ${inseguro ? styles.safetyIconInseguro : ''}`}></div>
          Zona {inseguro ? 'Insegura' : 'Segura'}
        </div>
        {puedeEditar && (
          <div className={styles.actionButtons}>
            <button className={styles.editButton} onClick={onEdit}>
              <FaEdit /> Editar
            </button>
            <button className={styles.deleteButton} onClick={onDelete}>
              <FaTrash /> Eliminar
            </button>
          </div>
        )}
      </div>

      <div className={styles.detailsPanel}>
        <div className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Área</span>
            <span className={styles.detailValue}>{metros2Km2(area)}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Perímetro</span>
            <span className={styles.detailValue}>{metros2m(perimetro)}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Coordenadas</span>
            <span className={styles.coordinates}>{extraerCoordenadas(coordenadas)}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Creada</span>
            <span className={styles.detailValue}>{fechaCreacion}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
