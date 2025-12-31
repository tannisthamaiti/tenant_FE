import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import CreateTenant from '@/components/landlord/CreateTenant';
import LiveRequestFeed from "@/components/LiveRequestFeed";
import { LayoutDashboard, Settings } from "lucide-react";

export default async function LandlordPage() {
  // Fetch the user session to get the landlordId
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      

      {/* Main Content Area */}
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Create Tenant Section */}
          <section>
            <CreateTenant landlordId={user.id} />
          </section>

          <hr className="border-slate-200" />

          {/* Existing Live Feed */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Maintenance Requests</h2>
            <LiveRequestFeed />
          </section>
          
        </div>
      </main>
    </div>
  );
}