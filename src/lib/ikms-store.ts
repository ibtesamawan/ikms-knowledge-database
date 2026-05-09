import { useSyncExternalStore } from "react";
import { api } from "./api";

export type Category = "Policies" | "Training Materials" | "Reports" | "Guidelines" | "FAQs";
export type Department = "HR" | "IT" | "Finance" | "Marketing";

export interface Doc {
  id: string;
  title: string;
  category: Category;
  department: Department;
  description: string;
  tags: string[];
  uploadedBy: string;
  uploadedAt: string;
  fileName?: string;
}

export const CATEGORIES: Category[] = ["Policies", "Training Materials", "Reports", "Guidelines", "FAQs"];
export const DEPARTMENTS: Department[] = ["HR", "IT", "Finance", "Marketing"];

let docs: Doc[] = [];

const listeners = new Set<() => void>();
const subscribe = (l: () => void) => { 
  listeners.add(l); 
  return () => listeners.delete(l); 
};
const emit = () => listeners.forEach((l) => l());

// Load from backend
export const loadDocs = async () => {
  try {
    const data = await api.getDocuments();
    docs = data.map((d: any) => ({
      id: d._id,
      title: d.title,
      category: d.category,
      department: d.department,
      description: d.description,
      tags: d.tags || [],
      uploadedBy: d.uploadedBy || "Admin",
      uploadedAt: d.uploadDate 
        ? new Date(d.uploadDate).toISOString().slice(0, 10) 
        : new Date().toISOString().slice(0, 10),
      fileName: d.fileName,
    }));
    emit();
  } catch (err) {
    console.error("Failed to load docs:", err);
  }
};

export const useDocs = () => 
  useSyncExternalStore(subscribe, () => docs, () => docs);

export const addDoc = async (
  formData: FormData
) => {
  try {
    await api.uploadDocument(formData);
    await loadDocs();
  } catch (err) {
    console.error("Failed to add doc:", err);
  }
};

export const deleteDoc = async (id: string) => {
  try {
    await api.deleteDocument(id);
    docs = docs.filter((d) => d.id !== id);
    emit();
  } catch (err) {
    console.error("Failed to delete doc:", err);
  }
};

export const getDoc = (id: string) => 
  docs.find((d) => d.id === id);

// Load on startup
loadDocs();