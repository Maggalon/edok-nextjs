"use client"

import { CollectionItem, ReservedItem } from "@/lib/types"
import { QrCode } from "lucide-react"
import { useState } from "react";
import { Modal } from "./modal";
import { QRCode } from "./qr-code";


export const ItemCardSmall: React.FC<{ item: ReservedItem; setSelectedItem: (selectedItem: CollectionItem | null) => void; }> = ({ item, setSelectedItem }) => {
    
    const [open, setOpen] = useState<boolean>(false);
    
    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };
    
    return (
        <div className="flex items-center gap-4 border shadow-xl m-2 p-4 rounded-lg">
            <div className="w-12 h-12 rounded-full bg-transparent flex items-center justify-center flex-shrink-0">
                <img src={item.itemInfo.company.logo} alt={item.itemInfo.company.name} className="w-full object-cover" />
            </div>
            <div onClick={() => setSelectedItem(item.itemInfo)} className="flex-1">
                <h1 className="text-xl font-bold text-gray-900">{item.itemInfo.menuItem.name.length > 18 ? item.itemInfo.menuItem.name.slice(0, 16) + "..." : item.itemInfo.menuItem.name}</h1>
                <p className="text-gray-600">{item.itemInfo.company.name}</p>
            </div>
            <QrCode size={64} onClick={handleOpen} className="text-primary-600 hover:bg-primary-100 p-1 rounded-xl" />
            <Modal isOpen={open} onClose={() => handleClose()}>
                <QRCode data={JSON.stringify(item.reservationInfo)} />
            </Modal>
        </div>
    )
}