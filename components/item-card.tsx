import { Heart } from "lucide-react";
import { CollectionItem } from "../lib/types";

interface ItemCardProps {
    item: CollectionItem;
    setSelectedItem: (selectedItem: CollectionItem | null) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, setSelectedItem }) => {
    return (
          <div 
            className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            onClick={() => setSelectedItem(item)}
          >
            <div className="relative">
              <img src={item.menuItem.image} alt={item.menuItem.name} className="w-full h-48 object-cover" />
              {/* <button 
                className="absolute top-4 right-4 p-2 rounded-full bg-white hover:bg-primary-50 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle favorite toggle
                }}
              >
                <Heart className="w-5 h-5 text-gray-600 hover:text-primary-600" />
              </button> */}
              <div className="absolute bottom-4 left-4 bg-white px-2 py-1 rounded-full text-sm font-medium text-primary-600">
                {item.quantity} осталось
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-full bg-transparent flex items-center justify-center">
                  {/* <span className="text-white text-xs">Logo</span> */}
                  <img src={item.company.logo} alt={item.company.name} className="w-full rounded-full object-cover" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{item.menuItem.name}</h3>
                  <p className="text-sm text-gray-600">{item.company.name}</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm mb-2">Забери {item.collectDay} {item.collectTime}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-primary-600 font-semibold">★ {item.branch.rating || '--'}</span>
                  <span className="text-gray-600">{item.branch.distance + 'км' || '-- км'}</span>
                </div>
                <div className="text-right">
                  <span className="text-gray-400 line-through text-sm">₽{item.menuItem.initialPrice}</span>
                  <span className="text-primary-600 font-bold ml-2">₽{item.newPrice}</span>
                </div>
              </div>
            </div>
          </div>
    )
}