import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Alert, Container } from 'react-bootstrap';
import type { InterviewStep, PositionDetailState } from '../types/position';
import type { PositionCandidate } from '../types/kanban';
import {
  getPositionInterviewFlow,
  getPositionCandidates,
  updateCandidateStep,
} from '../services/positionService';
import KanbanBoard from './KanbanBoard';

/**
 * Vista de detalle de una posición.
 * Carga en paralelo el flujo de entrevistas y los candidatos usando Promise.all,
 * y renderiza el tablero Kanban con las fases y tarjetas de candidatos.
 * Gestiona el movimiento optimista de candidatos entre fases con rollback en caso de error.
 */
const PositionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [state, setState] = useState<PositionDetailState>({ status: 'loading' });
  const [moveError, setMoveError] = useState<string | null>(null);
  const [pendingCandidateId, setPendingCandidateId] = useState<number | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const positionId = parseInt(id ?? '', 10);
    if (isNaN(positionId) || positionId <= 0) {
      setState({ status: 'error', message: 'El identificador de la posición no es válido.' });
      return;
    }

    let cancelled = false;
    setState({ status: 'loading' });

    Promise.all([
      getPositionInterviewFlow(positionId),
      getPositionCandidates(positionId),
    ])
      .then(([flowData, candidates]) => {
        if (!cancelled) {
          const interviewSteps = [...flowData.interviewFlow.interviewSteps].sort(
            (a, b) => a.orderIndex - b.orderIndex
          );
          setState({
            status: 'success',
            positionName: flowData.positionName,
            interviewSteps,
            candidates,
          });
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setState({ status: 'error', message: err.message });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  // Gestión del foco: mover el foco al encabezado principal al completar la carga
  useEffect(() => {
    if (state.status !== 'loading') {
      headingRef.current?.focus();
    }
  }, [state.status]);

  /**
   * Mueve un candidato a una nueva fase aplicando actualización optimista.
   * Si la llamada a la API falla, revierte el estado al candidato anterior y muestra un error.
   * RF-002, RF-003, RF-004, RF-005, RF-006, RF-008.
   */
  const handleMoveCandidate = async (
    candidate: PositionCandidate,
    newStep: InterviewStep
  ): Promise<void> => {
    if (state.status !== 'success') return;
    if (candidate.currentInterviewStep === newStep.name) return; // RF-008

    const prevCandidates = state.candidates;
    setMoveError(null);

    // Actualización optimista (RF-004): mover la tarjeta a la nueva columna inmediatamente
    setState((prev) =>
      prev.status === 'success'
        ? {
            ...prev,
            candidates: prev.candidates.map((c) =>
              c.id === candidate.id ? { ...c, currentInterviewStep: newStep.name } : c
            ),
          }
        : prev
    );
    setPendingCandidateId(candidate.id);

    try {
      await updateCandidateStep(candidate.id, candidate.applicationId, newStep.id);
    } catch (err: unknown) {
      // Rollback (RF-005): restaurar el estado anterior si la API falla
      setState((prev) =>
        prev.status === 'success' ? { ...prev, candidates: prevCandidates } : prev
      );
      setMoveError(
        err instanceof Error
          ? err.message
          : 'Error al actualizar la fase. Inténtalo de nuevo.'
      );
    } finally {
      setPendingCandidateId(null);
    }
  };

  return (
    <Container className="mt-5">
      <nav aria-label="Navegación de página">
        <Link
          to="/positions"
          aria-label="Volver al listado de posiciones"
          className="d-inline-flex align-items-center gap-1 text-decoration-none mb-4"
        >
          ← Volver
        </Link>
      </nav>

      {state.status === 'loading' && (
        <div aria-live="polite" aria-busy="true">
          <div className="placeholder-glow mb-4">
            <span className="placeholder col-6 fs-1 d-block" />
          </div>
          <div className="d-flex gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="placeholder-glow"
                style={{ minWidth: '250px', width: '280px' }}
              >
                <span className="placeholder col-8 d-block mb-3" style={{ height: '1.5rem' }} />
                <span className="placeholder col-12 d-block mb-2" style={{ height: '5rem' }} />
                <span className="placeholder col-12 d-block mb-2" style={{ height: '5rem' }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {state.status === 'success' && (
        <>
          <h1 ref={headingRef} tabIndex={-1} className="mb-4">
            {state.positionName}
          </h1>
          {moveError && (
            <Alert
              variant="danger"
              dismissible
              onClose={() => setMoveError(null)}
              className="mb-3"
            >
              {moveError}
            </Alert>
          )}
          <KanbanBoard
            interviewSteps={state.interviewSteps}
            candidates={state.candidates}
            onMoveCandidate={handleMoveCandidate}
            pendingCandidateId={pendingCandidateId}
          />
        </>
      )}

      {state.status === 'error' && (
        <div role="alert">
          <h1 ref={headingRef} tabIndex={-1} className="h4 text-danger">
            {state.message}
          </h1>
          <Link to="/positions">Volver al listado de posiciones</Link>
        </div>
      )}
    </Container>
  );
};

export default PositionDetail;
