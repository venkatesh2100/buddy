"use client";

import Image from "next/image";
import { useState } from "react";

type Organization = {
  id: number;
  name: string;
  slug: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  avatarUrl: string;
  mail: string;
  contact: string;
  website?: string;
};

interface OrganizationProps {
  org: Organization;
}

export default function OrganizationCard({ org }: OrganizationProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700";
      case "INACTIVE":
        return "bg-gray-200 text-gray-600";
      case "SUSPENDED":
        return "bg-red-100 text-red-700";
      default:
        return "";
    }
  };

  const getDotColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-500";
      case "INACTIVE":
        return "bg-gray-400";
      case "SUSPENDED":
        return "bg-red-500";
      default:
        return "bg-transparent";
    }
  };

  // 🔹 Upload to Cloudinary
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "Buddy-avatar");

      const cloudinaryRes = await fetch(
       "https://api.cloudinary.com/v1_1/drxpanhfv/image/upload/",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await cloudinaryRes.json();

      if (data.secure_url) {
        // 🔹 Update in DB
        await fetch(`/api/organization/${org.slug}/image`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ avatarUrl: data.secure_url }),
        });

        alert("Avatar updated successfully!");
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="flex border-bg-gray-50 shadow-md p-6 m-6 justify-between">
      <div className="flex">
        {/* Avatar container with hover */}
        <div
          className="relative w-[128px] h-[128px] cursor-pointer"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={() => setIsModalOpen(true)}
        >
          <img
            src={org.avatarUrl ?? "/Avatar.svg"}
            alt={org.name}
            className="rounded w-full h-full object-cover"
          />
          {isHovering && (
            <div className="absolute inset-0 bg-gray-400 flex items-center justify-center text-white text-sm rounded">
              Edit
            </div>
          )}
        </div>

        <div className="flex flex-col ml-6 pt-4 gap-4">
          <div className="text-xl font-semibold">{org.name}</div>
          <div className="text-sm flex flex-col gap-4 text-gray-600 text-center">
            <div className="flex items-center">
              <Image src={"/mail.svg"} alt="mail" width={18} height={18} className="mr-1" />
              <a>{org.mail}</a>
            </div>
            <div className="flex items-center">
              <Image src={"/phone.svg"} alt="phone" width={20} height={20} className="mr-1" />
              <a>{org.contact}</a>
            </div>
            <div className="flex items-center">
              <Image src={"/world.svg"} alt="website" width={20} height={20} className="mr-1" />
              <a>{org.website}</a>
            </div>
          </div>
        </div>
      </div>

      <div className="p-2">
        <span
          className={`inline-flex mr-1 items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
            org.status
          )}`}
        >
          <span className={`w-2.5 h-2.5 rounded-full ${getDotColor(org.status)}`}></span>
          {org.status}
        </span>
      </div>

      {/* 🔹 Modal for image upload */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-lg font-semibold mb-4">Upload New Avatar</h2>
            <input type="file" className=" border border-gray-100 shadow-md rounded-2xl p-2" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
            {uploading && <p className="mt-2 text-sm text-gray-500">Uploading...</p>}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
