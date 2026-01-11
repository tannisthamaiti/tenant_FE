"use client";

import React, { useState } from 'react';
import { Search, Database, AlertCircle, Loader2 } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_TENANT_API;


interface QueryResponse {
  answer: Array<Record<string, any>>;
  sql_used: string;
}

const LeadQueryInterface: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<QueryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/ask-leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_prompt: prompt }),
      });

      if (!response.ok) throw new Error('Failed to fetch data from the server.');

      const data: QueryResponse = await response.json();
      console.log("FULL API RESPONSE:", data);
      console.log("FIRST ROW:", data.answer?.[0]);
      console.log("FIRST ROW FIELDS:", Object.entries(data.answer?.[0] || {}));
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">Lead Intelligence Search</h1>
        <p className="text-slate-500">Query your vendor Parquet data using natural language.</p>
      </header>

      {/* Search Input */}
      <form onSubmit={handleSearch} className="relative group">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Show me locksmiths in New York with a rating over 4.5"
          className="w-full p-4 pr-12 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
        <button
          type="submit"
          disabled={loading}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 transition-colors"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Results Section */}
      {result && (
        <div className="space-y-4 animate-in fade-in duration-500">
          {/* SQL Preview */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 bg-slate-50 p-3 rounded-md border border-slate-200">
            <Database className="w-3.5 h-3.5" />
            <span className="font-semibold uppercase">Generated SQL:</span>
            <code className="text-blue-700">{result.sql_used}</code>
          </div>

          {/* Dynamic Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-medium">
                <tr>
                  {result.answer.length > 0 && Object.keys(result.answer[0]).map((key) => (
                    <th key={key} className="px-4 py-3 capitalize">{key.replace('_', ' ')}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {result.answer.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    {Object.values(row).map((val, j) => (
                      <td key={j} className="px-4 py-3 text-slate-600 whitespace-nowrap">
                        {val?.toString() ?? '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {result.answer.length === 0 && (
              <div className="p-8 text-center text-slate-400">No leads found matching your criteria.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadQueryInterface;