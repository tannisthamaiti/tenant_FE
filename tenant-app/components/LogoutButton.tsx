'use client'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh() // Clears the server-side cache
    router.push('/login')
  }

  return (
    <button 
      onClick={handleLogout}
      className="w-full bg-red-600/20 text-red-400 border border-red-600/50 p-2 rounded hover:bg-red-600 hover:text-white transition-all"
    >
      Sign Out
    </button>
  )
}