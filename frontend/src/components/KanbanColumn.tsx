import React, { useState } from 'react';
import type { InterviewStep } from '../types/position';
import type { PositionCandidate } from '../types/kanban';
import CandidateCard from './CandidateCard';

interface KanbanColumnProps {
  /** Fase del proceso que representa esta columna */
  step: InterviewStep;
  /** Todos los candidatos de la posición; se filtran internamente por step.name */
  candidates: PositionCandidate[];
  /** Candidato que está siendo arrastrado actualmente (null si no hay arrastre) */
  draggingCandidate: PositionCandidate | null;
  /** Callback al iniciar el arrastre de una tarjeta — fluye hacia CandidateCard */
  onDragStart: (candidate: PositionCandidate) => void;
  /** Callback al soltar un candidato en esta columna (RF-002) */
  onDrop: (step: InterviewStep) => void;
  /** ID del candidato cuya actualización está en curso (RF-003) */
  pendingCandidateId: number | null;
}

/**
 * Columna del tablero Kanban para una fase del proceso de contratación.
 * Filtra y muestra solo los candidatos cuya fase actual coincide con esta columna.
 * Actúa como zona de drop para el arrastre de tarjetas (RF-007).
 */
const KanbanColumn: React.FC<KanbanColumnProps> = ({
  step,
  candidates,
  draggingCandidate,
  onDragStart,
  onDrop,
  pendingCandidateId,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const columnCandidates = candidates.filter(
    (c) => c.currentInterviewStep === step.name
  );

  const handleDragOver = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLElement>) => {
    // Solo resetear si salimos de la columna, no al pasar sobre un elemento hijo
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    onDrop(step);
  };

  return (
    <section
      aria-label={step.name}
      className={`kanban-column me-3 flex-shrink-0${isDragOver && draggingCandidate ? ' kanban-column--drag-over' : ''}`}
      style={{ minWidth: '250px', width: '280px' }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h2 className="fs-6 fw-semibold mb-3 text-truncate">{step.name}</h2>
      <div role="list" aria-label={step.name}>
        {columnCandidates.length > 0 ? (
          columnCandidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              isPending={candidate.id === pendingCandidateId}
              onDragStart={onDragStart}
            />
          ))
        ) : (
          <p className="text-muted small fst-italic">Sin candidatos</p>
        )}
      </div>
    </section>
  );
};

export default KanbanColumn;
