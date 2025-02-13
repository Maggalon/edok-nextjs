import { ChevronLeft, Share2, Heart, ShoppingBag, Star, MapPinIcon, Calendar, ChevronRight, Clock } from "lucide-react";
import { CollectionItem } from "../lib/types";
import { createClient } from "@/lib/supabase/server";
import React, { useContext } from "react";
import { redirect } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getSession } from "@/lib/session";
import { TWAContext } from "@/context/twa-context";
import { toast, ToastContainer } from "react-toastify";

interface ItemDetailsProps {
    selectedItem: CollectionItem;
    setSelectedItem: (selectedItem: CollectionItem | null) => void;
}

export const ItemDetails: React.FC<ItemDetailsProps> = ({ selectedItem, setSelectedItem }) => {
    
  //const session = getSession()
  const context = useContext(TWAContext)
  const webApp = context?.webApp

  const handleReserve = async () => {
    const session = await fetch('/api/session')
    if (!session.ok) {
      redirect('/profile')
    }
    // console.log(user);
    const response = await fetch(`/api/reservations`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: webApp?.initDataUnsafe.user?.id,
        item_id: selectedItem.id
      })
    })
    const data = await response.json()
    console.log(data);
    
    if (data.success) toast.info("Заказ зарезервирован", {position: 'top-center'})

  }
  
  return (
        <div className="min-h-screen bg-white">
          {/* Details Header */}
          <div className="relative h-72">
            <img src={selectedItem.menuItem.image} alt={selectedItem.menuItem.name} className="w-full h-full object-cover" />
            <div className="fixed top-0 left-0 right-0 p-4 flex justify-between items-start">
              <button 
                onClick={() => setSelectedItem(null)}
                className="p-2 rounded-full bg-white shadow-md opacity-70"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
              {/* <div className="flex gap-2">
                <button className="p-2 rounded-full bg-white shadow-md opacity-70">
                  <Share2 className="w-6 h-6 text-gray-700" />
                </button>
                <button className="p-2 rounded-full bg-white shadow-md opacity-70">
                  <Heart className="w-6 h-6 text-gray-700" />
                </button>
              </div> */}
            </div>
            <div className="absolute bottom-4 left-4 bg-white px-2 py-1 rounded-full text-sm font-medium text-primary-600">
              {selectedItem.quantity} осталось
            </div>
          </div>
  
          {/* Content */}
          <div className="px-4 py-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-transparent flex items-center justify-center flex-shrink-0">
              <img src={selectedItem.company.logo} alt={selectedItem.company.name} className="w-full object-cover" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{selectedItem.menuItem.name}</h1>
                <p className="text-gray-600">{selectedItem.company.name}</p>
              </div>
            </div>
  
            <div className="flex flex-col items-start gap-4 mb-6">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-primary-600" />
                <span className="font-semibold">{selectedItem.branch.rating || '--'}</span>
                <span className="text-gray-600">({selectedItem.branch.votesNumber})</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Clock className="w-5 h-5" />
                <p className="font-semibold">Забери с {selectedItem.collectTime}</p>
                <p className="text-sm text-white font-semibold bg-primary-600 py-1 px-3 rounded-full">{selectedItem.collectDay.toUpperCase()}</p>
              </div>
            </div>
  
            <div className="flex items-center justify-between py-4 border-t border-b border-gray-100">
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="font-semibold">{selectedItem.branch.address}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
  
            <div className="py-6 flex flex-col items-start mb-48">
              <h2 className="text-xl font-bold mb-4">Описание продукта</h2>
              <p className="text-gray-700 text-lg mb-4">{selectedItem.menuItem.description}</p>
              <div className="bg-gray-200 py-1 px-3 rounded-full">
                <p className="font-semibold text-sm">{selectedItem.menuItem.type}</p>
              </div>
            </div>
  
            {/* <div className="py-6 border-t border-gray-100">
              <button className="flex items-center justify-between w-full py-2" onClick={() => {}}>
                <span className="font-semibold">Ingredients & allergens</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div> */}
  
            {/* <div className="py-6 border-t border-gray-100">
              <h2 className="text-xl font-bold mb-4">What other people are saying</h2>
              <div className="flex items-center gap-2 mb-6">
                <Star className="w-6 h-6 text-primary-600" />
                <span className="text-2xl font-bold">{selectedItem.rating}</span>
                <span className="text-xl text-gray-600">/ 5.0</span>
              </div>
              <h3 className="font-semibold mb-4">Top 3 highlights</h3>
              <div className="space-y-4">
                {selectedItem.highlights?.map((highlight, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4 text-primary-600" />
                    </div>
                    <span className="text-gray-700">{highlight}</span>
                  </div>
                ))}
              </div>
            </div> */}
          </div>
  
          {/* Fixed Bottom Button */}
          <div className="fixed bottom-16 left-0 right-0 p-4 bg-white border-t border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 line-through">₽{selectedItem.menuItem.initialPrice}</span>
                <span className="text-2xl font-bold text-primary-600">₽{selectedItem.newPrice}</span>
              </div>
            </div>
            <button onClick={handleReserve} className="w-full bg-primary-600 text-white py-4 rounded-full font-semibold hover:bg-primary-700 transition-colors">
              Забронировать
            </button>
          </div>

          <ToastContainer className="text-xl font-semibold" />
        </div>
      );
}