"use client";

import React, { useState, useEffect } from "react";
import { AlertCircle, Clock, CheckCircle2, Inbox, UserPlus, List, Activity } from "lucide-react";
import StatCard from "./landlord/StatCard";

export default function LiveRequestFeed() {
  const [requests, setRequests] = useState<any[]>([]);
  const [inProgressTickets, setInProgressTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [view, setView] = useState<"new" | "progress">("new");

  useEffect(() => {
    const eventSource = new EventSource("http://5.161.48.45:8003/stream-requests");

    eventSource.onmessage = (event) => {
      const newRequest = JSON.parse(event.data);
      setRequests((prev) => [{ ...newRequest, status: "new", id: Date.now(), timestamp: new Date().toLocaleTimeString() }, ...prev]);
    };

    return () => eventSource.close();
  }, []);

  const handleAssignVendor = (vendorName: string) => {
    if (!selectedTicket) return;

    const updatedTicket = {
      ...selectedTicket,
      status: "in-progress",
      vendor: vendorName,
      assignedAt: new Date().toLocaleString(),
    };

    // Move from New to In-Progress
    setRequests((prev) => prev.filter((req) => req.id !== selectedTicket.id));
    setInProgressTickets((prev) => [updatedTicket, ...prev]);
    setSelectedTicket(null);
  };

  const urgentCount = requests.filter(r => r.emergency_type === "high").length;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Maintenance Dashboard</h1>
          <p className="text-slate-500">Manage tenant requests and vendor dispatching</p>
        </div>
        
        {/* VIEW TOGGLE SWITCH */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button 
            onClick={() => setView("new")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'new' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Activity size={16} /> Live Feed
          </button>
          <button 
            onClick={() => setView("progress")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'progress' ? 'bg-white shadow-sm text-amber-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Clock size={16} /> In Progress
          </button>
        </div>
      </header>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard title="New" value={requests.length} icon={<Inbox className="text-blue-600" />} color="blue" />
        <StatCard title="Urgent" value={urgentCount} icon={<AlertCircle className="text-red-600" />} color="red" />
        <StatCard title="In Progress" value={inProgressTickets.length} icon={<Clock className="text-amber-600" />} color="amber" />
      </div>

      {view === "new" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FEED LIST */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 font-bold text-slate-800">Incoming Requests</div>
            <div className="divide-y divide-slate-100">
              {requests.map((req) => (
                <div key={req.id} className="p-6 hover:bg-slate-50 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700 mr-2">{req.emergency_type}</span>
                    <span className="text-xs text-slate-400">Unit {req.unit_id} • {req.timestamp}</span>
                    <h4 className="font-bold text-slate-800 mt-1">{req.issue_category}</h4>
                    <p className="text-sm text-slate-500">{req.description}</p>
                  </div>
                  <button onClick={() => setSelectedTicket(req)} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold">Open Case</button>
                </div>
              ))}
            </div>
          </div>

          {/* ASSIGNMENT PANEL */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 h-fit sticky top-8">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><UserPlus size={18}/> Assign Vendor</h3>
            {selectedTicket ? (
              <div className="space-y-4">
                <div className="p-3 bg-slate-50 rounded-lg text-sm border-l-4 border-blue-500">
                  <p className="font-bold">{selectedTicket.issue_category}</p>
                  <p className="text-slate-500">Unit {selectedTicket.unit_id}</p>
                </div>
                <select id="vendorSelect" className="w-full p-2.5 rounded-lg border border-slate-200 text-sm">
                  <option value="Pro Plumbing Co.">Pro Plumbing Co.</option>
                  <option value="Electri-Fix">Electri-Fix</option>
                  <option value="Green Garden Landscaping">Green Garden Landscaping</option>
                </select>
                <button 
                  onClick={() => handleAssignVendor((document.getElementById('vendorSelect') as HTMLSelectElement).value)}
                  className="w-full py-2.5 bg-emerald-600 text-white rounded-lg font-bold"
                >
                  Confirm & Move
                </button>
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center py-8">Select a request to assign</p>
            )}
          </div>
        </div>
      ) : (
        /* IN PROGRESS TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          <div className="p-6 border-b border-slate-100 font-bold text-slate-800">Active Work Orders</div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-bold">Category</th>
                <th className="px-6 py-4 font-bold">Unit</th>
                <th className="px-6 py-4 font-bold">Assigned Vendor</th>
                <th className="px-6 py-4 font-bold">Started At</th>
                <th className="px-6 py-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {inProgressTickets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-slate-400">No work orders currently in progress.</td>
                </tr>
              ) : (
                inProgressTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{ticket.issue_category}</div>
                      <div className="text-[10px] text-slate-400">{ticket.emergency_type} priority</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">Unit {ticket.unit_id}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium border border-amber-100">
                        {ticket.vendor}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{ticket.assignedAt}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-emerald-600 font-bold hover:underline">Complete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}