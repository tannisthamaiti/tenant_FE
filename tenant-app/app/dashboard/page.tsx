import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: dbUser } = await supabase
    .from('users')
    .select('role, full_name')
    .eq('user_id', user?.id)
    .single();

  const role = dbUser?.role;

  // Define your dashboard cards
  const cards = [
    { 
      title: 'Landlord Portal', 
      description: 'Manage your properties and view analytics.',
      href: '/dashboard/landlord', 
      roles: ['landlord'] 
    },
    { 
      title: 'Tenant Portal', 
      description: 'View your lease and submit maintenance requests.',
      href: '/dashboard/tenant', 
      roles: ['tenant'] 
    },
    { 
      title: 'Agent Portal', 
      description: 'Review listings and client inquiries.',
      href: '/dashboard/agent', 
      roles: ['agent'] 
    },
    { 
      title: 'Vendor Portal', 
      description: 'Track work orders and service requests.',
      href: '/dashboard/vendor', 
      roles: ['vendor'] 
    },
  ];

  // Filter cards to only show what the user is allowed to see
  const visibleCards = cards.filter(card => card.roles.includes(role || ''));

  return (
    <div className="max-w-5xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome back, {dbUser?.full_name || 'User'}
        </h1>
        <p className="text-slate-500">Select a portal to manage your account.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {visibleCards.map((card) => (
          <Link 
            key={card.href} 
            href={card.href}
            className="group p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-400 transition-all"
          >
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 mb-2">
              {card.title}
            </h3>
            <p className="text-slate-600 mb-4">{card.description}</p>
            <span className="text-blue-600 font-medium inline-flex items-center">
              Go to Portal &rarr;
            </span>
          </Link>
        ))}

        {visibleCards.length === 0 && (
          <div className="p-8 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-800 font-medium">
              No portals assigned. Please contact support to verify your role: <strong>{role}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}