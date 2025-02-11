export interface CollectionItem {
    id: number;
    menuItem: MenuItemInfo;
    newPrice: number;
    quantity: number;
    collectDay: string;
    collectTime: string;
    branch: BranchInfo;
    company: CompanyInfo;
}

export interface CompanyInfo {
    name: string;
    logo: string;
}

export interface BranchInfo {
    address: string;
    distance: number | undefined;
    rating: number | undefined;
    votesNumber: number;
}

export interface MenuItemInfo {
    name: string;
    description: string | undefined;
    type: string;
    image: string;
    initialPrice: string;
}