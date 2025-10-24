"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import OrganizationCard from "@/app/components/organization/card";
import OrgBar from "@/app/components/organization/orgBar";
import BasicDetails from "@/app/components/organization/BasicDetails";
import OrganizationUsers from "@/app/components/organization/user";
interface Organization {
  id: number;
  name: string;
  slug: string;
  pendingRequests: number;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  avatarUrl: string;
  mail: string;
  contact: string;
  primaryAdmin?: string;
  website?: string;
  supportEmail?: string;
  alterNativePhoneNumber?: string;
}

export default function OrganizationPage() {
  const { slug } = useParams();
  const [data, setData] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"basic" | "users">("basic");

  useEffect(() => {
    if (!slug) return;

    async function fetchData() {
      try {
        const res = await fetch(`/api/organization/${slug}`);

        const result = await res.json();

        if (result.data) {
          const org: Organization = {
            id: result.data.id,
            name: result.data.name,
            slug: result.data.slug,
            mail: result.data.mail,
            contact: result.data.contact,
            status: result.data.status,
            avatarUrl: result.data.avatarUrl ?? null,
            website: result.data.basicDetails?.websiteUrl ?? null,
            pendingRequests: result.data.users?.length ?? 0,
            primaryAdmin: result.data.basicDetails.primaryAdminName ?? "Venky",
            supportEmail: result.data.basicDetails.supportEmail ?? "support@com",
            alterNativePhoneNumber: result.data.basicDetails.alternativePhoneNumber ?? "1234567890",
          };
          setData(org);
        }
      } catch (error) {
        console.error("Error fetching organization:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug]);

  if (loading) return <div>Loading...</div>;

  if (!data) return <div>Organization not found.</div>;

  return (
    <div className="mx-10">
      <OrganizationCard org={data} />
      <OrgBar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className=" px-4 ">
      {activeTab === "basic" && <BasicDetails org={data} />}
      {activeTab === "users" && <OrganizationUsers org={data} />}
      </div>

    </div>
  );
}
