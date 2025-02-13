"use client"

import { useContext, useEffect, useState } from 'react';
import { Search, MapPin, Menu } from 'lucide-react';
import { CollectionItem } from '../lib/types';
import { ItemDetails } from '../components/item-details';
import { ItemCard } from '../components/item-card';
import { calculateDistance, convertIntoCollectionItem } from '@/lib/helpers';
import { TWAContext } from '@/context/twa-context';
// import dynamic from 'next/dynamic';

// const Map = dynamic(() => import('../components/map'), { ssr: false });

export default function Home() {
  const [view, setView] = useState<'list' | 'map'>('list');
  const [sortBy, setSortBy] = useState('Relevance');
  const [selectedItem, setSelectedItem] = useState<CollectionItem | null>(null);
  const [items, setItems] = useState<CollectionItem[] | null>()
  
  const context = useContext(TWAContext)
  const geolocation = context?.geolocation

  const getItems = async () => {

    const response = await fetch(`/api/items`)
    const data = await response.json()
    //console.log(data.results);
    const availableItems: CollectionItem[] = []

    for (let item of data.results) {
      
      //console.log(item);
      const newAvailableItem: CollectionItem = convertIntoCollectionItem(item, geolocation)

      console.log(newAvailableItem);
      availableItems.push(newAvailableItem)
      
    }

    setItems(availableItems)
    
  }

  useEffect(() => {
    if (geolocation) {
      getItems()
    }
  }, [geolocation])

  if (selectedItem) {
    return (
      <ItemDetails selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header Section */}
      <div className="fixed top-0 left-0 right-0 bg-white z-10">
        {/* Search Header */}
        <div className="bg-white p-4 shadow-sm">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Поиск"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button className="p-2 border border-gray-200 rounded-lg hover:bg-primary-50">
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
            <button className="p-2 border border-gray-200 rounded-lg hover:bg-primary-50">
              <MapPin className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex rounded-full bg-gray-100 mx-4 my-2">
          <button
            className={`flex-1 py-3 rounded-full ${view === 'list' ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-primary-50'}`}
            onClick={() => setView('list')}
          >
            Список
          </button>
          <button
            className={`flex-1 py-3 rounded-full ${view === 'map' ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-primary-50'}`}
            onClick={() => setView('map')}
          >
            Карта
          </button>
        </div>

        {/* Sort Section */}
        {view === 'list' && 
          <div className="px-4 py-2 flex items-center bg-white border-b border-gray-100">
            <span className="text-gray-700">Сортировать по: </span>
            <button className="ml-2 font-semibold text-gray-900 flex items-center hover:text-primary-600">
              {sortBy}
              <span className="ml-1">▼</span>
            </button>
          </div>
        }
      </div>

      {/* Items List - Add padding top to account for fixed header */}
      <div className="mt-44 mb-20 p-4 space-y-4">
        {items && view === 'list' && items.map((item) => (
          <ItemCard key={item.id} item={item} setSelectedItem={setSelectedItem} />
        ))}
        {/* {view === 'map' &&
          <Map coordinates={{ lat: 43.13, lng: 131.91 }} />
        } */}
      </div>
    </div>
  );
}
