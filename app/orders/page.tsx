"use client"

import { ItemCardSmall } from "@/components/item-card-small";
import { ItemDetails } from "@/components/item-details";
import { TWAContext } from "@/context/twa-context";
import { convertIntoCollectionItem } from "@/lib/helpers";
import { CollectionItem, Reservation, ReservedItem } from "@/lib/types";
import { QrCode } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function Orders() {

    const context = useContext(TWAContext)
    const webApp = context?.webApp
    const geolocation = context?.geolocation

    const [reservations, setReservations] = useState<ReservedItem[] | null>()
    const [selectedItem, setSelectedItem] = useState<CollectionItem | null>(null);

    const getReservations = async () => {
      const session = await fetch('/api/session')
      if (!session.ok) {
        redirect('/profile')
      }

      const results = await fetch(`/api/reservations?userId=${webApp?.initDataUnsafe.user?.id}`)
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
          {!reservations &&
          <>
            <div className="flex items-center gap-4 border shadow-xl m-2 p-4 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-gray-300 animate-pulse flex items-center justify-center flex-shrink-0"></div>
              <div className="flex-1 flex flex-col gap-2">
                <div className="w-full h-5 rounded-full bg-gray-300 animate-pulse"></div>
                <div className="w-1/2 h-4 rounded-full bg-gray-300 animate-pulse"></div>
              </div>
              <div className="w-10 h-5 rounded-full bg-gray-300 animate-pulse"></div>
              <QrCode size={64} className="text-gray-300 animate-pulse p-1 rounded-xl" />
            </div>
            <div className="flex items-center gap-4 border shadow-xl m-2 p-4 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-gray-300 animate-pulse flex items-center justify-center flex-shrink-0"></div>
              <div className="flex-1 flex flex-col gap-2">
                <div className="w-full h-5 rounded-full bg-gray-300 animate-pulse"></div>
                <div className="w-1/2 h-4 rounded-full bg-gray-300 animate-pulse"></div>
              </div>
              <div className="w-10 h-5 rounded-full bg-gray-300 animate-pulse"></div>
              <QrCode size={64} className="text-gray-300 animate-pulse p-1 rounded-xl" />
            </div>
          </>
          }
          {reservations?.length === 0 &&
            <div className='w-full h-96 flex flex-col justify-center items-center'>
              <Image src={"/Edok-staff.png"} width={200} height={200} alt='Edok logo' />
              <span className='text-primary-600 w-3/4 text-center font-semibold'>Здесь будет список забронированных вами позиций</span>
            </div>
          }
          {reservations && reservations.map(item => {
            return (
              <ItemCardSmall key={item.itemInfo.id} item={item} setSelectedItem={setSelectedItem} />
            )
          })}
        </div>
      </div>
    )
}