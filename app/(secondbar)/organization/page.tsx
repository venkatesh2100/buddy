"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import DeleteButtonOrg from "@/app/components/organization/delete";

type Organization = {
  id: number;
  name: string;
  slug: string;
  pendingRequests: number;
  status: "Active" | "Blocked" | "Inactive";
  avatarUrl: string;
};

export default function B2BOrganizations() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    mail: "",
    contact: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleClick = async () => {
    // console.log("Form Data Submitted: ", formData);
    const newOrg = await fetch("/api/organization", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await newOrg.json();
    // console.log("Response from server: ", data);
    setShowModal(false);
    // Refresh organization list
    window.location.reload();
  };
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    async function fetchOrganizations() {
      try {
        const res = await fetch("/api/organization");
        const data = await res.json();
        setOrganizations(data.data);
      } catch (error) {
        console.error("Error fetching organizations:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrganizations();
  }, []);

  if (loading) return <div className="m-10 text-gray-500">Loading...</div>;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700";
      case "Blocked":
        return "bg-red-100 text-red-700";
      case "Inactive":
        return "bg-gray-200 text-gray-600";
      default:
        return "";
    }
  };

  const getDotColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-500";
      case "Blocked":
        return "bg-red-500";
      case "Inactive":
        return "bg-gray-400";
      default:
        return "bg-transparent";
    }
  };

  return (
    <div className="m-10 px-5 py-3 border border-gray-100 rounded-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-gray-800">B2B organizations</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#6834FF] flex items-center text-white px-4 py-2 rounded-md hover:bg-[#592ce3] transition"
        >
          <Image
            src={"/plus.svg"}
            alt="plus"
            width={16}
            height={16}
            className="mr-2"
          />
          Add organization
        </button>
      </div>

      {/* Table */}
      <table className="w-full border-collapse text-sm font-medium text-left text-gray-800">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-2 px-4 border-b-gray-50">Sr. No</th>
            <th className="py-2 px-4 border-b-gray-50">Organizations</th>
            <th className="py-2 px-4 border-b-gray-50">Pending requests</th>
            <th className="py-2 px-4 border-b-gray-50">Status</th>
            <th className="py-2 px-4 border-b-gray-50">Action</th>
          </tr>
        </thead>

        <tbody>
          {organizations.map((org, index) => (
            <tr key={org.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b-gray-50">{index + 1}</td>

              {/* Organization name + logo */}
              <td className="py-2 px-4 border-b-gray-50 flex items-center gap-2">
                <img
                  src={org.avatarUrl || "/Avatar.svg"}
                  alt=""
                  className="w-6 h-6 rounded"
                />
                <Link
                  href={`/organization/${org.slug}`}
                  className="text-gray-900 hover:underline"
                >
                  {org.name}
                </Link>
              </td>

              {/* Pending requests */}
              <td className="py-2 px-4 border-b-gray-50 text-gray-700">
                {org.pendingRequests || Math.floor(Math.random() * 100  )} pending requests
              </td>

              {/* Status */}
              <td className="py-2 px-4 border-b-gray-50">
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    org.status
                  )}`}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${getDotColor(
                      org.status
                    )}`}
                  ></span>
                  {org.status}
                </span>
              </td>

              {/* Action icons */}
              <td className="py-2 px-4 border-b-gray-50 flex items-center gap-4">
                <Link href={`/organization/${org.slug}`}>
                  <Image
                    src={"/view.svg"} //
                    alt="View"
                    width={16}
                    height={16}
                    className="cursor-pointer opacity-70 hover:opacity-100"
                  />
                </Link>
                {/* <Image
                  src={"/delete.svg"}
                  alt="Delete"
                  width={16}
                  height={16}
                  className="cursor-pointer opacity-70 hover:opacity-100"
                /> */}
                <DeleteButtonOrg Organization={org} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 bg-black/30 z-40 flex justify-end">
          <div className="bg-white w-[700px] flex flex-col justify-between  h-full shadow-lg z-50 animate-slideIn relative">
            <div>
              <div className="flex justify-between items-center px-6 py-4 border-b">
                <h3 className="font-semibold text-gray-800 text-lg">
                  Add Organization
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Form */}
              <form className="p-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="block text-gray-600 mb-1">
                    Name of the organization
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Type here"
                    onChange = {handleChange}
                    className="w-full border  border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6834FF]/40"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 mb-1">Slug</label>
                  <input
                    type="text"
                    name = "slug"
                    placeholder="Type here"
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6834FF]/40"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 mb-1">
                    Organization mail
                  </label>
                  <input
                    type="email"
                    name="mail"
                    placeholder="Type here"
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6834FF]/40"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 mb-1">Contact</label>
                  <input
                    type="text"
                    name = "contact"
                    placeholder="Type here"
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6834FF]/40"
                  />
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
              <button  onClick={()=>handleClick()} className="px-5 py-2 text-sm text-white bg-[#6834FF] rounded-md hover:bg-[#592ce3]">
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slide-in Animation */}
      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
