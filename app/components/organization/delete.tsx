import Image from "next/image";
import { useState } from "react";

type Organization = {
  id: number;
  name: string;
  slug: string;
  pendingRequests: number;
  status: "Active" | "Blocked" | "Inactive";
  avatarUrl: string;
};
interface OrganizationRowProps {
  Organization: Organization;
  refreshOrgs?: () => void;
}

export default function DeleteButtonOrg({ Organization ,refreshOrgs}: OrganizationRowProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    // console.log('Deleting organization:', Organization);
    if (!confirm(`Delete organization "${Organization.name}"?`)) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/organization/delete/${Organization.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete organization");

      alert("Organization deleted successfully!");
      refreshOrgs?.();
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Error deleting organization");
    } finally {
      setLoading(false);
    }
  };

  return (

      <Image
        src="/delete.svg"
        alt="Delete"
        width={16}
        height={16}
        className={`cursor-pointer opacity-70 hover:opacity-100 ${
          loading ? "animate-pulse" : ""
        }`}
        onClick={handleDelete}
      />
  );
}
