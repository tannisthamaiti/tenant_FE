"use client";
import React, { useState } from 'react';
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
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [cardData, setCardData] = useState<ICardData | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  // Handle editing individual fields
  const handleFieldChange = (key: keyof ICardData, value: string) => {
    if (!cardData) return;
    setCardData({
      ...cardData,
      [key]: value
    });
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

  const saveChanges = () => {
    console.log("Saving updated data to database:", cardData);
    // You can call your FastAPI 'update' or 'save-vendor' endpoint here
    alert("Vendor data ready to be saved!");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-slate-800">Business Card AI Scanner</h2>
      
      {/* Upload Section */}
      <div className="flex flex-col gap-4 mb-8 bg-slate-50 p-6 rounded-xl border border-slate-200">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-600">Vendor Category</label>
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="block w-full p-2 border border-slate-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
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
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium disabled:bg-slate-400 transition-colors"
          >
            {loading ? 'Processing...' : 'Scan Card'}
          </button>
        </div>
      </div>

      {/* Editable Results Section */}
      {cardData && (
        <div className="border rounded-xl shadow-sm bg-white overflow-hidden">
          <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
            <h3 className="font-semibold text-slate-700">Verify & Edit Scanned Data</h3>
            <button 
              onClick={saveChanges}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
            >
              Save Vendor
            </button>
          </div>
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Field</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Value (Editable)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {Object.entries(cardData).map(([key, value]) => (
                <tr key={key} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-700 capitalize">
                    {key.replace('_', ' ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    <input 
                      type="text"
                      value={Array.isArray(value) ? value.join(', ') : (value || '')}
                      onChange={(e) => handleFieldChange(key as keyof ICardData, e.target.value)}
                      className="w-full p-1.5 border border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-white rounded outline-none transition-all bg-transparent"
                      placeholder={`Enter ${key.replace('_', ' ')}...`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CardScanner;