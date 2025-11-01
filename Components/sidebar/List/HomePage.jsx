import { useRouter } from "next/router";
import SidebarItem from "../sidebar-item";
import { FaGoogle } from "react-icons/fa";
export default function HomePage() {
  const router = useRouter();
  return (
    <>
      <SidebarItem
        isActive={router.asPath === "/"}
        title="Google API"
        href="/"
        icon={<FaGoogle size={17} color="white" />}
      />
    </>
  );
}
