"use client";
import React, { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';
import { createClient } from '@/utils/supabase/client';

interface MaintenanceRequest {
  tenant_id: string;
  unit_id: number;
  issue_category: string;
  description: string;
  emergency_type: string;
  status: string;
  photo_url: string;
}

const MaintenanceRequestForm: React.FC = () => {
  // Initialize Supabase Client
  const supabase = createClient();

  // 1. Dynamic State for IDs
  const [tenantId, setTenantId] = useState<string>('');
  const [unitId, setUnitId] = useState<number>(1); // Ideally fetch this from DB later
  
  const STATUS = "PENDING";
  const FAKE_PHOTO_URL = "https://example.com/placeholder-image.jpg";

  // 2. Form Input State
  const [issueCategory, setIssueCategory] = useState<string>('');
  const [emergencyType, setEmergencyType] = useState<string>('medium');
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const API_BASE_URL = process.env.NEXT_PUBLIC_TENANT_API;

  // 3. Get User UUID on Load
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setTenantId(user.id); // This is your login UUID
      }
    };
    getUser();
  }, [supabase]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!tenantId) {
      alert("Please wait for user data to load or log in again.");
      return;
    }

    setLoading(true);

    const payload: MaintenanceRequest = {
      tenant_id: tenantId, // Using the UUID from Supabase
      unit_id: unitId,
      status: STATUS,
      issue_category: issueCategory,
      emergency_type: emergencyType,
      description: description,
      photo_url: FAKE_PHOTO_URL,
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/vendor/create-request`, 
        payload
      );
      alert('Request created successfully!');
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to create request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>Submit Maintenance Request</h2>
      
      {/* Visual Debug: Shows if the ID was successfully grabbed */}
      <p style={{ fontSize: '0.75rem', color: '#666' }}>
        <strong>Tenant UUID:</strong> {tenantId || "Loading..."}
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Issue Category</label>
          <select 
            value={issueCategory} 
            onChange={(e) => setIssueCategory(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          >
            <option value="">-- Select Category --</option>
            <option value="plumbing">Plumbing</option>
            <option value="electrical">Electrical</option>
            <option value="hvac">HVAC</option>
            <option value="general">General Repair</option>
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Emergency Type</label>
          <select 
            value={emergencyType} 
            onChange={(e) => setEmergencyType(e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Description</label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Describe the issue..."
            style={{ width: '100%', padding: '0.5rem', height: '100px' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading || !tenantId}
          style={{ 
            width: '100%', 
            padding: '0.75rem', 
            backgroundColor: !tenantId ? '#ccc' : '#00cc88', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Submitting...' : 'Create Request'}
        </button>
      </form>
    </div>
  );
};

export default MaintenanceRequestForm;