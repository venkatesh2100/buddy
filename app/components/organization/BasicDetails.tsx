"use client";
import { useState } from "react";

type Organization = {
  id: number;
  name: string;
  slug: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  avatarUrl: string;
  mail: string;
  contact: string;
  primaryAdmin?: string | null;
  website?: string | null;
  supportEmail?: string | null;
  alterNativePhoneNumber?: string | null;
  languagePreference?: string | null;
  timeCommonName?: string | null;
  region?: string | null;
  maxActiveCoordinators?: number;
};

interface OrganizationProps {
  org: Organization;
}

export default function BasicDetails({ org }: OrganizationProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(org);
  const [isSaving, setIsSaving] = useState(false);
  // console.log("Organization data:", org);
  const handleChange = (field: keyof Organization, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/organization/${org.slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update organization");

      window.location.reload();
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full my-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-lg font-semibold text-gray-800">Profile</h2>
        <button
          className="p-2 rounded-md transition flex items-center gap-2"
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-8 h-8 ${
              isEditing
                ? "text-green-600 bg-green-100"
                : "text-purple-500 bg-purple-200"
            } rounded-md p-2`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={
                isEditing
                  ? "M5 13l4 4L19 7"
                  : "M16.862 3.487a2.25 2.25 0 113.182 3.182L7.5 19.313l-4.5 1.5 1.5-4.5 12.362-12.826z"
              }
            />
          </svg>
          {isEditing && (
            <span className="text-sm text-green-600">
              {isSaving ? "..." : ""}
            </span>
          )}
        </button>
      </div>

      {/* Organization details */}
      <Section title="Organization details">
        <TwoColumnGrid>
          <Field
            label="Organization name"
            value={formData.name}
            onChange={(v) => handleChange("name", v)}
            editable={isEditing}
          />
          <Field
            label="Organization SLUG"
            value={formData.slug}
            onChange={(v) => handleChange("slug", v)}
          />
        </TwoColumnGrid>
      </Section>

      {/* Contact details */}
      <Section title="Contact details">
        <TwoColumnGrid>
          <Field
            label="Primary Admin name"
            value={formData.primaryAdmin || ""}
            onChange={(v) => handleChange("primaryAdmin", v)}
            editable={isEditing}
          />
          <Field
            label="Primary Admin Mail-id"
            value={formData.mail}
            onChange={(v) => handleChange("mail", v)}
            editable={isEditing}
          />
          <Field
            label="Support Email ID"
            value={formData.supportEmail || ""}
            onChange={(v) => handleChange("supportEmail", v)}
            editable={isEditing}
          />
          <PhoneGroup
            label1="Phone no"
            value1={formData.contact}
            onChange1={(v) => handleChange("contact", v)}
            label2="Alternative phone no"
            value2={formData.alterNativePhoneNumber || ""}
            onChange2={(v) => handleChange("alterNativePhoneNumber", v)}
            editable={isEditing}
          />
        </TwoColumnGrid>
      </Section>

      {/* Maximum Allowed Coordinators */}
      <Section title="Maximum Allowed Coordinators">
        <Dropdown
          label="Max active Coordinators allowed"
          value={`Upto ${formData.maxActiveCoordinators || 5} Coordinators`}
          options={[
            "Upto 2 Coordinators",
            "Upto 3 Coordinators",
            "Upto 4 Coordinators",
            "Upto 5 Coordinators",
          ]}
          onChange={(v) => {
            setFormData((prev) => ({
              ...prev,
              maxActiveCoordinators: parseInt(v.match(/\d+/)?.[0] || "5", 10),
            }));
          }}
          editable={isEditing}
        />
      </Section>

      {/* Timezone */}
      <Section title="Timezone">
        <TwoColumnGrid>
          <Dropdown
            label="Common name"
            value={formData.timeCommonName || "India Standard Time"}
            options={[
              "India Standard Time",
              "Eastern Standard Time (EST)",
              "Pacific Standard Time (PST)",
              "Central European Time (CET)",
            ]}
            onChange={(v) => handleChange("timeCommonName", v)}
            editable={isEditing}
          />
          <Dropdown
            label="Region"
            value={formData.region || "Asia/Kolkata"}
            options={[
              "Asia/Kolkata",
              "America/New_York",
              "Europe/Berlin",
              "Asia/Tokyo",
              "Asia/Colombo",
            ]}
            onChange={(v) => handleChange("region", v)}
            editable={isEditing}
          />
        </TwoColumnGrid>
      </Section>

      {/* Language */}
      <Section title="Language">
        <Dropdown
          label="Choose the language for organization"
          value={formData.languagePreference || "English"}
          options={["English", "Spanish", "German", "Hindi", "French"]}
          onChange={(v) => handleChange("languagePreference", v)}
          editable={isEditing}
        />
      </Section>

      {/* Website */}
      <Section title="Official website URL">
        <Field
          label="Website URL"
          value={formData.website || ""}
          onChange={(v) => handleChange("website", v)}
          editable={isEditing}
        />
      </Section>
    </div>
  );
}

// Reusable components

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <h3 className="text-gray-700 font-medium mb-4">{title}</h3>
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  editable,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  editable?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-500">{label}</label>
      <input
        type="text"
        value={value}
        disabled={!editable}
        onChange={(e) => onChange && onChange(e.target.value)}
        className={`border rounded-md px-3 py-2 text-gray-700 text-sm focus:outline-none ${
          editable
            ? "bg-white border-gray-300"
            : "bg-gray-50 border-gray-200 cursor-not-allowed"
        }`}
      />
    </div>
  );
}

function Dropdown({
  label,
  value,
  options,
  editable,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  editable?: boolean;
  onChange?: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1 relative">
      <label className="text-sm text-gray-500">{label}</label>
      <div className="relative">
        <select
          disabled={!editable}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          className={`border rounded-md px-3 py-2 text-gray-700 text-sm w-full focus:outline-none appearance-none ${
            editable
              ? "bg-white border-gray-300"
              : "bg-gray-50 border-gray-200 cursor-not-allowed"
          }`}
        >
          {options.map((opt, idx) => (
            <option key={idx} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <img
          src="/down.svg"
          alt="dropdown"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-70 pointer-events-none"
        />
      </div>
    </div>
  );
}

function PhoneGroup({
  label1,
  value1,
  onChange1,
  label2,
  value2,
  onChange2,
  editable,
}: {
  label1: string;
  value1: string;
  onChange1?: (v: string) => void;
  label2: string;
  value2: string;
  onChange2?: (v: string) => void;
  editable?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 col-span-2">
      {[
        { label: label1, value: value1, onChange: onChange1 },
        { label: label2, value: value2, onChange: onChange2 },
      ].map((f, idx) => (
        <div key={idx} className="flex flex-col gap-1">
          <label className="text-sm text-gray-500">{f.label}</label>
          <div className="flex gap-2">
            <input
              type="text"
              value="+91"
              disabled
              className="w-16 bg-gray-50 border border-gray-200 rounded-md px-2 py-2 text-gray-700 text-sm focus:outline-none"
            />
            <input
              type="text"
              value={f.value}
              disabled={!editable}
              onChange={(e) => f.onChange && f.onChange(e.target.value)}
              className={`flex-1 border rounded-md px-3 py-2 text-gray-700 text-sm focus:outline-none ${
                editable
                  ? "bg-white border-gray-300"
                  : "bg-gray-50 border-gray-200 cursor-not-allowed"
              }`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function TwoColumnGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-6">{children}</div>;
}
