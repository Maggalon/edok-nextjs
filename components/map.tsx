'use client';
// import { type FC } from 'react';
// import React from 'react';
// import ReactDOM from 'react-dom';
// import Image from 'next/image';
// import { type LngLat } from '@yandex/ymaps3-types';

// const ymaps3Reactify = await ymaps3.import('@yandex/ymaps3-reactify');
// const reactify = ymaps3Reactify.reactify.bindTo(React, ReactDOM);
// const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapControls, YMapMarker } =
//   reactify.module(ymaps3);

// const { YMapZoomControl } = reactify.module(await ymaps3.import('@yandex/ymaps3-controls@0.0.1'));

// interface MapProps {
//   coordinates:
//     | {
//         lat: number;
//         lng: number;
//       }
//     | undefined;
// }

// const Map: FC<MapProps> = ({ coordinates }) => {
//   if (!coordinates) return null;

//   const location = { center: [coordinates.lng, coordinates.lat], zoom: 13 };

//   return (
//     <YMap location={location} className="min-h-[calc(100vh-300px)] md:min-h-[calc(100vh-280px)]">
//       <YMapControls position="left">
//         <YMapZoomControl />
//       </YMapControls>

//       <YMapDefaultSchemeLayer />
//       <YMapDefaultFeaturesLayer />

//       <YMapMarker coordinates={location.center as LngLat} zIndex={1}>
//         <div className="relative h-[56px] w-[46px]">
//           <Image src="/icon-location.svg" alt="location" fill />
//         </div>
//       </YMapMarker>
//     </YMap>
//   );
// };

// export default Map;


import React, { useRef, useEffect, useState, useContext } from "react";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import { calculateDistance, calculateNewPoints, convertIntoCollectionItem } from "@/lib/helpers";
import { TWAContext } from "@/context/twa-context";
import { Modal } from "./modal";
import { CollectionItem, MapPin } from "@/lib/types";
import { Star } from "lucide-react";

const Map = ({ data, setSelectedItem }: {data: MapPin[] | null; setSelectedItem: (item: CollectionItem) => void}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [showModal, setShowModal] = useState<boolean>(false)
  const [branchInfo, setBranchInfo] = useState<MapPin | null>(null)
  const [branchItems, setBranchItems] = useState<CollectionItem[] | null>(null)

  const context = useContext(TWAContext)
  const geolocation = context?.geolocation

  const handleMapPinClick = async (mapItem: MapPin) => {
    const response = await fetch(`/api/branches?branchId=${mapItem.id}`)
    const data = await response.json()
    
    const branch_items_raw = await fetch('/api/items', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        item_ids: data.items.map((item: any) => item.id)
      })
    })
    const branch_items = await branch_items_raw.json()
    const availableItems: CollectionItem[] = []
    
    for (let item of branch_items.data) {
      
      //console.log(item);
      const newAvailableItem: CollectionItem = convertIntoCollectionItem(item, geolocation)

      // console.log(newAvailableItem);
      availableItems.push(newAvailableItem)
      
    }
    console.log(availableItems);
    setBranchItems(availableItems)
    
  }

  const getToken = async () => {
    const response = await fetch("/api/mapbox")
    const { token } = await response.json()
    mapboxgl.accessToken = token
  }

  useEffect(() => {
    const bounds = calculateNewPoints(geolocation!.lat, geolocation!.lng);
    
    getToken()

    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: "mapbox://styles/mapbox/streets-v12",
      // style: "mapbox://styles/maggalon/cm78j9w5200cm01r0ghcg1los",
      // center: [-87.661557, 41.893748],
      // zoom: 10.7,
      language: "auto",
      bounds: [[ bounds.sw.longitude, bounds.sw.latitude ],
               [ bounds.ne.longitude, bounds.ne.latitude ]]
    });

    // Map initialization code goes here
    const user_marker = document.createElement('div')
    user_marker.style.backgroundImage = "url(\"https://tan-worried-grasshopper-459.mypinata.cloud/ipfs/bafkreihkw4544lozfgjahd6acfgio3i2rmjgj7rteybdnkowuksswzkilu\")"
    user_marker.style.backgroundSize = 'cover'
    user_marker.style.width = '20px'
    user_marker.style.height = '20px'
    new mapboxgl.Marker(user_marker).setLngLat([geolocation!.lng, geolocation!.lat]).addTo(map)

    for (const mapItem of data!) {
      const el = document.createElement('div')
      el.style.backgroundImage = `url(${mapItem.company_map_pin})`
      el.style.backgroundSize = 'cover';
      el.style.width = '35px'; // Set appropriate width
      el.style.height = '41px';
      el.addEventListener('click', () => {
        setShowModal(true)
        setBranchInfo(mapItem)   
        handleMapPinClick(mapItem)     
      })

      const lat = Number(mapItem.coordinates.split(',')[0].replace('(', ''))
      const lng = Number(mapItem.coordinates.split(',')[1].replace(')', ''))
      const marker = new mapboxgl.Marker(el).setLngLat([lng, lat]).addTo(map)
      console.log(marker);
      
    }

    // map.on("load", function () {
    //   map.loadImage(
    //     "https://tan-worried-grasshopper-459.mypinata.cloud/ipfs/bafkreifq5aykj7ccu2q6fy2zdonugkx5qjkfrzy3ur6pv5aqvrul7vnzli",
    //     function (error, image) {
    //       if (error) throw error;
    //       map.addImage("custom-marker", image!);
    
    //       map.addSource("points", {
    //         type: "geojson",
    //         data: {
    //           type: "FeatureCollection",
    //           features: geoJson.features.map((point) => ({
    //             type: "Feature",
    //             geometry: {
    //               type: "Point",
    //               coordinates: point.geometry.coordinates
    //             },
    //             properties: {
    //               title: point.properties.title,
    //               description: point.properties.description
    //             }
    //           }))
    //         }
    //       });
    
    //       map.addLayer({
    //         id: "points",
    //         type: "symbol",
    //         source: "points",
    //         layout: {
    //           "icon-image": "custom-marker",
    //           "text-field": ["get", "title"],
    //           "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
    //           "text-offset": [0, 1.25],
    //           "text-anchor": "top"
    //         }
    //       });
          
    //       // map.on('click', 'points', (e) => {            
    //       //   const coordinates = e.features![0].geometry.coordinates.slice()
    //       //   const description = e.features![0].properties!.description;

    //       //   while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    //       //     coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    //       //   }

    //       //   new mapboxgl.Popup()
    //       //     .setLngLat(coordinates)
    //       //     .setHTML(`<p>${description}</p>`)
    //       //     .addTo(map);
    //       // })
    //     }
    //   );
    // });

    // map.on('click', (event) => {
    //   // If the user clicked on one of your markers, get its information.
    //   const features = map.queryRenderedFeatures(event.point, {
    //     layers: ['chicago-parks'] // replace with your layer name
    //   });
    //   if (!features.length) {
    //     return;
    //   }
    //   const feature = features[0];
    
    //   const popup = new mapboxgl.Popup({ offset: [0, -15] })
    //     .setLngLat(feature.geometry.coordinates)
    //     .setHTML(
    //       `<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`
    //     )
    //     .addTo(map);
    // });

    return () => map.remove();
  }, []);

  return (
    <div className="h-full">
      <div ref={mapContainerRef} 
         style={{ height: '100%' }}
         className="map-container" />
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setBranchInfo(null) }}>
        <>
        {branchInfo && 
        <div className="w-full">
          <div className="flex w-full justify-start items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-transparent flex items-center justify-center flex-shrink-0">
                <img src={branchInfo.company_logo} alt={branchInfo.company_name} className="w-full object-cover" />
            </div>
            <div className="flex-1">
                <h1 className="text-lg font-bold text-gray-900">{branchInfo.company_name}</h1>
                <div className="flex gap-1">
                  <span className="flex gap-1 text-xs text-gray-600">
                    {geolocation ? Number(calculateDistance(
                      geolocation.lat, 
                      geolocation.lng,
                      Number(branchInfo.coordinates.split(',')[0].replace('(', '')),
                      Number(branchInfo.coordinates.split(',')[1].replace(')', '')) 
                    ).toFixed(2)) : "--"}км <p>|</p>
                  </span>
                  <p className="text-gray-600 text-xs">{branchInfo.address.split(',').slice(0, 3).join(', ')}</p>
                </div>
            </div>
          </div>
          <div className='flex flex-col items-center gap-3 border-2 rounded-lg h-96 overflow-auto p-3 mt-5'>
              {branchItems && branchItems.map((item: CollectionItem) => {
                return (
                  <div key={item.id} onClick={() => setSelectedItem(item)} className="flex items-center justify-start w-full gap-2 shadow-md border rounded-lg p-2">
                    <div className="w-20 h-20 flex items-center justify-center">
                      <img src={item.menuItem.image} 
                           alt={item.menuItem.name}
                           className="w-20 h-20 rounded-lg object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="text-sm font-semibold">{item.menuItem.name}</div>
                      <div className="text-xs">{String(item.collectDay).charAt(0).toUpperCase() + String(item.collectDay).slice(1)} {item.collectTime}</div>
                      <div className="flex items-center gap-1 font-semibold"><Star className="w-4 h-4 text-primary-600 fill-primary-600" />{item.branch.rating || "--"}</div>
                    </div>
                    <div className="flex h-full flex-col justify-between items-end">
                      <div className="text-xs flex items-center justify-center gap-1 font-semibold bg-primary-200 p-1 rounded-full">{item.quantity}<p>шт.</p></div>
                      <div className="flex items-center font-semibold">₽{item.newPrice}</div>
                    </div>
                  </div>
                )
              })

              }  
          </div>
        </div>
        }
        </>
      </Modal>
    </div>
    
  );
};

export default Map;