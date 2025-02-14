"use client"

import { CollectionItem, ReservedItem } from "@/lib/types"
import { QrCode, RotateCcw } from "lucide-react"
import { useState } from "react";
import { Modal } from "./modal";
import { QRCode } from "./qr-code";


export const HistoryCard: React.FC<{ item: any }> = ({ item }) => {
    
    // const [open, setOpen] = useState<boolean>(false);
    
    // const handleClose = () => {
    //     setOpen(false);
    // };

    // const handleOpen = () => {
    //     setOpen(true);
    // };
    
    return (
        <div className="flex items-center gap-4 border shadow-md p-4 rounded-lg">
            <div className="w-12 h-12 rounded-full bg-transparent flex items-center justify-center flex-shrink-0">
                <img src={item.menu.branch.company.logo} alt={item.menu.branch.company.name} className="w-full object-cover" />
            </div>
            <div className="flex-1">
                <h1 className="text-xl font-bold text-gray-900">{item.menu.name.length > 18 ? item.menu.name.slice(0, 16) + "..." : item.menu.name}</h1>
                <p className="text-gray-600">{item.menu.branch.company.name}</p>
            </div>
            <RotateCcw size={48} className="text-primary-600 hover:bg-primary-100 p-1 rounded-xl" />
            {/* <Modal isOpen={open} onClose={() => handleClose()}>
                <QRCode data={JSON.stringify(item.reservationInfo)} />
            </Modal> */}
        </div>
    )
}