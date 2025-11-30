import { useState } from "react";
import type { Note, Category } from "../../types/note";

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  noteToEdit: Note | null;
  categories: Category[];
  onSave: (
    noteId: number | null,
    data: { title: string; content: string },
    selectedCategoryIds: number[]
  ) => Promise<void>;
}

export default function NoteModal({
  isOpen,
  onClose,
  noteToEdit,
  categories,
  onSave,
}: NoteModalProps) {
  const [formData, setFormData] = useState({
    title: noteToEdit?.title || "",
    content: noteToEdit?.content || "",
  });

  const [selectedCats, setSelectedCats] = useState<string[]>(
    noteToEdit?.categories.map((c) => c.id.toString()) || []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ids = selectedCats.map((id) => parseInt(id));
    onSave(noteToEdit?.id || null, formData, ids);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg z-10 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">
            {noteToEdit ? "Edit Note" : "Create New Note"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              required
              className="w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Buy groceries..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              required
              rows={4}
              className="w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              placeholder="Milk, Eggs, Bread..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Add Categories
            </label>
            <select
              multiple
              className="w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
              value={selectedCats}
              onChange={(e) => {
                const options = Array.from(
                  e.target.selectedOptions,
                  (option) => option.value
                );
                setSelectedCats(options);
              }}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Hold Ctrl/Cmd to select multiple
            </p>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition-colors shadow-sm"
            >
              Save Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
