import type { InterviewFlowResponse } from '../types/position';
import type { PositionCandidate } from '../types/kanban';

const API_BASE_URL = process.env.REACT_APP_API_URL ?? 'http://localhost:3010';

/**
 * Obtiene el flujo de entrevistas de una posición concreta.
 *
 * @param id - Identificador numérico de la posición. Debe ser un entero > 0.
 *             El llamador es responsable de validar este valor antes de invocar la función.
 * @returns Promesa con los datos del flujo de entrevistas incluyendo el nombre de la posición.
 * @throws {Error} Si la posición no existe (404) o si ocurre un error de red o servidor.
 */
export async function getPositionInterviewFlow(
  id: number
): Promise<InterviewFlowResponse> {
  const response = await fetch(`${API_BASE_URL}/position/${id}/interviewflow`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Posición no encontrada');
    }
    throw new Error('Error al cargar la posición. Inténtalo de nuevo.');
  }

  return response.json() as Promise<InterviewFlowResponse>;
}

/**
 * Obtiene la lista de candidatos en proceso para una posición concreta.
 *
 * @param id - Identificador numérico de la posición. Debe ser un entero > 0.
 *             El llamador es responsable de validar este valor antes de invocar la función.
 * @returns Promesa con la lista de candidatos incluyendo su fase actual y puntuación media.
 * @throws {Error} Si la posición no existe (404) o si ocurre un error de red o servidor.
 */
export async function getPositionCandidates(
  id: number
): Promise<PositionCandidate[]> {
  const response = await fetch(`${API_BASE_URL}/position/${id}/candidates`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Posición no encontrada');
    }
    throw new Error('Error al cargar los candidatos. Inténtalo de nuevo.');
  }

  return response.json() as Promise<PositionCandidate[]>;
}

/**
 * Actualiza la fase de un candidato en el proceso de selección.
 * Llama a PUT /candidates/:candidateId con el ID numérico de la nueva fase.
 *
 * @param candidateId - Identificador del candidato (parámetro de ruta).
 * @param applicationId - Identificador del registro de aplicación del candidato.
 * @param interviewStepId - ID numérico de la nueva fase (InterviewStep.id, NO el nombre).
 * @throws {Error} Si el candidato no existe (404) o si ocurre un error de red o servidor.
 */
export async function updateCandidateStep(
  candidateId: number,
  applicationId: number,
  interviewStepId: number
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/candidates/${candidateId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ applicationId, currentInterviewStep: interviewStepId }),
  });

  if (!response.ok) {
    if (response.status === 404) throw new Error('Candidato no encontrado');
    throw new Error('Error al actualizar la fase. Inténtalo de nuevo.');
  }
}
