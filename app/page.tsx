"use client"

import { useContext, useEffect, useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { CollectionItem, MapPin } from '../lib/types';
import { ItemDetails } from '../components/item-details';
import { ItemCard } from '../components/item-card';
import { convertIntoCollectionItem } from '@/lib/helpers';
import { TWAContext } from '@/context/twa-context';
import { Modal } from '@/components/modal';
import MultiRangeSlider from '@/components/multirange-slider';
import Map from '@/components/map';
import Image from 'next/image';

interface Filters {
  today: boolean;
  tomorrow: boolean;
  from: number;
  to: number;
  bakery: boolean;
  meals: boolean;
  grocery: boolean;
}

const defaltFilters: Filters = {
  today: true,
  tomorrow: true,
  from: 0,
  to: 24,
  bakery: true,
  meals: true,
  grocery: true,
}

const activeFilterStyle = "text-white bg-primary-600"
const inactiveFilterStyle = "text-primary-600 bg-white"

export default function Home() {
  const [view, setView] = useState<'list' | 'map'>('list');
  const [sortBy, setSortBy] = useState<"Цена" | "Рейтинг" | "Удаленность">('Цена');
  const [filters, setFilters] = useState<Filters>(defaltFilters)
  const [selectedItem, setSelectedItem] = useState<CollectionItem | null>(null);
  const [items, setItems] = useState<CollectionItem[] | null>()
  const [defaultItems, setDefaultItems] = useState<CollectionItem[] | null>()
  const [mapData, setMapData] = useState<MapPin[] | null>(null)
  const [openSortings, setOpenSortings] = useState<boolean>(false)
  const [openFilters, setOpenFilters] = useState<boolean>(false)
  const [query, setQuery] = useState<string | undefined>()
  
  const context = useContext(TWAContext)
  const geolocation = context?.geolocation

  const getItems = async () => {

    const response = await fetch(`/api/items`)
    const data = await response.json()
    //console.log(data.results);
    let availableItems: CollectionItem[] = []

    for (let item of data.results) {
      
      //console.log(item);
      const newAvailableItem: CollectionItem = convertIntoCollectionItem(item, geolocation)

      console.log(newAvailableItem);
      availableItems.push(newAvailableItem)
      
    }

    availableItems = availableItems.filter(item => item.quantity > 0)

    sortByPrice(availableItems)
    setItems(availableItems)
    setDefaultItems(availableItems)
  }

  const getBranches = async () => {
    const coordinates = items?.map(item => item.branch.coordinates)
    console.log(coordinates);
    
    const response = await fetch('/api/branches', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        coordinates
      })
    })

    const data = await response.json()
    console.log(data);
    setMapData(data.data)
  }

  const setSorting = (type: "Цена" | "Рейтинг" | "Удаленность") => {
    setSortBy(type)
    setOpenSortings(false)
  }

  const sortByDistance = (items: CollectionItem[]) => {
    items.sort((a, b) => a.branch.distance! - b.branch.distance!)
  }

  const sortByPrice = (items: CollectionItem[]) => {
    items.sort((a, b) => a.newPrice - b.newPrice)
  }

  const sortByRating = (items: CollectionItem[]) => {
    items.sort((a, b) => {
      if (!a.branch.rating || !b.branch.rating) return 1
      if (b.branch.rating > a.branch.rating) return 1
      if (a.branch.rating > b.branch.rating) return -1
      return 0
    })
  }

  const filterItems = (itemsToFilter = defaultItems) => {
    let newItems = itemsToFilter!

    if (!filters.today) newItems = newItems.filter(item => item.collectDay !== 'сегодня')
    if (!filters.tomorrow) newItems = newItems.filter(item => item.collectDay !== 'завтра')
    if (!filters.bakery) newItems = newItems.filter(item => item.menuItem.type !== 'Выпечка')
    if (!filters.meals) newItems = newItems.filter(item => item.menuItem.type !== 'Готовые блюда')
    if (!filters.grocery) newItems = newItems.filter(item => item.menuItem.type !== 'Бакалея')
    newItems = newItems.filter(item => filters.to > Number(item.collectTime.split(":")[0]) && filters.from < Number(item.collectTime.split(":")[1].split("-")[1]))
  
    setItems(newItems)
  }

  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const searchedItems = defaultItems!.filter(item => item.company.name.toLowerCase().includes(query!.toLowerCase()) || item.menuItem.name.toLowerCase().includes(query!.toLowerCase()))
      filterItems(searchedItems)
    }
  }

  const clearQuery = () => {
    setQuery("")
    const searchedItems = defaultItems!.filter(item => item.company.name.toLowerCase().includes("") || item.menuItem.name.toLowerCase().includes(""))
    filterItems(searchedItems)
  }

  useEffect(() => {
    if (items) {
      if (sortBy === "Удаленность" && geolocation) {
        const tempItems = items
        sortByDistance(tempItems)
        setItems(tempItems)
      } else if (sortBy === 'Цена') {
        const tempItems = items
        sortByPrice(tempItems)
        setItems(tempItems)
      } else if (sortBy === 'Рейтинг') {
        const tempItems = items
        sortByRating(tempItems)
        setItems(tempItems)
      }
    }
  }, [sortBy])

  useEffect(() => {
    if (geolocation) {
      getItems()
    }
  }, [geolocation])

  useEffect(() => {
    if (items) {
      getBranches()
    }
  }, [items])

  useEffect(() => {
    if (items && selectedItem) {
      for (let item of items) {
        if (item.id === selectedItem.id) {
          item.quantity = selectedItem.quantity
          break
        }
      }
    }
  }, [selectedItem])

  if (selectedItem) {
    return (
      <ItemDetails selectedItem={selectedItem} setSelectedItem={setSelectedItem} isActive={true} />
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
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {query && <X onClick={clearQuery} className='text-black absolute w-5 h-5 top-1/2 right-3 transform -translate-y-1/2' />}
            </div>
            <button onClick={() => setOpenFilters(!openFilters)} className="p-2 border border-gray-200 rounded-lg hover:bg-primary-50">
              <SlidersHorizontal className="w-6 h-6 text-gray-700" />
            </button>
            {/* <button className="p-2 border border-gray-200 rounded-lg hover:bg-primary-50">
              <MapPin className="w-6 h-6 text-gray-700" />
            </button> */}
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
            <button onClick={() => setOpenSortings(true)} className="ml-2 font-semibold text-primary-600 flex items-center hover:text-primary-600">
              {sortBy}
              <span className="ml-1">▼</span>
            </button>
          </div>
        }
      </div>

      {/* Items List - Add padding top to account for fixed header */}
      <div className="mt-44 mb-20 p-4 space-y-4">
        {view === 'list' && !items &&
          <div 
            className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-center w-full h-48 bg-gray-300 rounded-sm">
                <svg className="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                    <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
                </svg>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse"></div>
                <div className='w-full flex flex-col gap-2'>
                  <div className="w-1/2 h-4 rounded-full bg-gray-300 animate-pulse"></div>
                  <div className="w-1/3 h-2 rounded-full bg-gray-300 animate-pulse"></div>
                </div>
              </div>
              <div className="w-1/2 h-2 rounded-full bg-gray-300 animate-pulse mb-2"></div>
              <div className="flex items-center justify-between">
                <div className="w-24 h-3 rounded-full bg-gray-300 animate-pulse"></div>
                <div className="text-right w-24 h-3 rounded-full bg-gray-300 animate-pulse"></div>
              </div>
            </div>
          </div>
        }
        {view === 'list' && items?.length === 0 &&
          <div className='w-full h-96 flex flex-col justify-center items-center'>
            <Image src={"/Edok-staff.png"} width={200} height={200} alt='Edok logo' />
            <span className='text-primary-600 font-semibold'>Здесь будет список доступных позиций</span>
          </div>
        }
        {items && view === 'list' && items.map((item) => {
          if (item.quantity > 0) {
            return (
              <ItemCard key={item.id} item={item} setSelectedItem={setSelectedItem} />
            )
          }
        })}
        {view === 'map' &&
          <div className='h-screen'>
            <Map data={mapData} setSelectedItem={setSelectedItem} />
          </div>
        }
      </div>

      <Modal isOpen={openFilters} onClose={() => setOpenFilters(false)}>
        <div className='flex flex-col w-full'>
          <div className='text-xl font-bold text-center mb-4'>Фильтры</div>
          <div className='w-full h-0.5 bg-gray-300 mb-10'></div>
          <div className='flex flex-col gap-4 w-full'>
            <div className='flex flex-col'>
              <span className='text-lg font-semibold mb-2'>День, когда забирать</span>
              <div className='flex gap-2'>
                <span onClick={() => setFilters({ ...filters, today: !filters.today })} className={`flex-1 text-center border rounded-lg py-2 px-5 shadow-md ${filters.today ? activeFilterStyle : inactiveFilterStyle}`}>Сегодня</span>
                <span onClick={() => setFilters({ ...filters, tomorrow: !filters.tomorrow })} className={`flex-1 text-center border rounded-lg py-2 px-5 shadow-md ${filters.tomorrow ? activeFilterStyle : inactiveFilterStyle}`}>Завтра</span>
              </div>
            </div>
            <div className='flex flex-col'>
              <span className='text-lg font-semibold mb-2'>Время, когда забирать</span>
              <MultiRangeSlider
                min={0}
                max={24}
                onChange={({ min, max }: { min: number; max: number }) => {
                  setFilters({ ...filters, from: min, to: max })
                }}
              />
            </div>
            <div className='flex flex-col'>
              <span className='text-lg font-semibold mb-2'>Категории</span>
              <div className='flex gap-2'>
                <span onClick={() => setFilters({ ...filters, bakery: !filters.bakery })} className={`flex-1 flex items-center justify-center text-center border rounded-lg p-2 shadow-md ${filters.bakery ? activeFilterStyle : inactiveFilterStyle}`}>Выпечка</span>
                <span onClick={() => setFilters({ ...filters, meals: !filters.meals })} className={`flex-1 flex items-center justify-center text-center border rounded-lg p-2 shadow-md ${filters.meals ? activeFilterStyle : inactiveFilterStyle}`}>Готовые блюда</span>
                <span onClick={() => setFilters({ ...filters, grocery: !filters.grocery })} className={`flex-1 flex items-center justify-center text-center border rounded-lg p-2 shadow-md ${filters.grocery ? activeFilterStyle : inactiveFilterStyle}`}>Бакалея</span>
              </div>
            </div>
            <button type='button' onClick={() => filterItems()} className='bg-primary-600 w-full text-white rounded-lg p-2 hover:bg-primary-700'>Применить</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={openSortings} onClose={() => setOpenSortings(false)}>
        <div className='flex flex-col w-full'>
          <div className='text-xl font-bold text-center mb-4'>Сортировка</div>
          <div className='w-full h-0.5 bg-gray-300 mb-10'></div>
          <div className='flex flex-col gap-4 w-full'>
            <div className='flex justify-between items-center'>
              <span className='text-lg'>Удаленность</span>
              <div onClick={() => setSorting("Удаленность")} className={`w-6 h-6 ring-2 ring-primary-600 border-4 border-white rounded-full ${sortBy == "Удаленность" && "bg-primary-600"}`}></div>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-lg'>Цена</span>
              <div onClick={() => setSorting("Цена")} className={`w-6 h-6 ring-2 ring-primary-600 border-4 border-white rounded-full ${sortBy == "Цена" && "bg-primary-600"}`}></div>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-lg'>Рейтинг</span>
              <div onClick={() => setSorting("Рейтинг")} className={`w-6 h-6 ring-2 ring-primary-600 border-4 border-white rounded-full ${sortBy == "Рейтинг" && "bg-primary-600"}`}></div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
