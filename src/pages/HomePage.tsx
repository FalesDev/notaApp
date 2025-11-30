import { useState, useEffect, useMemo, useCallback } from "react";
import useAuth from "../context/useAuth";
import Container from "../layouts/Container";
import { noteService } from "../services/noteService";
import type { Note, Category } from "../types/note";
import { HiPlus } from "react-icons/hi";

import NotesToolbar from "../components/NotesToolbar";
import NotesGrid from "../components/NotesGrid";
import NoteModal from "../components/modals/NoteModal";
import CategoryManagerModal from "../components/modals/CategoryManagerModal";

export default function HomePage() {
  const { user } = useAuth();

  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("");

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [notesData, catsData] = await Promise.all([
        noteService.getAll(showArchived),
        noteService.getCategories(),
      ]);
      setNotes(notesData);
      setCategories(catsData);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  }, [user, showArchived]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaveNote = async (
    noteId: number | null,
    data: { title: string; content: string },
    selectedCategoryIds: number[]
  ) => {
    try {
      let savedNote: Note;

      if (noteId) {
        savedNote = await noteService.update(noteId, data);

        const currentNote = notes.find((n) => n.id === noteId);
        if (currentNote) {
          const categoriesToAdd = selectedCategoryIds.filter(
            (selId) =>
              !currentNote.categories.some((existing) => existing.id === selId)
          );

          const categoriesToRemove = currentNote.categories.filter(
            (existing) => !selectedCategoryIds.includes(existing.id)
          );

          await Promise.all([
            ...categoriesToAdd.map((catId) =>
              noteService.addCategoryToNote(savedNote.id, catId)
            ),
            ...categoriesToRemove.map((cat) =>
              noteService.removeCategoryFromNote(savedNote.id, cat.id)
            ),
          ]);
        }
      } else {
        savedNote = await noteService.create(data);
        await Promise.all(
          selectedCategoryIds.map((catId) =>
            noteService.addCategoryToNote(savedNote.id, catId)
          )
        );
      }

      setIsNoteModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error saving note", error);
    }
  };

  const handleDeleteNote = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      await noteService.delete(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleArchiveToggle = async (id: number, currentStatus: boolean) => {
    try {
      setNotes((prev) => prev.filter((n) => n.id !== id));
      if (currentStatus) await noteService.unarchive(id);
      else await noteService.archive(id);
    } catch (error) {
      console.error(error);
      fetchData();
    }
  };

  const handleCreateCategory = async (name: string) => {
    try {
      await noteService.createCategory(name);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("Delete category?")) return;
    try {
      await noteService.deleteCategory(id);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveCategoryFromNote = async (
    noteId: number,
    catId: number
  ) => {
    try {
      await noteService.removeCategoryFromNote(noteId, catId);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const openCreateModal = () => {
    setEditingNote(null);
    setIsNoteModalOpen(true);
  };

  const openEditModal = (note: Note) => {
    setEditingNote(note);
    setIsNoteModalOpen(true);
  };

  const filteredNotes = useMemo(() => {
    return notes.filter((note) =>
      filterCategory
        ? note.categories?.some((c) => c.id.toString() === filterCategory)
        : true
    );
  }, [notes, filterCategory]);

  if (!user) {
    return (
      <Container className="py-20 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
          Welcome to <span className="text-yellow-500">Note App</span>
        </h1>
        <div className="flex justify-center gap-4">
          <img
            src="/logo.png"
            alt="App Logo"
            className="w-32 h-32 opacity-20"
          />
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user.firstName} {user.lastName}
          </h1>
          <p className="text-gray-500 mt-1">
            {showArchived
              ? `Viewing ${notes.length} archived notes`
              : `You have ${notes.length} active notes`}
          </p>
        </div>
        {!showArchived && (
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
          >
            <HiPlus className="text-lg" /> Create Note
          </button>
        )}
      </div>

      {/* 2. Toolbar (Filters & Manage Categories) */}
      <NotesToolbar
        showArchived={showArchived}
        setShowArchived={setShowArchived}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        categories={categories}
        onManageCategories={() => setIsCatModalOpen(true)}
      />

      {/* 3. Notes Grid */}
      <NotesGrid
        loading={loading}
        notes={filteredNotes}
        showArchived={showArchived}
        onEdit={openEditModal}
        onDelete={handleDeleteNote}
        onArchive={handleArchiveToggle}
        onRemoveCategory={handleRemoveCategoryFromNote}
      />

      {/* 4. Modals */}
      {isNoteModalOpen && (
        <NoteModal
          isOpen={isNoteModalOpen}
          onClose={() => setIsNoteModalOpen(false)}
          noteToEdit={editingNote}
          categories={categories}
          onSave={handleSaveNote}
        />
      )}

      <CategoryManagerModal
        isOpen={isCatModalOpen}
        onClose={() => setIsCatModalOpen(false)}
        categories={categories}
        onCreate={handleCreateCategory}
        onDelete={handleDeleteCategory}
      />
    </Container>
  );
}
