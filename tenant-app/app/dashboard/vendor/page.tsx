import CardScanner from '@/components/CardScanner';
import LeadQueryInterface from '@/components/LeadQueryInterface';

export default function VendorPortalPage() {
  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Vendor Portal</h1>
        <p className="text-slate-500">Manage your work orders and service contacts.</p>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {/* Card Scanner Section */}
        <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800">Contact Intake</h2>
            <p className="text-sm text-slate-500">
              Scan a subcontractor or client business card to automatically extract their details.
            </p>
          </div>
          
          <CardScanner />
          <LeadQueryInterface/>
        </section>

        {/* Other Vendor Features can go here */}
      </div>
    </div>
  );
}