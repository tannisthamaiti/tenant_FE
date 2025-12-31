'use client';

import { useState } from 'react';

interface CreateTenantProps {
  landlordId: string;
}

export default function CreateTenant({ landlordId }: CreateTenantProps) {
  // 1. State for all required fields
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [unitId, setUnitId] = useState<number | string>('');
  const [leaseStart, setLeaseStart] = useState('');
  const [leaseEnd, setLeaseEnd] = useState('');
  
  const [generatedLink, setGeneratedLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    // Basic Validation
    if (!email || !fullName || !unitId || !leaseStart || !leaseEnd) {
      return alert("Please fill in all fields");
    }

  const payload = {
    email: email,
    full_name: fullName,
    unit_id: Number(unitId),
    lease_start_date: leaseStart,
    lease_end_date: leaseEnd,
    landlord_id: landlordId
  };

  // PRINT TO CONSOLE HERE
  console.log("Sending Payload to Backend:", payload);

    setIsLoading(true);
    try {
      const res = await fetch('http://5.161.48.45:8003/landlord/create-tenant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          full_name: fullName,
          unit_id: Number(unitId), // Ensure this is passed as an integer
          lease_start_date: leaseStart,
          lease_end_date: leaseEnd,
          landlord_id: landlordId
        }),
      });

      const data = await res.json();
      if (data.setup_link) {
        setGeneratedLink(data.setup_link);
      } else {
        alert("Failed to generate link. Check backend logs.");
      }
    } catch (err) {
      console.error("Error creating tenant:", err);
      alert("Network error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md border border-gray-100 max-w-2xl">
      <h2 className="text-xl font-bold mb-1 text-gray-800">Register New Tenant</h2>
      <p className="text-sm text-gray-500 mb-6">Enter tenant details to generate a setup link.</p>

      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-500 outline-none"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            placeholder="tenant@email.com"
            className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Unit ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Unit ID</label>
          <input
            type="number"
            placeholder="e.g. 101"
            className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-500 outline-none"
            value={unitId}
            onChange={(e) => setUnitId(e.target.value)}
          />
        </div>

        {/* Lease Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lease Start</label>
            <input
              type="date"
              className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-500 outline-none"
              value={leaseStart}
              onChange={(e) => setLeaseStart(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lease End</label>
            <input
              type="date"
              className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-500 outline-none"
              value={leaseEnd}
              onChange={(e) => setLeaseEnd(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={handleCreate}
          disabled={isLoading}
          className={`w-full mt-4 px-6 py-3 rounded text-white font-semibold transition ${
            isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Generating...' : 'Generate Invite Link'}
        </button>
      </div>

      {generatedLink && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm font-semibold text-green-800">Invite Link Ready:</p>
          <div className="flex items-center gap-2 mt-2">
            <code className="flex-1 bg-white border border-gray-200 p-2 rounded text-xs break-all text-gray-700">
              {generatedLink}
            </code>
            <button
              onClick={() => navigator.clipboard.writeText(generatedLink)}
              className="bg-white border border-gray-300 px-3 py-2 rounded text-sm hover:bg-gray-50 transition shadow-sm"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}