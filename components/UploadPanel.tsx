'use client';

import { useDropzone } from 'react-dropzone';
import { useState } from 'react';

export function UploadPanel({ projectId }: { projectId: string }) {
  const [status, setStatus] = useState('');
  const onDrop = async (files: File[]) => {
    if (files.length > 200) {
      setStatus('Batch limit is 200 files');
      return;
    }
    const form = new FormData();
    form.append('projectId', projectId);
    for (const file of files) form.append('files', file);
    const res = await fetch('/api/uploads', { method: 'POST', body: form });
    const payload = await res.json();
    setStatus(`Uploaded ${payload.count} files`);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <div {...getRootProps()} className={`card border-dashed ${isDragActive ? 'border-blue-500' : ''}`}>
      <input {...getInputProps()} />
      <p>Drag & drop up to 200 photos</p>
      <p className="mt-2 text-xs text-slate-400">Resumable upload compatible endpoint is enabled server-side.</p>
      <p className="mt-2 text-sm">{status}</p>
    </div>
  );
}
