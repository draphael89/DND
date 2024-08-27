import React from 'react';
import { InventoryItem } from '../interfaces/gameInterfaces';

interface InventoryProps {
  items: InventoryItem[];
  onUseItem: (item: InventoryItem) => void;
}

const Inventory: React.FC<InventoryProps> = ({ items, onUseItem }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl font-display text-accent-400 mb-4">Inventory</h2>
      {items.length === 0 ? (
        <p className="text-gray-400">Your inventory is empty.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id} className="flex justify-between items-center">
              <span className="text-gray-300">{item.name} (x{item.quantity})</span>
              <button
                onClick={() => onUseItem(item)}
                className="px-2 py-1 bg-accent-500 text-white rounded hover:bg-accent-600 transition-colors"
              >
                Use
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Inventory;