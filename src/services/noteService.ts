import api from "../utils/api";
import type {
  Note,
  CreateNoteDto,
  UpdateNoteDto,
  Category,
} from "../types/note";

export const noteService = {
  // Notas
  getAll: async (archived: boolean) => {
    const { data } = await api.get<Note[]>("/api/v1/notes", {
      params: { archived },
    });
    return data;
  },
  getById: async (id: number) => {
    const { data } = await api.get<Note>(`/api/v1/notes/${id}`);
    return data;
  },
  create: async (note: CreateNoteDto) => {
    const { data } = await api.post<Note>("/api/v1/notes", note);
    return data;
  },
  update: async (id: number, note: UpdateNoteDto) => {
    const { data } = await api.put<Note>(`/api/v1/notes/${id}`, note);
    return data;
  },
  delete: async (id: number) => {
    await api.delete(`/api/v1/notes/${id}`);
  },
  archive: async (id: number) => {
    await api.patch(`/api/v1/notes/${id}/archive`);
  },
  unarchive: async (id: number) => {
    await api.patch(`/api/v1/notes/${id}/unarchive`);
  },

  // Categorías
  getCategories: async () => {
    const { data } = await api.get<Category[]>("/api/v1/categories");
    return data;
  },
  createCategory: async (name: string) => {
    const { data } = await api.post<Category>("/api/v1/categories", { name });
    return data;
  },
  deleteCategory: async (id: number) => {
    await api.delete(`/api/v1/categories/${id}`);
  },
  addCategoryToNote: async (noteId: number, categoryId: number) => {
    await api.post(`/api/v1/notes/${noteId}/categories/${categoryId}`);
  },
  removeCategoryFromNote: async (noteId: number, categoryId: number) => {
    await api.delete(`/api/v1/notes/${noteId}/categories/${categoryId}`);
  },
};
