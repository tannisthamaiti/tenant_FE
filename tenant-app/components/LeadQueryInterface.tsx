"use client";

import React, { useState } from 'react';
import { Search, Database, AlertCircle, Loader2 } from 'lucide-react';

/**
 * ENVIRONMENT CONFIG
 * Ensure NEXT_PUBLIC_TENANT_API is defined in your .env.local without a trailing slash
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_TENANT_API || '';

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

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to fetch data from the server.');
      }

      const data: QueryResponse = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Helper to render cell content. 
   * Handles nested objects (like metadata or JSON fields) and nulls gracefully.
   */
  const renderCell = (val: any) => {
    if (val === null || val === undefined) return <span className="text-slate-300">—</span>;

    if (typeof val === "object" && !Array.isArray(val)) {
      return (
        <div className="space-y-1 text-xs bg-slate-50 p-2 rounded border border-slate-100">
          {Object.entries(val).map(([k, v]) => (
            <div key={k} className="break-all">
              <span className="font-semibold text-slate-500">{k}:</span> {v?.toString() || "—"}
            </div>
          ))}
        </div>
      );
    }
    
    return <span className="break-words">{val.toString()}</span>;
  };

  // Pre-calculate headers to ensure column alignment
  const tableHeaders = result?.answer && result.answer.length > 0 
    ? Object.keys(result.answer[0]) 
    : [];

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
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
          
          {/* SQL Preview - Useful for debugging/transparency */}
          <div className="flex flex-col gap-2 bg-slate-900 text-slate-300 p-4 rounded-lg border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-500">
              <Database className="w-3.5 h-3.5" />
              <span>Generated SQL Query</span>
            </div>
            <code className="text-sm text-blue-400 break-all leading-relaxed whitespace-pre-wrap">
              {result.sql_used}
            </code>
          </div>

          {/* Dynamic Table Section */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {result.answer.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                    <tr>
                      {tableHeaders.map((header) => (
                        <th key={header} className="px-4 py-3 capitalize whitespace-nowrap">
                          {header.replace(/_/g, ' ')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {result.answer.map((row, i) => (
                      <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                        {tableHeaders.map((header) => (
                          <td key={`${i}-${header}`} className="px-4 py-3 text-slate-600 align-top">
                            {renderCell(row[header])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="inline-flex p-3 rounded-full bg-slate-50 mb-4">
                  <Search className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="text-slate-900 font-medium">No results found</h3>
                <p className="text-slate-500 text-sm">Try adjusting your search filters or phrasing.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadQueryInterface;