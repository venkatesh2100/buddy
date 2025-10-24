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
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  avatarUrl: string;
  mail: string;
  contact: string;
  primaryAdmin?: string | null;
  website?: string | undefined;
  supportEmail?: string | null;
  alterNativePhoneNumber?: string | null;
  languagePreference?: string | null;
  timeCommonName?: string | null;
  region?: string | null;
  maxActiveCoordinators?: number;
}

export default function OrganizationPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [data, setData] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"basic" | "users">("basic");

  useEffect(() => {
    if (!slug) return;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/organization/${slug}`);

        if (!res.ok) {
          throw new Error(`Failed to fetch organization: ${res.status}`);
        }

        const result = await res.json();

        if (result.data) {
          const org = {
            id: result.data.id,
            name: result.data.name,
            slug: result.data.slug,
            mail: result.data.mail,
            contact: result.data.contact,
            status: result.data.status,
            avatarUrl: result.data.avatarUrl ?? null,
            website: result.data.basicDetails?.websiteUrl ?? null,
            primaryAdmin: result.data.basicDetails?.primaryAdminName ?? null,
            supportEmail: result.data.basicDetails?.supportEmail ?? null,
            alterNativePhoneNumber: result.data.basicDetails?.alternativePhoneNumber ?? null,
            languagePreference: result.data.basicDetails?.languagePreference ?? null,
            timeCommonName: result.data.basicDetails?.timeCommonName ?? null,
            region: result.data.basicDetails?.region ?? null,
            maxActiveCoordinators: result.data.basicDetails?.maxActiveCoordinators ?? 0,
          };

          setData(org);
        } else {
          setError("Organization data not found");
        }
      } catch (error) {
        console.error("Error fetching organization:", error);
        setError(error instanceof Error ? error.message : "Failed to load organization");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug]);

  if (loading) return <div className="mx-10 p-4">Loading organization...</div>;
  if (error) return <div className="mx-10 p-4 text-red-500">Error: {error}</div>;
  if (!data) return <div className="mx-10 p-4">Organization not found.</div>;

  return (
    <div className="mx-10">
      <OrganizationCard org={data} />
      <OrgBar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="px-4">
        {activeTab === "basic" && <BasicDetails org={data} />}
        {activeTab === "users" && data?.slug && <OrganizationUsers org={data.slug} />}
      </div>
    </div>
  );
}