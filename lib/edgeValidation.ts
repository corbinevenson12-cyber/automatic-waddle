import { Direction, type Edge } from '@prisma/client';

export function validateEdge(existingEdges: Edge[], fromNodeId: string, direction: Direction, toNodeId: string) {
  if (fromNodeId === toNodeId) return { ok: false, reason: 'Cannot self-link' };
  const conflict = existingEdges.find((edge) => edge.fromNodeId === fromNodeId && edge.direction === direction);
  if (conflict) return { ok: false, reason: 'Direction already occupied' };
  return { ok: true };
}

export function reciprocalDirection(direction: Direction) {
  if (direction === Direction.FORWARD) return Direction.BACK;
  if (direction === Direction.BACK) return Direction.FORWARD;
  if (direction === Direction.LEFT) return Direction.RIGHT;
  return Direction.LEFT;
}
