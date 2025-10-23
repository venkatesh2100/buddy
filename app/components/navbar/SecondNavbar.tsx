'use client';
import { useRouter } from 'next/navigation';

interface SecondNavbarProps {
  activeTab: string;
}

export default function SecondNavbar({ activeTab }: SecondNavbarProps) {
  const router = useRouter();

  const handleTabClick = (tab: string) => {
    if (tab === "dashboard") {
      router.push("/dashboard");
    } else if (tab === "manage") {
      router.push("/organization");
    }
  };

  return (
    <div className="flex px-20 text-sm text-gray-500 border-y border-gray-300 shadow-md">
      <button
        onClick={() => handleTabClick("dashboard")}
        className={`relative pr-10 transition-colors duration-200 py-2 ${
          activeTab === "dashboard"
            ? "text-blue-500 font-medium"
            : "hover:text-blue-300"
        }`}
      >
        Dashboard
      </button>
      <button
        onClick={() => handleTabClick("manage")}
        className={`relative transition-colors duration-200 py-2 ${
          activeTab === "manage"
            ? "text-blue-500 font-medium"
            : "hover:text-blue-300"
        }`}
      >
        Manage B2B Organizations
      </button>
    </div>
  );
}