import Image from "next/image";
export default function Navbar() {
  return (
    <div className="flex justify-between items-center h-[72px] px-8 py-4 ">
      <div className="">
        <Image src="/Navbar/Group 1.svg" alt="Logo" width={100} height={100}  />
      </div>

      <div className="flex gap-4 ">
        <Image src={'/Navbar/support.svg'} alt="Search" width={24} height={24} />
        <Image src={'/Navbar/Vector.svg'} alt="Notification" width={16} height={16} />
        <Image src={'/Navbar/user.svg'} alt="Settings" width={24} height={24} />
      </div>
    </div>
  );
}
