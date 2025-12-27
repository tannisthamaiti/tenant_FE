// frontend/app/tenant/page.tsx
import Link from 'next/link';

export default function TenantDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Tenant Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* The link connecting to your request form */}
        <Link 
          href="/tenant/create-request" 
          className="p-6 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors"
        >
          <h2 className="text-xl font-semibold text-blue-700">🔧 Create Maintenance Request</h2>
          <p className="text-blue-600 mt-2">Report an issue with your property.</p>
        </Link>

        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl">
          <h2 className="text-xl font-semibold text-gray-700">View My Leases</h2>
          <p className="text-gray-500 mt-2">Check your current rental agreements.</p>
        </div>
      </div>
    </div>
  );
}