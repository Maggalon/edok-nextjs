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
    map_pin: string | null;
}

export interface BranchInfo {
    address: string;
    coordinates: string;
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
    quantity: number;
}

export interface ReservedItem {
    reservationInfo: Reservation;
    itemInfo: CollectionItem;
}

export interface HistoryItem {
    id: string;
    user_id: number;
    price: number;
    created_at: string;
    menu: {
        id: string;
        name: string;
        initialprice: number;
        weight: number;
        branch: {
            company: {
                name: string;
                logo: string;
            }
        }
    }
}

export interface MapPin {
  id: string;
  address: string;
  coordinates: string;
  ratingsum: number;
  votesnumber: number;
  companyid: string;
  company_logo: string;
  company_name: string;
  company_map_pin: string;
}