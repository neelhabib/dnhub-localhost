import { useRouter } from "next/router";
import SidebarItem from "../sidebar-item";
import { SiNamecheap } from "react-icons/si";

export default function NameCheap() {
  const router = useRouter();
  return (
    <>
      <SidebarItem
        isActive={router.asPath === "/namecheap-api"}
        title="NameCheap API"
        href="/namecheap-api"
        icon={<SiNamecheap size={17} color="white" />}
      />
    </>
  );
}
