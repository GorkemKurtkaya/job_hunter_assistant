import * as Icons from "../icons";

interface SubMenuItem {
  title: string;
  url: string;
  authRequired?: boolean;
}

interface MenuItem {
  title: string;
  icon: any;
  url?: string;
  items: SubMenuItem[];
}

interface NavSection {
  label: string;
  items: MenuItem[];
}

export const NAV_DATA: NavSection[] = [
  {
    label: "",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        items: [
          {
            title: "Başvurularım",
            url: "/",
          },
        ],
      },
      {
        title: "Profile",
        url: "/profile",
        icon: Icons.User,
        items: [],
      },
      {
        title: "Authentication",
        icon: Icons.Authentication,
        items: [
          {
            title: "Sign In",
            url: "/auth/sign-in",
            authRequired: false, 
          }
        ],
      },
    ],
  }
];
