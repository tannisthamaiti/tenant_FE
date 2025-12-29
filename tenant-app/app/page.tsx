import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
  const supabase = await createClient()

  // Get the auth user
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  // Get the role and full name from your custom table using the UUID
  const { data: dbUser } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Welcome back, {dbUser?.full_name}</h1>
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <p><strong>Your UUID:</strong> {user.id}</p>
        <p><strong>Your Role:</strong> {dbUser?.role}</p>
      </div>

      {/* Conditional rendering based on role */}
      {dbUser?.role === 'landlord' && (
        <div className="mt-6 p-4 bg-blue-100 border border-blue-300 rounded">
          <p>Landlord Controls: Manage your properties here.</p>
        </div>
      )}
    </div>
  )
}