import { useRouter } from "next/router";
import SidebarItem from "../sidebar-item";
import { FaLink } from "react-icons/fa";
export default function Dynadot() {
  const router = useRouter();
  return (
    <>
      <SidebarItem
        isActive={router.asPath === "/dynadot-api"}
        title="Dynadot API"
        href="/dynadot-api"
        icon={<FaLink size={17} color="white" />}
      />
    </>
  );
}
