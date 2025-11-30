import { useState } from "react";
import type { Category } from "../../types/note";

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onCreate: (name: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function CategoryManagerModal({
  isOpen,
  onClose,
  categories,
  onCreate,
  onDelete,
}: CategoryManagerModalProps) {
  const [newCatName, setNewCatName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    await onCreate(newCatName);
    setNewCatName("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm z-10 overflow-hidden p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Manage Categories
        </h3>

        <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="New category..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-yellow-500 outline-none"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
          />
          <button
            type="submit"
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-600"
          >
            Add
          </button>
        </form>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex justify-between items-center bg-gray-50 p-2 rounded"
            >
              <span className="text-sm text-gray-700">{cat.name}</span>
              <button
                onClick={() => onDelete(cat.id)}
                className="text-red-500 hover:text-red-700 text-sm px-2"
              >
                Delete
              </button>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-sm text-gray-400 text-center">
              No categories yet.
            </p>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}