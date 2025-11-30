import NoteCard from "./NoteCard";
import type { Note } from "../types/note";

interface NotesGridProps {
  loading: boolean;
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (id: number) => void;
  onArchive: (id: number, currentStatus: boolean) => void;
  onRemoveCategory: (noteId: number, catId: number) => void;
  showArchived: boolean;
}

export default function NotesGrid({
  loading,
  notes,
  onEdit,
  onDelete,
  onArchive,
  onRemoveCategory,
  showArchived,
}: NotesGridProps) {
  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-500 mx-auto" />
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
        <p className="text-gray-500 text-lg">
          {showArchived
            ? "No archived notes found."
            : "No active notes found. Create your first one!"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onEdit={onEdit}
          onDelete={onDelete}
          onArchive={onArchive}
          onRemoveCategory={onRemoveCategory}
        />
      ))}
    </div>
  );
}