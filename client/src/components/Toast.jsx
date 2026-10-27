import React from 'react';
import { Sparkles } from 'lucide-react';

export default function Toast({ toasts }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" id="toast-notifications-container">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast" id={`toast-${toast.id}`}>
          <Sparkles size={16} color="#00f2fe" />
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
