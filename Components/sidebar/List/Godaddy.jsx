import { useRouter } from "next/router";
import SidebarItem from "../sidebar-item";
import { SiGodaddy } from "react-icons/si";

export default function Godaddy() {
  const router = useRouter();
  return (
    <>
      <SidebarItem
        isActive={router.asPath === "/godaddy-api"}
        title="Godaddy API"
        href="/godaddy-api"
        icon={<SiGodaddy size={17} color="white" />}
      />
    </>
  );
}
