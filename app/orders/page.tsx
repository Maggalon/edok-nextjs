"use client"

import { ItemCardSmall } from "@/components/item-card-small";
import { ItemDetails } from "@/components/item-details";
import { TWAContext } from "@/context/twa-context";
import { convertIntoCollectionItem } from "@/lib/helpers";
import { CollectionItem, Reservation, ReservedItem } from "@/lib/types";
import { redirect } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function Orders() {

    const context = useContext(TWAContext)
    const webApp = context?.webApp
    const geolocation = context?.geolocation

    const [reservations, setReservations] = useState<ReservedItem[] | null>()
    const [selectedItem, setSelectedItem] = useState<CollectionItem | null>(null);

    const getReservations = async () => {
      // const session = await fetch('/api/session')
      // if (!session.ok) {
      //   redirect('/profile')
      // }

      const results = await fetch(`/api/reservations?userId=${972737130}`)
      const data = await results.json()
      console.log(data);
      

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

        const reservations_of_current_item = data.data.filter((cur_item: Reservation) => cur_item.item_id === item.id)
        const quantity = reservations_of_current_item.map((item: Reservation) => item.quantity).reduce((acc: number, n: number) => acc + n, 0) 
        console.log(quantity);

        availableItems.push({
          itemInfo: newAvailableItem,
          reservationInfo: {
            ...data.data.find((reservation: Reservation) => reservation.item_id === newAvailableItem.id),
            quantity
          }
        })
        
      }
  
      setReservations(availableItems)
      
      
    }

    useEffect(() => {
      getReservations()
    }, [])

    if (selectedItem) {
      return (
        <ItemDetails selectedItem={selectedItem} setSelectedItem={setSelectedItem} isActive={false} />
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