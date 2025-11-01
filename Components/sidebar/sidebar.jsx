import Sidebar from "./sidebar.styles";
import SidebarMenu from "./sidebar-menu";
import useSidebarContext from "../Layout/useSidebarContext";
import { useRouter } from "next/router";
import HomePage from "./List/HomePage";
import Dynadot from "./List/Dynadot";
import Godaddy from "./List/Godaddy";
import NameCheap from "./List/NameCheap";
import NameSilo from "./List/NameSilo";

export default function SidebarWrapper() {
  const router = useRouter();
  const { collapsed, setCollapsed } = useSidebarContext();

  return (
    <aside className="h-screen z-[50] sticky top-0  custom-scrollbar ">
      {collapsed ? (
        <div className={Sidebar.Overlay()} onClick={setCollapsed} />
      ) : null}
      <div
        className={`${Sidebar({
          collapsed: collapsed,
        })} bg-gradient-to-r from-blue-800 to-violet-800`}
      >
        <div className="flex flex-col justify-between h-full">
          <div className={Sidebar.Body()}>
            <SidebarMenu title="APIs">
              <HomePage />
              <Dynadot />
              <Godaddy />
              <NameCheap />
              <NameSilo />
            </SidebarMenu>
          </div>
          <div className={Sidebar.Footer()}></div>
        </div>
      </div>
    </aside>
  );
}
