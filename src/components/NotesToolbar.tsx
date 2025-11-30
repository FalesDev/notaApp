import { HiFilter } from "react-icons/hi";
import type { Category } from "../types/note";

interface NotesToolbarProps {
  showArchived: boolean;
  setShowArchived: (show: boolean) => void;
  filterCategory: string;
  setFilterCategory: (id: string) => void;
  categories: Category[];
  onManageCategories: () => void;
}

export default function NotesToolbar({
  showArchived,
  setShowArchived,
  filterCategory,
  setFilterCategory,
  categories,
  onManageCategories,
}: NotesToolbarProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
      {/* Toggle Archived */}
      <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
        <button
          onClick={() => setShowArchived(false)}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            !showArchived
              ? "bg-yellow-100 text-yellow-800"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          Active Notes
        </button>
        <button
          onClick={() => setShowArchived(true)}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            showArchived
              ? "bg-yellow-100 text-yellow-800"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          Archived
        </button>
      </div>

      {/* Category Filter & Manage */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <HiFilter className="text-gray-400" />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="block w-full sm:w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm rounded-md border"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <button
          onClick={onManageCategories}
          className="text-sm text-blue-600 hover:text-blue-800 underline ml-2"
        >
          Manage Tags
        </button>
      </div>
    </div>
  );
}
