import React from 'react';
import { Spinner } from 'react-bootstrap';
import type { PositionCandidate } from '../types/kanban';

interface CandidateCardProps {
  /** Datos del candidato a mostrar */
  candidate: PositionCandidate;
  /** true mientras se está procesando el movimiento de este candidato (RF-003) */
  isPending: boolean;
  /** Callback al iniciar el arrastre de esta tarjeta (RF-001) */
  onDragStart: (candidate: PositionCandidate) => void;
}

/**
 * Tarjeta de candidato para el tablero Kanban.
 * Muestra el nombre completo y la puntuación media.
 * Soporta arrastre (HTML5 DnD API) y estado visual pendiente durante actualización.
 */
const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  isPending,
  onDragStart,
}) => {
  return (
    <div
      role="listitem"
      draggable
      aria-grabbed="false"
      aria-busy={isPending}
      className={`card shadow-sm mb-2${isPending ? ' candidate-card--pending' : ''}`}
      onDragStart={() => onDragStart(candidate)}
    >
      <div className="card-body py-2 px-3">
        <p className="card-text fw-semibold mb-1">
          {candidate.fullName}
          {isPending && (
            <Spinner
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              className="ms-2"
            />
          )}
        </p>
        <p className="card-text text-muted small mb-0">
          Puntuación: {candidate.averageScore}
        </p>
      </div>
    </div>
  );
};

export default CandidateCard;
