"use client";
import React, { useState, useEffect } from 'react';
import { ICardData, IApiResponse } from '../types/businessCard';
import { createClient } from '@/utils/supabase/client'; // Import your client

const API_BASE_URL = process.env.NEXT_PUBLIC_TENANT_API;

const VENDOR_CATEGORIES = [
  "Handyman / General Repairs", "Plumbing", "Electrical", 
  "HVAC (Heating & A/C)", "Cleaning / Turnover / Make-Ready",
  "Landscaping / Lawn Care", "Locksmith / Doors"
];

const CardScanner: React.FC = () => {
  const supabase = createClient();
  
  // 1. Logic to hold the logged-in Vendor ID
  const [vendorId, setVendorId] = useState<string>('');
  
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [cardData, setCardData] = useState<ICardData | null>(null);
  const [notes, setNotes] = useState<string>("");

  // 2. Automatically get the Vendor ID on load
  useEffect(() => {
    const getVendor = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setVendorId(user.id); // Matches the UUID from your auth table
      }
    };
    getVendor();
  }, [supabase]);

  const uploadCard = async () => {
    if (!file || !category || !vendorId) {
      alert("Missing file, category, or vendor session.");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    formData.append('vendor_id', vendorId); // Send the ID we got from Supabase

    try {
      const response = await fetch(`${API_BASE_URL}/upload-card`, {
        method: 'POST',
        body: formData,
      });
      const result: IApiResponse = await response.json();
      setCardData(result.data);
    } catch (error) {
      console.error("Scan error:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveChanges = () => {
    const finalPayload = {
      vendor_id: vendorId, // Verified ID from session
      ...cardData,
      category,
      notes,
    };
    console.log("Final JSON for Database:", JSON.stringify(finalPayload, null, 2));
    alert("Check console for the payload tied to Vendor ID: " + vendorId);
  };

  return (
    <div className="space-y-6">
      {/* Visual Debug: Ensure we have the ID */}
      <div className="text-xs text-slate-400">
        Session Status: {vendorId ? `Connected (${vendorId})` : "Verifying Session..."}
      </div>

      <div className="flex flex-col gap-4 bg-slate-50 p-6 rounded-xl border border-slate-200">
        <label className="text-sm font-semibold text-slate-600">Vendor Category</label>
        <select 
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 border rounded-lg bg-white"
        >
          <option value="" disabled>-- Select Category --</option>
          {VENDOR_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>

        <div className="flex gap-4">
          <input type="file" accept="image/*" onChange={(e) => e.target.files && setFile(e.target.files[0])} />
          <button 
            onClick={uploadCard}
            disabled={!vendorId || loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:bg-slate-300"
          >
            {loading ? 'Processing...' : 'Scan Card'}
          </button>
        </div>
      </div>

      {cardData && (
        <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
          <div className="p-4 border-b bg-slate-50 flex justify-between">
            <h3 className="font-bold">Verify Scanned Data</h3>
            <button onClick={saveChanges} className="bg-green-600 text-white px-3 py-1 rounded text-sm">
              Save to My Profile
            </button>
          </div>
          {/* ... Rest of your table and notes code ... */}
        </div>
      )}
    </div>
  );
};

export default CardScanner;