"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface User {
  id: string;
  name: string;
  role: "ADMIN" | "COORDINATOR" | "MEMBER";
  email?: string;
  phone?: string;
}

interface Props {
  org: string;
}

export default function OrganizationUsers({ org }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: "", role: "ADMIN" as User["role"] });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching users for org:", org);
      const res = await fetch(`/api/organization/${org}/users`);

      if (!res.ok) {
        throw new Error(`Failed to fetch users: ${res.status}`);
      }

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [org]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdateUser = async () => {
    if (!formData.name.trim() || !formData.role) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      if (editUser) {
        // UPDATE
        const res = await fetch(`/api/organization/${org}/users/${editUser.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          throw new Error(`Failed to update user: ${res.status}`);
        }

        const updated = await res.json();
        setUsers(users.map(u => (u.id === updated.id ? updated : u)));
      } else {
        // ADD
        const res = await fetch(`/api/organization/${org}/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          throw new Error(`Failed to create user: ${res.status}`);
        }

        const newUser = await res.json();
        setUsers(prev => [...prev, newUser]);
      }

      setFormData({ name: "", role: "ADMIN" });
      setEditUser(null);
      setShowModal(false);
    } catch (err) {
      console.error("Error saving user:", err);
      alert(err instanceof Error ? err.message : "Failed to save user");
    }
  };

  const handleEdit = (user: User) => {
    setEditUser(user);
    setFormData({ name: user.name, role: user.role });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`/api/organization/${org}/users/${id}`, {
        method: "DELETE"
      });

      if (!res.ok) {
        throw new Error(`Failed to delete user: ${res.status}`);
      }

      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
      alert(err instanceof Error ? err.message : "Failed to delete user");
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-green-100 text-green-700";
      case "COORDINATOR":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) return <div className="m-10 text-gray-500">Loading users...</div>;

  if (error) return <div className="m-10 text-red-500">Error: {error}</div>;

  return (
    <div className="m-10 px-5 py-3 border border-gray-100 rounded-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Users</h2>
        <button
          onClick={() => {
            setShowModal(true);
            setEditUser(null);
            setFormData({ name: "", role: "ADMIN" });
          }}
          className="bg-[#6834FF] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#592ce3]"
        >
          <Image src="/plus.svg" alt="plus" width={16} height={16} />
          Add user
        </button>
      </div>

      {/* Table */}
      {users.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No users found. Add your first user to get started.
        </div>
      ) : (
        <table className="w-full border-collapse text-sm text-left text-gray-800">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-2 px-4">Sr. No</th>
              <th className="py-2 px-4">User name</th>
              <th className="py-2 px-4">Role</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{index + 1}</td>
                <td className="py-2 px-4">{user.name}</td>
                <td className="py-2 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-2 px-4 flex items-center gap-4">
                  <Image
                    src="/edit.svg"
                    alt="Edit"
                    width={16}
                    height={16}
                    className="cursor-pointer opacity-70 hover:opacity-100"
                    onClick={() => handleEdit(user)}
                  />
                  <Image
                    src="/delete.svg"
                    alt="Delete"
                    width={16}
                    height={16}
                    className="cursor-pointer opacity-70 hover:opacity-100"
                    onClick={() => handleDelete(user.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Add/Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 z-40 flex justify-end">
          <div className="bg-white w-[400px] flex flex-col justify-between h-full shadow-lg z-50 animate-slideIn relative">
            <div>
              <div className="flex justify-between items-center px-6 py-4 border-b">
                <h3 className="font-semibold text-gray-800 text-lg">
                  {editUser ? "Edit User" : "Add User"}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <form
                className="p-6 grid grid-cols-1 gap-4 text-sm"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddOrUpdateUser();
                }}
              >
                <div>
                  <label className="block text-gray-600 mb-1">Name of the user *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6834FF]/40"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Choose user role *</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6834FF]/40"
                    required
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="COORDINATOR">Co-ordinator</option>
                    <option value="MEMBER">Member</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="flex justify-end items-center border-t px-6 py-4 gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 text-sm text-gray-600 border border-gray-200 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOrUpdateUser}
                className="px-5 py-2 text-sm text-white bg-[#6834FF] rounded-md hover:bg-[#592ce3]"
              >
                {editUser ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slideIn { animation: slideIn 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
}