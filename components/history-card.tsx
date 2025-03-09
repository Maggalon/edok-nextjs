"use client"

import { CollectionItem, ReservedItem } from "@/lib/types"
import { QrCode, RotateCcw } from "lucide-react"
import { useContext, useState } from "react";
import { Modal } from "./modal";
import { QRCode } from "./qr-code";
import { convertIntoCollectionItem } from "@/lib/helpers";
import { TWAContext } from "@/context/twa-context";
import { ItemDetails } from "./item-details";
import { toast, ToastContainer } from "react-toastify";

interface Item {
    id: string;
    quantity: number;
    newprice: number;
    collectday: string;
    collecttimerange: string;
    menuid: string;
}

export const HistoryCard: React.FC<{ item: any, setSelectedItem: (item: CollectionItem) => void }> = ({ item, setSelectedItem }) => {
    
    // const [open, setOpen] = useState<boolean>(false);
    
    // const handleClose = () => {
    //     setOpen(false);
    // };

    // const handleOpen = () => {
    //     setOpen(true);
    // };

    const context = useContext(TWAContext)
    const geolocation = context?.geolocation

    const repeatOrder = async (menuId: string) => {
        const is_item_available = await fetch("/api/history", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                menuId: menuId
            })
        })
        const data = await is_item_available.json()
        console.log(data);
        
        if (data.data.length) {
            const item_info_raw = await fetch('/api/items', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ item_ids: data.data.map((item: Item) => item.id) })
            })
            const item_info = await item_info_raw.json()
            console.log(item_info.data[0]);

            const newAvailableItem: CollectionItem = convertIntoCollectionItem(item_info.data[0], geolocation)
          
            console.log(newAvailableItem);

            setSelectedItem(newAvailableItem)
        } else {
            toast.error("Товар недоступен", {position: 'top-center'})
        }
        
    }
    
    return (
        <div className="flex items-center gap-4 border shadow-md p-4 rounded-lg">
            <div className="w-12 h-12 rounded-full bg-transparent flex items-center justify-center flex-shrink-0">
                <img src={item.menu.branch.company.logo} alt={item.menu.branch.company.name} className="w-full rounded-full object-cover" />
            </div>
            <div className="flex-1">
                <h1 className="text-xl font-bold text-gray-900">{item.menu.name.length > 18 ? item.menu.name.slice(0, 16) + "..." : item.menu.name}</h1>
                <p className="text-gray-600">{item.menu.branch.company.name}</p>
            </div>
            <RotateCcw onClick={() => repeatOrder(item.menu.id)} size={48} className="text-primary-600 hover:bg-primary-100 p-1 rounded-xl" />
            {/* <Modal isOpen={open} onClose={() => handleClose()}>
                <QRCode data={JSON.stringify(item.reservationInfo)} />
            </Modal> */}
            <ToastContainer className="text-xl font-semibold" />
        </div>
    )
}