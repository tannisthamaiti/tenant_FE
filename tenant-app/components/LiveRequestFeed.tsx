"use client";

import React, { useState, useEffect } from "react";
import { AlertCircle, Clock, CheckCircle2, Inbox } from "lucide-react";
import StatCard from "./landlord/StatCard";

export default function LiveRequestFeed() {
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    // Connect to your FastAPI SSE endpoint
    const eventSource = new EventSource("http://5.161.48.45:8003/stream-requests");

    eventSource.onmessage = (event) => {
      const newRequest = JSON.parse(event.data);
      // Newest requests at the top
      setRequests((prev) => [newRequest, ...prev]);
    };

    return () => eventSource.close();
  }, []);

  const urgentCount = requests.filter(r => r.emergency_type === "high").length;

  return (
    <div className="p-8">
      <header className="mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900">Main Dashboard</h1>
        <p className="text-slate-500">Real-time tenant activity monitor</p>
      </header>

      {/* THE CARDS - They update automatically when requests.length changes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard 
          title="Total Requests" 
          value={requests.length} 
          icon={<Inbox className="text-blue-600" />} 
          color="blue"
        />
        <StatCard 
          title="Urgent Alerts" 
          value={urgentCount} 
          icon={<AlertCircle className="text-red-600" />} 
          color="red"
        />
        <StatCard 
          title="Resolved" 
          value={0} 
          icon={<CheckCircle2 className="text-emerald-600" />} 
          color="emerald"
        />
      </div>

      {/* THE LIVE LIST */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-white">
          <h3 className="font-bold text-slate-800">New Submissions</h3>
        </div>
        
        <div className="divide-y divide-slate-100">
          {requests.length === 0 ? (
            <div className="py-20 text-center">
              <Clock className="mx-auto text-slate-300 mb-3" size={40} />
              <p className="text-slate-400 font-medium">Waiting for new requests...</p>
            </div>
          ) : (
            requests.map((req, idx) => (
              <div key={idx} className="p-6 hover:bg-slate-50 transition-all flex justify-between items-center animate-in fade-in slide-in-from-top-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                      req.emergency_type === 'high' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {req.emergency_type}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Unit {req.unit_id}</span>
                  </div>
                  <h4 className="font-bold text-slate-800">{req.issue_category}</h4>
                  <p className="text-sm text-slate-500">{req.description}</p>
                </div>
                <button className="px-5 py-2 rounded-lg bg-slate-900 text-white text-sm font-bold hover:bg-slate-800">
                  Open Case
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}