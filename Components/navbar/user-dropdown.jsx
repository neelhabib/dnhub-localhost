import {
  Avatar,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Link,
  Navbar,
  NavbarItem,
} from "@heroui/react";

import NextLink from "next/link";

export default function UserDropdown() {
  return (
    <Dropdown>
      <NavbarItem>
        <DropdownTrigger>
          <Avatar
            as="button"
            color="secondary"
            size="md"
            name="Ad"
            // src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
          />
        </DropdownTrigger>
      </NavbarItem>
      <DropdownMenu
        aria-label="User menu actions"
        // onAction={handleLogout}
        // variant="bordered"
      >
        <DropdownSection showDivider>
          <DropdownItem
            key="profile"
            className="flex flex-col justify-start w-full items-start"
          >
            {/* <p>Signed in as</p> */}
            <p className="font-semibold text-violet-600">Admin</p>
          </DropdownItem>
        </DropdownSection>
        <DropdownItem
          disabled
          isDisabled
          key="configurations"
          as={NextLink}
          href="/admin/credentials"
        >
          Change Credentials
        </DropdownItem>

        {/* <DropdownItem
          key="logout"
          color="danger"
          className="text-danger "
          onClick={handleLogout}
        >
          Log Out
        </DropdownItem> */}
        <DropdownItem key="switch">{/* <DarkModeSwitch /> */}</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
