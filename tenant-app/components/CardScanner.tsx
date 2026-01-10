"use client";
import React, { useState, useEffect } from 'react';
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

interface CardScannerProps {
  vendorId: string; // Passed from the logged-in session/parent component
  initialCategory?: string; // Optional: prepopulate if they already have a category
}

const CardScanner: React.FC<CardScannerProps> = ({ vendorId, initialCategory }) => {
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<string>(initialCategory || "");
  const [loading, setLoading] = useState<boolean>(false);
  const [cardData, setCardData] = useState<ICardData | null>(null);
  const [notes, setNotes] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleFieldChange = (key: keyof ICardData, value: string) => {
    if (!cardData) return;
    setCardData({ ...cardData, [key]: value });
  };

  const uploadCard = async () => {
    if (!file || !category) {
      alert("Please select a file and a category.");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    formData.append('vendor_id', vendorId); // Pass the ID so the backend knows who this is

    try {
      const response = await fetch(`${API_BASE_URL}/upload-card`, {
        method: 'POST',
        body: formData,
      });

      const result: IApiResponse = await response.json();
      setCardData(result.data);
    } catch (error) {
      console.error("Error scanning card:", error);
      alert("Failed to read card.");
    } finally {
      setLoading(false);
    }
  };

  const saveChanges = async () => {
    const finalPayload = {
      vendor_id: vendorId, // Critical: Ensuring the ID is tied to the payload
      ...cardData,
      category,
      notes,
      updated_at: new Date().toISOString()
    };

    console.log("Final JSON for Vendor ID:", vendorId, finalPayload);
    
    try {
      // You likely want a PUT or PATCH request since the vendor already exists
      const response = await fetch(`${API_BASE_URL}/vendors/${vendorId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalPayload),
      });

      if (response.ok) {
        alert("Vendor profile updated successfully!");
      }
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Update Vendor Profile</h2>
        <p className="text-sm text-slate-500">Logged in as Vendor ID: <span className="font-mono bg-slate-100 px-1 rounded">{vendorId}</span></p>
      </div>
      
      {/* Upload & Category Section */}
      <div className="flex flex-col gap-4 mb-8 bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-600">Service Category</label>
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="block w-full p-2 border border-slate-300 rounded-lg bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>-- Select Category --</option>
            {VENDOR_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-4 items-center">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          />
          <button 
            onClick={uploadCard}
            disabled={!file || !category || loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium disabled:bg-slate-400 transition-colors shadow-sm"
          >
            {loading ? 'Scanning...' : 'Scan New Card'}
          </button>
        </div>
      </div>

      {cardData && (
        <div className="space-y-6">
          <div className="border rounded-xl shadow-sm bg-white overflow-hidden">
            <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
              <h3 className="font-semibold text-slate-700">Verify Scanned Details</h3>
              <button 
                onClick={saveChanges}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
              >
                Update My Profile
              </button>
            </div>
            <table className="min-w-full divide-y divide-slate-200">
              <tbody className="bg-white divide-y divide-slate-200">
                {Object.entries(cardData).map(([key, value]) => (
                  <tr key={key} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-700 capitalize w-1/3">
                      {key.replace('_', ' ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      <input 
                        type="text"
                        value={Array.isArray(value) ? value.join(', ') : (value || '')}
                        onChange={(e) => handleFieldChange(key as keyof ICardData, e.target.value)}
                        className="w-full p-1.5 border border-transparent hover:border-slate-200 focus:border-blue-500 focus:bg-white rounded outline-none transition-all"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-600">Notes / Bio</label>
            <textarea 
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional details about your services..."
              className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm shadow-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CardScanner;