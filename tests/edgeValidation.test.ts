import { describe, expect, it } from 'vitest';
import { Direction } from '@prisma/client';
import { reciprocalDirection, validateEdge } from '@/lib/edgeValidation';

describe('edge validation', () => {
  it('blocks conflicting direction usage', () => {
    const edges: any = [{ fromNodeId: '1', direction: Direction.FORWARD }];
    expect(validateEdge(edges, '1', Direction.FORWARD, '2').ok).toBe(false);
  });

  it('maps reciprocal directions', () => {
    expect(reciprocalDirection(Direction.LEFT)).toBe(Direction.RIGHT);
    expect(reciprocalDirection(Direction.FORWARD)).toBe(Direction.BACK);
  });
});
