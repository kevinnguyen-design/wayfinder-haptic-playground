import { COPY } from '../config';

// Phase 1 placeholder. Hero arrives in phase 3.
export function App() {
  return (
    <main className="p-6 font-sans">
      <h1 className="text-2xl font-bold">{COPY.title}</h1>
      <p>{COPY.promise}</p>
    </main>
  );
}
