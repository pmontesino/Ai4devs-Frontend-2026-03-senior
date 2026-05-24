import React, { useState } from 'react';
import type { InterviewStep } from '../types/position';
import type { PositionCandidate } from '../types/kanban';
import KanbanColumn from './KanbanColumn';
import './KanbanBoard.css';

interface KanbanBoardProps {
  /** Fases del proceso, ya ordenadas por orderIndex (ordenación aplicada en PositionDetail) */
  interviewSteps: InterviewStep[];
  /** Todos los candidatos de la posición; cada KanbanColumn filtra los propios */
  candidates: PositionCandidate[];
  /** Callback al soltar una tarjeta en una columna distinta a la de origen (RF-002) */
  onMoveCandidate: (candidate: PositionCandidate, newStep: InterviewStep) => void;
  /** ID del candidato cuya actualización está en curso (RF-003) */
  pendingCandidateId: number | null;
}

/**
 * Tablero Kanban que muestra una columna por cada fase del proceso de contratación.
 * Coordina el estado de arrastre (draggingCandidate) entre columnas.
 * El evento onDragEnd sobre el contenedor limpia el estado de arrastre en cualquier escenario
 * (drop exitoso, cancelación, o arrastre fuera de la ventana).
 */
const KanbanBoard: React.FC<KanbanBoardProps> = ({
  interviewSteps,
  candidates,
  onMoveCandidate,
  pendingCandidateId,
}) => {
  const [draggingCandidate, setDraggingCandidate] = useState<PositionCandidate | null>(null);

  const handleDrop = (step: InterviewStep) => {
    if (draggingCandidate && draggingCandidate.currentInterviewStep !== step.name) {
      onMoveCandidate(draggingCandidate, step);
    }
    // Si se suelta en la misma columna (RF-008), no se hace nada
  };

  return (
    <div
      className="d-flex overflow-auto pb-3 kanban-board"
      onDragEnd={() => setDraggingCandidate(null)}
    >
      {interviewSteps.map((step) => (
        <KanbanColumn
          key={step.id}
          step={step}
          candidates={candidates}
          draggingCandidate={draggingCandidate}
          onDragStart={setDraggingCandidate}
          onDrop={handleDrop}
          pendingCandidateId={pendingCandidateId}
        />
      ))}
    </div>
  );
};

export default KanbanBoard;
