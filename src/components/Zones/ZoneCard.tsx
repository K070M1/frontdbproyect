"use client";

import styles from "./ZoneCard.module.css";
import {
  FaMapMarkerAlt,
  FaShieldAlt,
  FaCheckCircle,
  FaEdit,
} from "react-icons/fa";

type ZoneCardProps = {
  nombre: string;
  descripcion: string;
  direccion?: string;
  tipoPoligono?: "rectangle" | "circle" | "polygon";
  verificada?: boolean;
  area?: string;
  perimetro?: string;
  coordenadas?: string;
  fechaCreacion?: string;
  ultimaActualizacion?: string;
};

export default function ZoneCard({
  nombre,
  descripcion,
  direccion,
  tipoPoligono = "rectangle",
  verificada = false,
  area = "2.4 km²",
  perimetro = "6.8 km",
  coordenadas = "19.4326, -99.1332",
  fechaCreacion = "15 de Marzo, 2024",
  ultimaActualizacion = "Hace 2 días",
}: ZoneCardProps) {
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

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.zoneInfo}>
          <div className={styles.title}>
            <FaShieldAlt className={styles.zoneIcon} />
            <span>{nombre}</span>
          </div>
          {direccion && (
            <div className={styles.location}>
              <FaMapMarkerAlt className={styles.locationPin} />
              <span>{direccion}</span>
            </div>
          )}
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

      <p className={styles.description}>{descripcion}</p>

      <div className={styles.cardFooter}>
        <div className={styles.safetyBadge}>
          <div className={styles.safetyIcon}></div>
          Zona Segura
        </div>
        <div className={styles.actionButtons}>
          <button className={styles.editButton}>
            <FaEdit /> Editar
          </button>
        </div>
      </div>

      <div className={styles.detailsPanel}>
        <div className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Área</span>
            <span className={styles.detailValue}>{area}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Perímetro</span>
            <span className={styles.detailValue}>{perimetro}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Coordenadas</span>
            <span className={styles.coordinates}>{coordenadas}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Creada</span>
            <span className={styles.detailValue}>{fechaCreacion}</span>
          </div>
          <div className={styles.detailItem} style={{ gridColumn: "span 2" }}>
            <span className={styles.detailLabel}>Última actualización</span>
            <span className={styles.detailValue}>{ultimaActualizacion}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
