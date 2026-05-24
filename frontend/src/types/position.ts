/**
 * Tipos de datos compartidos para las features de posiciones.
 * Reutilizados por spec-001 (navegación), spec-002 (Kanban) y spec-003 (mover candidato).
 */

import type { PositionCandidate } from './kanban';

/** Posición abierta del proceso de selección */
export type Position = {
  /** Identificador único de la posición */
  id: number;
  /** Título del puesto */
  title: string;
  /** Nombre del manager responsable */
  manager: string;
  /** Fecha límite en formato ISO 8601 */
  deadline: string;
  /** Estado actual de la posición */
  status: 'Abierto' | 'Contratado' | 'Cerrado' | 'Borrador';
};

/** Paso individual dentro de un flujo de entrevistas */
export type InterviewStep = {
  id: number;
  interviewFlowId: number;
  interviewTypeId: number;
  name: string;
  orderIndex: number;
};

/** Respuesta del endpoint GET /positions/:id/interviewFlow */
export type InterviewFlowResponse = {
  positionName: string;
  interviewFlow: {
    id: number;
    description: string;
    interviewSteps: InterviewStep[];
  };
};

/**
 * Estado de la vista de detalle de posición.
 * Modela las tres fases del ciclo de vida: carga, éxito y error.
 */
export type PositionDetailState =
  | { status: 'loading' }
  | { status: 'success'; positionName: string; interviewSteps: InterviewStep[]; candidates: PositionCandidate[] }
  | { status: 'error'; message: string };
