"use client";
import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

// Define the interface based on your FastAPI schema
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
  // 1. Hardcoded Values
  const TENANT_ID = "d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44";
  const UNIT_ID = 1;
  const STATUS = "PENDING";
  const FAKE_PHOTO_URL = "https://example.com/placeholder-image.jpg";

  // 2. State for User Inputs
  const [issueCategory, setIssueCategory] = useState<string>('');
  const [emergencyType, setEmergencyType] = useState<string>('medium');
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload: MaintenanceRequest = {
      tenant_id: TENANT_ID,
      unit_id: UNIT_ID,
      status: STATUS,
      issue_category: issueCategory,
      emergency_type: emergencyType,
      description: description,
      photo_url: FAKE_PHOTO_URL, // Using the fake value for now
    };

    try {
      const response = await axios.post(
        'http://5.161.48.45:8003/api/vendor/create-request', 
        payload
      );
      alert('Request created successfully!');
      console.log('Response:', response.data);
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
      
      <form onSubmit={handleSubmit}>
        {/* Issue Category Dropdown */}
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

        {/* Emergency Type Dropdown */}
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

        {/* Description Textarea */}
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

        {/* File Upload (UI Only for now) */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Upload Photo</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => console.log('File selected:', e.target.files?.[0])}
            style={{ marginTop: '0.5rem' }}
          />
          <p style={{ fontSize: '0.8rem', color: '#666' }}>Note: Photo will be sent as a fake URL string for testing.</p>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '0.75rem', 
            backgroundColor: '#00cc88', 
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