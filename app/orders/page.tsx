"use client"

import { ItemCardSmall } from "@/components/item-card-small";
import { ItemDetails } from "@/components/item-details";
import { TWAContext } from "@/context/twa-context";
import { convertIntoCollectionItem } from "@/lib/helpers";
import { CollectionItem, Reservation, ReservedItem } from "@/lib/types";
import { useContext, useEffect, useState } from "react";

export default function Orders() {

    const context = useContext(TWAContext)
    const webApp = context?.webApp
    const geolocation = context?.geolocation

    const [reservations, setReservations] = useState<ReservedItem[] | null>()
    const [selectedItem, setSelectedItem] = useState<CollectionItem | null>(null);

    const getReservations = async () => {
      const results = await fetch(`/api/reservations?userId=${webApp?.initDataUnsafe.user?.id}`)
      const data = await results.json()

      const items_info_raw = await fetch('/api/items', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_ids: data.data.map((item: Reservation) => item.item_id) })
      })

      const items_info = await items_info_raw.json()
      const availableItems: ReservedItem[] = []
      
      for (let item of items_info.data) {
        
        //console.log(item);
        const newAvailableItem: CollectionItem = convertIntoCollectionItem(item, geolocation)
  
        console.log(newAvailableItem);
        availableItems.push({
          itemInfo: newAvailableItem,
          reservationInfo: data.data.find((reservation: Reservation) => reservation.item_id === newAvailableItem.id)
        })
        
      }
  
      setReservations(availableItems)
      
      
    }

    useEffect(() => {
      getReservations()
    }, [])

    if (selectedItem) {
      return (
        <ItemDetails selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
      );
    }

    return (
      <div>
        <div className="text-2xl font-bold p-5 w-screen fixed top-0 left-0 bg-white shadow-sm">Заказы</div>
        <div className="flex flex-col gap-3 mt-20">
          {reservations?.map(item => {
            return (
              <ItemCardSmall key={item.itemInfo.id} item={item} setSelectedItem={setSelectedItem} />
            )
          })}
        </div>
      </div>
    )
}