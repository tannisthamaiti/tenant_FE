'use client'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState('tenant') 
  const [loading, setLoading] = useState(false)

  // Initialize Supabase Client
  const supabase = createClient()
  console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL) // Check if this is defined

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          full_name: fullName, // 👈 Maps to new.raw_user_meta_data->>'full_name'
          role: role,
          phone: phone          // 👈 Maps to new.raw_user_meta_data->>'role'
        },
      },
    })

    if (error) {
      alert(`Error: ${error.message}`)
    } else {
      alert('Success! Please check your email for the confirmation link.')
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <form onSubmit={handleSignup} className="p-8 bg-white shadow-md rounded-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Account</h1>
        
        <div className="space-y-4">
          <input 
            type="text" placeholder="Full Name" required
            className="w-full p-2 border rounded border-gray-300 focus:outline-blue-500"
            onChange={(e) => setFullName(e.target.value)}
          />
          
          <input 
            type="email" placeholder="Email" required
            className="w-full p-2 border rounded border-gray-300 focus:outline-blue-500"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input 
            type="tel" placeholder="Phone (e.g. +1234567890)" required
            className="w-full p-2 border rounded border-gray-300 focus:outline-blue-500"
            onChange={(e) => setPhone(e.target.value)}
          />

          <input 
            type="password" placeholder="Password" required
            className="w-full p-2 border rounded border-gray-300 focus:outline-blue-500"
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">Account Type:</label>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2 border rounded border-gray-300 bg-white"
            >
              <option value="tenant">Tenant</option>
              <option value="landlord">Landlord</option>
              <option value="vendor">Vendor</option>
              <option value="agent">Agent</option>
            </select>
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-blue-600 text-white p-2 rounded font-semibold hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? 'Processing...' : 'Sign Up'}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">Log in</Link>
        </p>
      </form>
    </div>
  )
}