import type { InterviewStep } from './position';

/**
 * Candidato en proceso para una posición.
 * Respuesta de GET /position/:id/candidates.
 */
export type PositionCandidate = {
  /** Identificador del candidato — usado como :id en PUT /candidates/:id */
  id: number;
  /** Identificador del registro de aplicación — campo applicationId en el body del PUT */
  applicationId: number;
  /** Nombre completo del candidato */
  fullName: string;
  /** Nombre de la fase actual del candidato — usado para matching con InterviewStep.name */
  currentInterviewStep: string;
  /** Puntuación media del candidato (puede ser 0) */
  averageScore: number;
};

/**
 * Estado del tablero Kanban.
 * Modela las tres fases del ciclo de vida: carga, éxito y error.
 */
export type KanbanBoardState =
  | { status: 'loading' }
  | { status: 'success'; interviewSteps: InterviewStep[]; candidates: PositionCandidate[] }
  | { status: 'error'; message: string };
