export interface SubMenuItem {
  title: string;
  route: string;
}

export interface MenuItem {
  menuId: number;
  title: string;
  icon: string;
  isOpen: boolean;
  subMenu: SubMenuItem[];
}
