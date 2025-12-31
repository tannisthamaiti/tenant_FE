'use client';

import { useState } from 'react';

interface CreateTenantProps {
  landlordId: string;
}

export default function CreateTenant({ landlordId }: CreateTenantProps) {
  const [email, setEmail] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    if (!email) return alert("Please enter an email");
    
    setIsLoading(true);
    try {
      const res = await fetch('http://5.161.48.45:8003/api/landlord/create-tenant', {
        method: 'POST',
        body: JSON.stringify({ 
          tenant_email: email, 
          landlord_id: landlordId 
        }),
        headers: { 'Content-Type': 'application/json' }
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
    <div className="p-6 bg-white rounded-lg shadow-md border border-gray-100">
      <h2 className="text-xl font-bold mb-1 text-gray-800">Register New Tenant</h2>
      <p className="text-sm text-gray-500 mb-4">The tenant will receive a link to set up their account.</p>
      
      <input 
        type="email" 
        placeholder="tenant@email.com" 
        className="border border-gray-300 p-2 w-full rounded mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      
      <button 
        onClick={handleCreate}
        disabled={isLoading}
        className={`w-full md:w-auto px-6 py-2 rounded text-white font-medium transition ${
          isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isLoading ? 'Generating...' : 'Generate Invite Link'}
      </button>

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