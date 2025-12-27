"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateRequestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Hardcoded IDs as requested
  const HARDCODED_LANDLORD_ID = "00000000-0000-0000-0000-000000000000";
  const HARDCODED_TENANT_ID = "11111111-1111-1111-1111-111111111111"; 

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      tenant_id: HARDCODED_TENANT_ID,
      landlord_id: HARDCODED_LANDLORD_ID,
      vendor_id: null, // Optional for now
    };

    try {
      const response = await fetch("/api/requests/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Request created successfully!");
        router.push("/tenant"); // Redirect back to dashboard
      }
    } catch (error) {
      console.error("Error creating request:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Create Maintenance Request</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Issue Title</label>
          <input
            name="title"
            required
            className="w-full p-2 border rounded border-gray-300"
            placeholder="e.g., Leaking kitchen sink"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            rows={4}
            className="w-full p-2 border rounded border-gray-300"
            placeholder="Provide more details about the maintenance needed..."
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
}