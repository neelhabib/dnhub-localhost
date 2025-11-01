import { useRouter } from "next/router";
import SidebarItem from "../sidebar-item";
import { SiNamesilo } from "react-icons/si";

export default function NameSilo() {
  const router = useRouter();
  return (
    <>
      <SidebarItem
        isActive={router.asPath === "/namesilo-api"}
        title="NameSilo API"
        href="/namesilo-api"
        icon={<SiNamesilo size={17} color="white" />}
      />
    </>
  );
}
