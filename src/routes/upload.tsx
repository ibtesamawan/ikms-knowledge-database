import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { AppLayout, type FilterState } from "@/components/AppLayout";
import { addDoc, CATEGORIES, DEPARTMENTS, type Category, type Department } from "@/lib/ikms-store";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Upload Document — IKMS" },
      { name: "description", content: "Add a new document to the knowledge base." },
    ],
  }),
  component: UploadPage,
});

function UploadPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FilterState>({ 
    categories: new Set(), 
    departments: new Set() 
  });
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("Policies");
  const [department, setDepartment] = useState<Department>("HR");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("department", department);
      formData.append("description", description);
      formData.append("tags", tags);
      if (file) {
        formData.append("file", file);
      }

      await addDoc(formData);

      setSuccess(true);
      setTitle("");
      setDescription("");
      setTags("");
      setFileName("");
      setFile(null);

      setTimeout(() => navigate({ to: "/" }), 1500);

    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full h-10 px-3 rounded-md border border-input bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";

  return (
    <AppLayout filters={filters} onFiltersChange={setFilters}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Upload Document
        </h1>
        <p className="text-muted-foreground mb-8">
          Add a new document to the IKMS knowledge base.
        </p>

        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800">
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-sm font-medium">
              Document uploaded successfully! Redirecting...
            </span>
          </div>
        )}

        <form onSubmit={onSubmit} className="bg-card rounded-lg border shadow-sm p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-1.5">
              Document Title
            </label>
            <input 
              required 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className={inputCls} 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">
                Category
              </label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value as Category)} 
                className={inputCls}
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">
                Department
              </label>
              <select 
                value={department} 
                onChange={(e) => setDepartment(e.target.value as Department)} 
                className={inputCls}
              >
                {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">
              Description
            </label>
            <textarea 
              required 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              rows={4}
              className="w-full px-3 py-2 rounded-md border border-input bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">
              Tags{" "}
              <span className="text-muted-foreground font-normal">
                (comma separated)
              </span>
            </label>
            <input 
              value={tags} 
              onChange={(e) => setTags(e.target.value)} 
              placeholder="e.g. onboarding, security" 
              className={inputCls} 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">
              File Upload
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <span className="inline-flex items-center justify-center h-10 px-4 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition">
                Choose File
              </span>
              <span className="text-sm text-muted-foreground">
                {fileName || "PDF, DOCX, TXT only"}
              </span>
              <input 
                type="file" 
                accept=".pdf,.docx,.txt" 
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setFile(f);
                    setFileName(f.name);
                  }
                }} 
              />
            </label>
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={loading}
              className="h-11 px-8 rounded-md bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition disabled:opacity-50"
            >
              {loading ? "Uploading..." : "Submit Document"}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}