import { useState } from 'react'
import { Search, UserCheck, UserX } from 'lucide-react'

const mockUsers = [
  { id: 1, name: 'Alex Rivera', email: 'alex@email.com', orders: 8, total: '$1,240', joined: 'Jan 5, 2026', active: true },
  { id: 2, name: 'Jamie Chen', email: 'jamie@email.com', orders: 5, total: '$890', joined: 'Jan 12, 2026', active: true },
  { id: 3, name: 'Sam Wilson', email: 'sam@email.com', orders: 3, total: '$450', joined: 'Feb 2, 2026', active: true },
  { id: 4, name: 'Morgan Lee', email: 'morgan@email.com', orders: 12, total: '$2,100', joined: 'Dec 20, 2025', active: true },
  { id: 5, name: 'Taylor Kim', email: 'taylor@email.com', orders: 2, total: '$250', joined: 'Feb 28, 2026', active: false },
  { id: 6, name: 'Jordan Park', email: 'jordan@email.com', orders: 7, total: '$1,050', joined: 'Jan 30, 2026', active: true },
  { id: 7, name: 'Casey Brown', email: 'casey@email.com', orders: 1, total: '$95', joined: 'Mar 1, 2026', active: true },
  { id: 8, name: 'Riley Scott', email: 'riley@email.com', orders: 4, total: '$620', joined: 'Feb 14, 2026', active: false },
]

export default function DashboardUsers() {
  const [users, setUsers] = useState(mockUsers)
  const [search, setSearch] = useState('')

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  )

  const toggleActive = (id) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, active: !u.active } : u)))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white font-black text-2xl mb-1">Users</h1>
          <p className="text-white/30 text-sm">{users.length} registered customers</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-[#111] border border-white/5 p-4">
          <p className="text-white/30 text-xs uppercase tracking-wide mb-2">Total Users</p>
          <p className="text-white font-black text-2xl">{users.length}</p>
        </div>
        <div className="bg-[#111] border border-white/5 p-4">
          <p className="text-white/30 text-xs uppercase tracking-wide mb-2">Active</p>
          <p className="text-white font-black text-2xl">{users.filter((u) => u.active).length}</p>
        </div>
        <div className="bg-[#111] border border-white/5 p-4">
          <p className="text-white/30 text-xs uppercase tracking-wide mb-2">Avg. Orders</p>
          <p className="text-white font-black text-2xl">
            {(users.reduce((s, u) => s + u.orders, 0) / users.length).toFixed(1)}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-[#111] border border-white/5 text-white placeholder-white/20 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-white/20 transition-colors w-64"
        />
      </div>

      <div className="bg-[#111] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Name', 'Email', 'Orders', 'Total Spent', 'Joined', 'Status', 'Action'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-white/30 text-xs font-semibold uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 bg-white/5 flex items-center justify-center rounded-sm flex-shrink-0">
                        <span className="text-white/60 text-[10px] font-bold">{user.name[0]}</span>
                      </div>
                      <span className="text-white font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-white/40 text-xs">{user.email}</td>
                  <td className="px-5 py-4 text-white font-semibold">{user.orders}</td>
                  <td className="px-5 py-4 text-white font-semibold">{user.total}</td>
                  <td className="px-5 py-4 text-white/30 text-xs">{user.joined}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                      user.active ? 'text-green-400 bg-green-400/10' : 'text-white/30 bg-white/5'
                    }`}>
                      {user.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => toggleActive(user.id)}
                      className={`text-xs transition-colors ${
                        user.active ? 'text-white/30 hover:text-red-400' : 'text-white/30 hover:text-green-400'
                      }`}
                    >
                      {user.active ? <UserX size={15} /> : <UserCheck size={15} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-white/20 py-10 text-sm">No users found</p>
        )}
      </div>
    </div>
  )
}
