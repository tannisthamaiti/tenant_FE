"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { ICardData, IApiResponse } from '../types/businessCard';

const API_BASE_URL = process.env.NEXT_PUBLIC_TENANT_API;

const VENDOR_CATEGORIES = [
  "Handyman / General Repairs",
  "Plumbing",
  "Electrical",
  "HVAC (Heating & A/C)",
  "Cleaning / Turnover / Make-Ready",
  "Landscaping / Lawn Care",
  "Locksmith / Doors"
];

const CardScanner: React.FC = () => {
  // 1. Initialize Supabase and State
  const supabase = createClient();
  const [vendorId, setVendorId] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [cardData, setCardData] = useState<ICardData | null>(null);
  const [notes, setNotes] = useState<string>("");

  // 2. Fetch Vendor UUID on Load (Same as Maintenance Form)
  useEffect(() => {
    const getVendor = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setVendorId(user.id);
      }
    };
    getVendor();
  }, [supabase]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleFieldChange = (key: keyof ICardData, value: string) => {
    if (!cardData) return;
    setCardData({
      ...cardData,
      [key]: value
    });
  };

  // 3. Upload and Scan Logic
  const uploadCard = async () => {
    if (!file || !category) {
      alert("Please select a file and a service category.");
      return;
    }
    if (!vendorId) {
      alert("Vendor session not found. Please log in.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    formData.append('vendor_id', vendorId);

    try {
      const response = await fetch(`${API_BASE_URL}/upload-card`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to scan card");

      const result: IApiResponse = await response.json();
      setCardData(result.data);
    } catch (error) {
      console.error("Error scanning card:", error);
      alert("Failed to read card. Please try a clearer image.");
    } finally {
      setLoading(false);
    }
  };

  // 4. Save/Log Final Data
  const saveChanges = () => {
    const finalPayload = {
      vendor_id: vendorId, // Tied to the logged-in user
      category: category,
      scanned_details: cardData,
      notes: notes,
      timestamp: new Date().toISOString()
    };

    // Print the clean JSON to console as requested
    console.log("Saving Final Vendor Data:", JSON.stringify(finalPayload, null, 2));
    
    alert(`Data for Vendor ${vendorId} logged to console!`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Session Debug Info */}
      <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
        <span className={`h-2 w-2 rounded-full ${vendorId ? 'bg-green-500' : 'bg-amber-500'}`}></span>
        {vendorId ? `Active Vendor: ${vendorId}` : "Fetching session..."}
      </div>

      {/* Step 1: Upload Section */}
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700">Service Category</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="" disabled>-- Select Category --</option>
              {VENDOR_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700">Business Card Image</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
          </div>
        </div>

        <button 
          onClick={uploadCard}
          disabled={!file || !category || loading || !vendorId}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg font-semibold disabled:bg-slate-300 transition-all shadow-md"
        >
          {loading ? 'AI is analyzing...' : 'Scan & Extract Data'}
        </button>
      </div>

      {/* Step 2: Editable Results & Notes */}
      {cardData && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
          <div className="border border-slate-200 rounded-xl shadow-lg bg-white overflow-hidden">
            <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800">Verify Scanned Details</h3>
                <p className="text-xs text-slate-500">Edit any incorrect fields below</p>
              </div>
              <button 
                onClick={saveChanges}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm"
              >
                Save Profile
              </button>
            </div>

            <table className="min-w-full divide-y divide-slate-200">
              <tbody className="bg-white divide-y divide-slate-100">
                {Object.entries(cardData).map(([key, value]) => (
                  <tr key={key} className="group">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-500 capitalize w-1/3 bg-slate-50/50">
                      {key.replace('_', ' ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                      <input 
                        type="text"
                        value={Array.isArray(value) ? value.join(', ') : (value || '')}
                        onChange={(e) => handleFieldChange(key as keyof ICardData, e.target.value)}
                        className="w-full p-2 border border-transparent group-hover:border-slate-200 focus:border-blue-500 focus:bg-white rounded-md outline-none transition-all"
                        placeholder={`Enter ${key.replace('_', ' ')}...`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700">Additional Internal Notes</label>
            <textarea 
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add details not on the card (e.g. 'Highly recommended by Unit 402', 'Available weekends only')..."
              className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm shadow-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CardScanner;