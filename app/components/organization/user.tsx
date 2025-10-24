
interface Organization {
  id: number;
  name: string;
  slug: string;
  pendingRequests: number;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  avatarUrl: string;
  mail: string;
  contact: string;
  website?: string;
}
 interface organizationProps {
  org: Organization;
}


export default function Users({ org }: organizationProps) {
  return <div>users</div>;
}
