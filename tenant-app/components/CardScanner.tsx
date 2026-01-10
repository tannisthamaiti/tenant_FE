"use client";
import React, { useState } from 'react';
import { ICardData, IApiResponse } from '../types/businessCard';

const API_BASE_URL = process.env.NEXT_PUBLIC_TENANT_API;

// Define the categories as a constant for easy maintenance
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
  const [category, setCategory] = useState<string>(""); // New state for dropdown
  const [loading, setLoading] = useState<boolean>(false);
  const [cardData, setCardData] = useState<ICardData | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const uploadCard = async () => {
    if (!file || !category) {
      alert("Please select a file and a category.");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category); // Sending the selected category to the backend

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

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Business Card AI Scanner</h2>
      
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Vendor Category</label>
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-blue-500 focus:border-blue-500"
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
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <button 
            onClick={uploadCard}
            disabled={!file || !category || loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg disabled:bg-gray-400 whitespace-nowrap"
          >
            {loading ? 'Processing...' : 'Scan Card'}
          </button>
        </div>
      </div>

      {cardData && (
        <div className="overflow-x-auto border rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(cardData).map(([key, value]) => (
                <tr key={key}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                    {key.replace('_', ' ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {Array.isArray(value) ? value.join(', ') : (value || 'N/A')}
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