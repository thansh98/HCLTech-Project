import React from 'react';
import AppRouter from './router';

export default function App() {
  return (
    <div className="min-h-screen bg-brand-dark text-slate-900 dark:text-slate-100 font-sans selection:bg-brand-primary/30 selection:text-white">
      <AppRouter />
    </div>
  );
}
