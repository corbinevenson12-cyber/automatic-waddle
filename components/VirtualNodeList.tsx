'use client';

import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

export function VirtualNodeList({ nodes }: { nodes: any[] }) {
  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: nodes.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 74,
    overscan: 10
  });

  return (
    <div ref={parentRef} className="h-[420px] overflow-auto rounded-lg border border-slate-800">
      <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}>
        {rowVirtualizer.getVirtualItems().map((item) => {
          const node = nodes[item.index];
          return (
            <div key={node.id} className="absolute left-0 top-0 w-full border-b border-slate-800 px-3 py-2" style={{ transform: `translateY(${item.start}px)` }}>
              <p className="text-sm font-medium">{node.id.slice(0, 8)} · {node.areaTag ?? 'untagged'}</p>
              <p className="text-xs text-slate-400">{node.timestamp ? new Date(node.timestamp).toLocaleString() : 'No timestamp'}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
