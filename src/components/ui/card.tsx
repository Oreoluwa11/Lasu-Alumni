export default function Card({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6 shadow-2xl shadow-slate-950/10">
      {children}
    </div>
  );
}
