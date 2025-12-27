// tenant/create_request/page.tsx
import MaintenanceRequestForm from '@/components/MaintenanceForm';

export default function CreateRequestPage() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Tenant Portal</h1>
      <p>Submit a new maintenance request below.</p>
      
      {/* This is your form component */}
      <MaintenanceRequestForm />
    </main>
  );
}