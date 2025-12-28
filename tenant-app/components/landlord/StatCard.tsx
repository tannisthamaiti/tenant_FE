export default function StatCard({ title, value, icon, color }: any) {
  const colorMap: any = {
    blue: "border-blue-100",
    red: "border-red-100",
    emerald: "border-emerald-100",
  };

  return (
    <div className={`bg-white p-6 rounded-2xl border ${colorMap[color]} shadow-sm`}>
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 rounded-xl bg-slate-50">{icon}</div>
      </div>
      <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">{title}</p>
      <h2 className="text-4xl font-black text-slate-900 mt-1">{value}</h2>
    </div>
  );
}