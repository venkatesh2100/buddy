
interface OrgBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function OrgBar({ activeTab, onTabChange }: OrgBarProps) {
  const handleTabClick = (tab: string) => {
    onTabChange(tab);
  };

  return (
    <div className="flex  px-4 text-sm text-gray-500  ">
      <button
        onClick={() => handleTabClick("basic")}
        className={`relative px-6  border-b-gray-50 mr-4 rounded-md items-center  justify-center shadow-md transition-colors duration-200 py-2 ${
          activeTab === "basic"
            ? "text-blue-500  bg-blue-200font-medium"
            : "hover:text-blue-300"
        }`}
      >
        Basic Details
      </button>
      <button
        onClick={() => handleTabClick("users")}
        className={`relative transition-colors px-4 border-b-gray-50 rounded-md items-center shadow-md  duration-200 py-2 ${
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
