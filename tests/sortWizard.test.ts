import { describe, expect, it } from 'vitest';
import { sortNodes } from '@/lib/sortWizard';

describe('sortWizard', () => {
  it('sorts by timestamp and flags uncertain jumps', () => {
    const nodes: any = [
      { id: 'b', timestamp: new Date('2024-01-01T00:02:00Z'), perceptualHash: 'ffff' },
      { id: 'a', timestamp: new Date('2024-01-01T00:01:00Z'), perceptualHash: 'ffff' },
      { id: 'c', timestamp: new Date('2024-01-01T01:00:00Z'), perceptualHash: '0000' }
    ];
    const ordered = sortNodes(nodes);
    expect(ordered.map((n: any) => n.id)).toEqual(['a', 'b', 'c']);
    expect(ordered[1].uncertainJump).toBe(true);
  });
});
