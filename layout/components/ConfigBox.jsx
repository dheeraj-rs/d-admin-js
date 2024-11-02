import { DropdownOuterAnimationBox, FolderLayout } from "@/lib/utils";
import { SettingsItems } from "@/public/layout/data";
import LayoutSettings from "./LayoutSettings";

const ComponentRegistry = {
  LayoutSettings,
};

function ConfigBox() {
  return (
    <DropdownOuterAnimationBox
      button={
        <button
          type="button"
          className={`p-link layout-menu-button layout-topbar-button`}
        >
          <i className="pi pi-cog" />
        </button>
      }
    >
      <FolderLayout
        folderItems={SettingsItems}
        ComponentRegistry={ComponentRegistry}
        layoutHeader="Settings"
      />
    </DropdownOuterAnimationBox>
  );
}

export default ConfigBox;
