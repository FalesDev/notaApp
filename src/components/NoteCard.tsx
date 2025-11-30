import { HiArchive, HiPencil, HiTrash, HiUpload } from "react-icons/hi";
import type { Note } from "../types/note";

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: number) => void;
  onArchive: (id: number, currentStatus: boolean) => void;
  onRemoveCategory: (noteId: number, catId: number) => void;
}

export default function NoteCard({
  note,
  onEdit,
  onDelete,
  onArchive,
  onRemoveCategory,
}: NoteCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-gray-800">{note.title}</h3>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(note)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
            title="Edit"
          >
            <HiPencil />
          </button>
          <button
            onClick={() => onArchive(note.id, note.archived)}
            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-full"
            title={note.archived ? "Unarchive" : "Archive"}
          >
            {note.archived ? <HiUpload /> : <HiArchive />}
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full"
            title="Delete"
          >
            <HiTrash />
          </button>
        </div>
      </div>

      <p className="text-gray-600 whitespace-pre-wrap mb-4 grow">
        {note.content}
      </p>

      {/* Categories Badge Area */}
      <div className="flex flex-wrap gap-2 mt-auto pt-3 border-t border-gray-100">
        {note.categories?.map((cat) => (
          <span
            key={cat.id}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
          >
            {cat.name}
            <button
              onClick={() => onRemoveCategory(note.id, cat.id)}
              className="ml-1.5 text-yellow-900 hover:text-yellow-600 focus:outline-none"
            >
              &times;
            </button>
          </span>
        ))}
        {(!note.categories || note.categories.length === 0) && (
          <span className="text-xs text-gray-400 italic">No categories</span>
        )}
      </div>
    </div>
  );
}
