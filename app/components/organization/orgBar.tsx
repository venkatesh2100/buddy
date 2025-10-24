
interface OrgBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function OrgBar({ activeTab, onTabChange }: OrgBarProps) {
  const handleTabClick = (tab: string) => {
    onTabChange(tab);
  };

  return (
    <div className="flex px-20 text-sm text-gray-500 border-y border-gray-300 shadow-md">
      <button
        onClick={() => handleTabClick("basic")}
        className={`relative pr-10 transition-colors duration-200 py-2 ${
          activeTab === "basic"
            ? "text-blue-500 font-medium"
            : "hover:text-blue-300"
        }`}
      >
        Basic Details
      </button>
      <button
        onClick={() => handleTabClick("users")}
        className={`relative transition-colors duration-200 py-2 ${
          activeTab === "users"
            ? "text-blue-500 font-medium"
            : "hover:text-blue-300"
        }`}
      >
        Users
      </button>
    </div>
  );
}
