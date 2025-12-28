"use client";

import React, { useState, useEffect } from "react";
import { AlertCircle, Clock, CheckCircle2, Inbox, UserPlus, ArrowRight } from "lucide-react";
import StatCard from "./landlord/StatCard";

export default function LiveRequestFeed() {
  const [requests, setRequests] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [inProgressCount, setInProgressCount] = useState(0);

  useEffect(() => {
    const eventSource = new EventSource("http://5.161.48.45:8003/stream-requests");

    eventSource.onmessage = (event) => {
      const newRequest = JSON.parse(event.data);
      // Initialize status as 'new'
      setRequests((prev) => [{ ...newRequest, status: "new", id: Date.now() }, ...prev]);
    };

    return () => eventSource.close();
  }, []);

  const handleAssignVendor = (ticketId: number) => {
    // 1. Move ticket to "In Progress"
    setRequests((prev) => prev.filter((req) => req.id !== ticketId));
    setInProgressCount((prev) => prev + 1);
    
    // 2. Clear selection
    setSelectedTicket(null);
    
    // Note: In a real app, you'd send a POST request to your FastAPI backend here
    // to update the database status to 'assigned'.
  };

  const urgentCount = requests.filter(r => r.emergency_type === "high").length;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Landlord Command Center</h1>
          <p className="text-slate-500">Real-time triage and vendor dispatch</p>
        </div>
      </header>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard 
          title="New Submissions" 
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
          title="In Progress" 
          value={inProgressCount} 
          icon={<Clock className="text-amber-600" />} 
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: LIVE FEED */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Incoming Requests</h3>
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          
          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {requests.length === 0 ? (
              <div className="py-20 text-center">
                <Clock className="mx-auto text-slate-300 mb-3" size={40} />
                <p className="text-slate-400 font-medium">No pending requests</p>
              </div>
            ) : (
              requests.map((req) => (
                <div 
                  key={req.id} 
                  className={`p-6 transition-all flex justify-between items-center ${
                    selectedTicket?.id === req.id ? "bg-blue-50 border-l-4 border-blue-500" : "hover:bg-slate-50"
                  }`}
                >
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
                    <p className="text-sm text-slate-500 truncate max-w-md">{req.description}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedTicket(req)}
                    className="px-5 py-2 rounded-lg bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 flex items-center gap-2"
                  >
                    Open Case <ArrowRight size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: ACTION PANEL */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <UserPlus size={20} className="text-slate-400" /> 
            Assign Vendor
          </h3>
          
          {selectedTicket ? (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-xs text-slate-400 uppercase font-bold mb-1">Active Case</p>
                <p className="font-bold text-slate-900">{selectedTicket.issue_category}</p>
                <p className="text-sm text-slate-600 mt-2 italic">"{selectedTicket.description}"</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Select Preferred Vendor</label>
                <select className="w-full p-3 rounded-lg border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Select a professional...</option>
                  <option>ABC Plumbing Services</option>
                  <option>Quick-Fix Electrical</option>
                  <option>General HVAC Pro</option>
                </select>
              </div>

              <button 
                onClick={() => handleAssignVendor(selectedTicket.id)}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors"
              >
                Dispatch & Move to Progress
              </button>
              
              <button 
                onClick={() => setSelectedTicket(null)}
                className="w-full py-2 text-slate-400 text-sm font-medium hover:text-slate-600"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-xl">
              <p className="text-slate-400 text-sm">Select a ticket from the feed <br/> to assign a vendor.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}