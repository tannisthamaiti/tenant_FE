import LiveRequestFeed from "@/components/LiveRequestFeed";
import { LayoutDashboard, Settings, Building2 } from "lucide-react";

export default function LandlordPage() {
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Static Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 hidden lg:block">
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white">
            <Building2 size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">PropManager</span>
        </div>
        <nav className="space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg font-semibold">
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-all">
            <Settings size={18} /> Settings
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1">
        {/* We pass the live logic here */}
        <LiveRequestFeed />
      </main>
    </div>
  );
}