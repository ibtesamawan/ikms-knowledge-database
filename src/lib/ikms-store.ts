import { useSyncExternalStore } from "react";

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

let docs: Doc[] = [
  { id: "1", title: "Employee Code of Conduct", category: "Policies", department: "HR", description: "Official employee conduct, ethics and workplace behavior policy.", tags: ["conduct", "ethics"], uploadedBy: "Sarah Chen", uploadedAt: "2025-03-12" },
  { id: "2", title: "Remote Work Policy 2025", category: "Policies", department: "HR", description: "Updated guidelines for hybrid and remote work arrangements.", tags: ["remote", "hybrid"], uploadedBy: "Sarah Chen", uploadedAt: "2025-04-02" },
  { id: "3", title: "Cybersecurity Onboarding", category: "Training Materials", department: "IT", description: "Mandatory security awareness training for all new hires.", tags: ["security", "onboarding"], uploadedBy: "Mark Liu", uploadedAt: "2025-02-21" },
  { id: "4", title: "Q1 Financial Report", category: "Reports", department: "Finance", description: "Quarterly performance and budget analysis for Q1 2025.", tags: ["quarterly", "budget"], uploadedBy: "Anita Roy", uploadedAt: "2025-04-15" },
  { id: "5", title: "Brand Style Guidelines", category: "Guidelines", department: "Marketing", description: "Logo usage, typography, color palette and tone of voice.", tags: ["brand", "design"], uploadedBy: "Diego Park", uploadedAt: "2025-01-30" },
  { id: "6", title: "IT Support FAQ", category: "FAQs", department: "IT", description: "Common questions about VPN, password reset and ticketing.", tags: ["support", "vpn"], uploadedBy: "Mark Liu", uploadedAt: "2025-03-05" },
  { id: "7", title: "Expense Reimbursement Guide", category: "Guidelines", department: "Finance", description: "How to file expense claims and approval workflow.", tags: ["expenses"], uploadedBy: "Anita Roy", uploadedAt: "2025-02-10" },
  { id: "8", title: "Campaign Launch Playbook", category: "Training Materials", department: "Marketing", description: "Step-by-step playbook to launch a multi-channel campaign.", tags: ["campaign", "launch"], uploadedBy: "Diego Park", uploadedAt: "2025-03-28" },
];

const listeners = new Set<() => void>();
const subscribe = (l: () => void) => { listeners.add(l); return () => listeners.delete(l); };
const emit = () => listeners.forEach((l) => l());

export const useDocs = () => useSyncExternalStore(subscribe, () => docs, () => docs);

export const addDoc = (d: Omit<Doc, "id" | "uploadedAt" | "uploadedBy">) => {
  const newDoc: Doc = { ...d, id: String(Date.now()), uploadedAt: new Date().toISOString().slice(0, 10), uploadedBy: "Current User" };
  docs = [newDoc, ...docs];
  emit();
  return newDoc;
};

export const getDoc = (id: string) => docs.find((d) => d.id === id);
