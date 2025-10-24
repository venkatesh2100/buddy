import Image from "next/image";
type Organization = {
  id: number;
  name: string;
  slug: string;
  pendingRequests: number;
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
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700";
      case "Blocked":
        return "bg-red-100 text-red-700";
      case "Inactive":
        return "bg-gray-200 text-gray-600";
      case "change":
        return "bg-purple-100 text-purple-600";
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
    <div className="flex border-bg-gray-50 shadow-md p-6 m-10 justify-between">
      <div className="flex ">
        <img
          src={org.avatarUrl}
          alt={org.name}
          width={128}
          height={128}
          className="rounded"
        />
        <div className="flex flex-col ml-6 pt-4 gap-4">
          <div className="text-xl font-semibold">{org.name}</div>
          <div className="text-sm flex flex-col gap-4 text-gray-600 text-center ">
            <a className="flex ">
              <Image
                src={"/mail.svg"}
                alt="Search"
                width={18}
                height={18}
                className="mr-1"
              />
              <a>{org.mail}</a>
            </a>
               <a className="flex ">
              <Image
                src={"/phone.svg"}
                alt="Search"
                width={20}
                  className="mr-1"
                height={20}
              />
              <a>{org.contact}</a>
            </a>
                 <a className="flex ">
              <Image
                src={"/world.svg"}
                alt="Search"
                width={20}
                  className="mr-1"
                height={20}
              />
              <a>{org.website}</a>
            </a>
          </div>
        </div>
      </div>
      <div className="p-2 ">
        <span
          className={`inline-flex  mr-1  items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
            org.status
          )}`}
        >
          <span
            className={`w-2.5 h-2.5 rounded-full ${getDotColor(org.status)}`}
          ></span>
          {org.status}
        </span>
        <span
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
            "change"
          )}`}
        >
          Change Status
        </span>
      </div>
    </div>
  );
}
