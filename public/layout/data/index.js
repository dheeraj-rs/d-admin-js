export const menuitem = [
  {
    label: "Home",
    icon: "pi pi-home",
    items: [
      {
        label: "Dashboard",
        icon: "pi pi-home",
        to: "/",
      },
    ],
  },
  {
    label: "sites",
    icon: "pi pi-globe",
    items: [
      {
        label: "Ecommerce",
        icon: "pi pi-eye",
        to: "/ecommerce",
        badge: "NEW",
      },
      {
        label: "Basic",
        icon: "pi pi-globe",
        to: "/basic",
        target: "_blank",
      },
    ],
  },
  {
    label: "pages",
    icon: "pi pi-briefcase",
    items: [
      {
        label: "UI elements",
        icon: "pi pi-briefcase",
        items: [
          {
            label: "Form Layout",
            icon: "pi pi-id-card",
            to: "/uielements",
          },
          {
            label: "Input",
            icon: "pi pi-check-square",
            to: "/input",
          },
          {
            label: "Float Label",
            icon: "pi pi-bookmark",
            to: "/floatlabel",
          },
          {
            label: "Invalid State",
            icon: "pi pi-exclamation-circle",
            to: "/invalidstate",
          },
          {
            label: "Button",
            icon: "pi pi-mobile",
            to: "/button",
            className: "rotated-icon",
          },
          { label: "Table", icon: "pi pi-table", to: "/table" },
          { label: "Tree", icon: "pi pi-share-alt", to: "/tree" },
          { label: "Panel", icon: "pi pi-tablet", to: "/panel" },
          { label: "Overlay", icon: "pi pi-clone", to: "/overlay" },
          { label: "Media", icon: "pi pi-image", to: "/media" },
          {
            label: "Menu",
            icon: "pi pi-bars",
            to: "/menu",
            preventExact: true,
          },
          {
            label: "Message",
            icon: "pi pi-comment",
            to: "/message",
          },
          { label: "File", icon: "pi pi-file", to: "/landing" },
          {
            label: "Chart",
            icon: "pi pi-chart-bar",
            to: "/chart",
          },
          {
            label: "Misc",
            icon: "pi pi-circle",
            to: "/misc",
          },
        ],
      },
      {
        label: "Sections",
        icon: "pi pi-briefcase",
        items: [
          {
            label: "Form Layout",
            icon: "pi pi-id-card",
            to: "/sections",
          },
          {
            label: "Input2",
            icon: "pi pi-check-square",
            to: "/input2",
          },
          {
            label: "Float Label",
            icon: "pi pi-bookmark",
            to: "/floatlabel",
          },
        ],
      },
      {
        label: "Pages",
        icon: "pi pi-briefcase",
        items: [
          {
            label: "Landing2",
            icon: "pi pi-globe",
            to: "/landing2",
          },
          {
            label: "Auth",
            icon: "pi pi-user",
            items: [
              {
                label: "Login",
                icon: "pi pi-sign-in",
                to: "/login",
              },
              {
                label: "Error",
                icon: "pi pi-times-circle",
                to: "/error",
              },
              {
                label: "Access Denied",
                icon: "pi pi-lock",
                to: "/accessdeniedding",
              },
            ],
          },
          {
            label: "Crud",
            icon: "pi pi-pencil",
            to: "/crud",
          },
          {
            label: "Timeline",
            icon: "pi pi-calendar",
            to: "/timeline",
          },
          {
            label: "Not Found",
            icon: "pi pi-exclamation-circle",
            to: "/notfound",
          },
          {
            label: "Empty",
            icon: "pi pi-circle-off",
            to: "/empty",
          },
        ],
      },
    ],
  },
  {
    label: "Utils",
    icon: "pi pi-desktop",
    items: [
      {
        label: "drjicons",
        icon: "pi pi-desktop",
        url: "https://www.npmjs.com/package/drjicons",
      },
      {
        label: "drjFlex",
        icon: "pi pi-desktop",
        url: "https://www.npmjs.com/package/drjflex",
        target: "_blank",
      },
    ],
  },
];
