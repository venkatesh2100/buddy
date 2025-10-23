"use client";

import { useEffect, useState } from "react";
import { FaEye, FaTrash } from "react-icons/fa";
import Link from "next/link";

type Organization = {
  id: number;
  name: string;
  slug: string; // unique slug for URL
  pendingRequests: number;
  status: "Active" | "Blocked" | "Inactive";
  avatarUrl: string;
};

export default function B2BPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrganizations() {
      try {
        const res = await fetch("/api/organizations");
        const data = await res.json();
        console.log(data.data);
        setOrganizations(data.data);
      } catch (error) {
        console.error("Error fetching organizations:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrganizations();
  }, []);

  if (loading) return <div>Loading...</div>;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Blocked":
        return "bg-red-100 text-red-700";
      case "Inactive":
        return "bg-gray-200 text-gray-600";
      default:
        return "";
    }
  };

  return (
    <div className="m-10 px-5 py-3 border">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold">B2B Organizations</h2>
        <button className="bg-purple-600 text-white px-4 py-2 rounded">
          + Add organization
        </button>
      </div>

      <table className="w-full border-collapse text-sm font-medium text-left">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Sr. No</th>
            <th className="py-2 px-4 border-b">Organization</th>
            <th className="py-2 px-4 border-b">Pending requests</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {organizations.map((org, index) => (
            <tr key={org.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{index + 1}</td>
              <td className="py-2 px-4 border-b flex items-center gap-2">
                <img src={org.avatarUrl} alt={org.name} className="w-6 h-6" />
                <Link href={`/B2B/${org.slug}`} className="text-blue-600 hover:underline">
                  {org.name}
                </Link>
              </td>
              <td className="py-2 px-4 border-b">
                {org.pendingRequests}45 pending requests
              </td>
              <td className={`py-2 px-4 border-b rounded-full w-max ${getStatusColor(org.status)}`}>
                {org.status}
              </td>
              <td className="py-2 px-4 border-b flex gap-4">
                <Link href={`/B2B/${org.slug}`}>
                  <FaEye className="cursor-pointer text-gray-500 hover:text-gray-800" />
                </Link>
                <FaTrash className="cursor-pointer text-gray-500 hover:text-red-600" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
