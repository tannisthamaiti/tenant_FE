import LogoutButton from '@/components/LogoutButton';
import { createClient } from '@/utils/supabase/server';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: dbUser } = await supabase
    .from('users')
    .select('role, full_name')
    .eq('user_id', user?.id)
    .single();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-8 text-blue-400">RealEstate AI</h2>
          <nav className="space-y-4">
            <a href="/dashboard" className="block hover:text-blue-300">Overview</a>
            {dbUser?.role === 'landlord' && (
              <a href="/landlord" className="block hover:text-blue-300">My Properties</a>
            )}
            {dbUser?.role === 'tenant' && (
              <a href="/tenant" className="block hover:text-blue-300">Support Tickets</a>
            )}
          </nav>
        </div>
        
        {/* The Logout Button we will create next */}
        <LogoutButton />
      </aside>

      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}