import React from 'react';
import Link from 'next/link';

// Define the user roles for type safety
type UserRole = 'tenant' | 'vendor' | 'landlord' | 'agent';

interface PortalCard {
  title: string;
  description: string;
  href: string;
  role: UserRole;
  icon: string;
}

const portals: PortalCard[] = [
  {
    title: 'Tenant Portal',
    description: 'Pay rent, request maintenance, and view your lease.',
    href: '/tenant',
    role: 'tenant',
    icon: '🏠',
  },
  {
    title: 'Landlord Portal',
    description: 'Manage properties, track payments, and screen tenants.',
    href: '/landlord',
    role: 'landlord',
    icon: '📊',
  },
  {
    title: 'Vendor Portal',
    description: 'Access work orders and submit maintenance invoices.',
    href: '/vendor',
    role: 'vendor',
    icon: '🛠️',
  },
  {
    title: 'Agent Portal',
    description: 'Manage listings, leads, and property showings.',
    href: '/agent', // Note: You'll need to create this folder in /app
    role: 'agent',
    icon: '🤝',
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
          Property Management System
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          Select your portal to get started
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl w-full">
        {portals.map((portal) => (
          <Link 
            key={portal.role} 
            href={portal.href}
            className="group bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all hover:border-blue-500"
          >
            <div className="text-4xl mb-4">{portal.icon}</div>
            <h2 className="text-2xl font-semibold text-gray-800 group-hover:text-blue-600">
              {portal.title} &rarr;
            </h2>
            <p className="mt-2 text-gray-500">
              {portal.description}
            </p>
          </Link>
        ))}
      </div>

      <footer className="mt-16 text-gray-400 text-sm">
        © {new Date().getFullYear()} PropertyCare Inc. All rights reserved.
      </footer>
    </main>
  );
}