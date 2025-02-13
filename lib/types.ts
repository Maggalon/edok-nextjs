export interface CollectionItem {
    id: string;
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

export interface Reservation {
    id: string;
    user_id: string;
    item_id: string;
    created_at: string;
}

export interface ReservedItem {
    reservationInfo: Reservation;
    itemInfo: CollectionItem;
}