import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Download, Pencil, Save, X, Calendar, User } from "lucide-react";
import { AppLayout, Tag, type FilterState } from "@/components/AppLayout";
import { getDoc, deleteDoc } from "@/lib/ikms-store";
import { api } from "@/lib/api";

export const Route = createFileRoute("/document/$id")({
  component: DocDetail,
  notFoundComponent: () => (
    <div className="p-12 text-center">
      <h1 className="text-2xl font-bold mb-2">Document not found</h1>
      <Link to="/" className="text-primary hover:underline">Back to dashboard</Link>
    </div>
  ),
});

function DocDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const doc = getDoc(id);
  const [filters, setFilters] = useState<FilterState>({ 
    categories: new Set(), 
    departments: new Set() 
  });

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(doc?.title || "");
  const [editDescription, setEditDescription] = useState(doc?.description || "");
  const [editTags, setEditTags] = useState(doc?.tags.join(", ") || "");
  const [saving, setSaving] = useState(false);

  if (!doc) {
    return (
      <AppLayout filters={filters} onFiltersChange={setFilters}>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold mb-2">Document not found</h1>
          <Link to="/" className="text-primary hover:underline">
            Back to dashboard
          </Link>
        </div>
      </AppLayout>
    );
  }

  // Download handler
  const handleDownload = async () => {
    try {
      if (doc.fileName) {
        const url = `http://localhost:5000/uploads/${doc.fileName}`;
        const a = document.createElement("a");
        a.href = url;
        a.download = doc.fileName;
        a.click();
      } else {
        // No file — download as text
        const content = `Title: ${doc.title}\nCategory: ${doc.category}\nDepartment: ${doc.department}\nDescription: ${doc.description}\nTags: ${doc.tags.join(", ")}`;
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${doc.title}.txt`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  // Save edit handler
  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`http://localhost:5000/api/documents/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          tags: editTags.split(",").map((t) => t.trim()).filter(Boolean),
        }),
      });
      setIsEditing(false);
      navigate({ to: "/" });
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  // Delete handler
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this document?")) {
      await deleteDoc(id);
      navigate({ to: "/" });
    }
  };

  const inputCls = "w-full h-10 px-3 rounded-md border border-input bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";

  return (
    <AppLayout filters={filters} onFiltersChange={setFilters}>
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate({ to: "/" })}
          className="inline-flex items-center gap-2 text-primary font-semibold mb-6 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <article className="bg-card rounded-lg border shadow-sm p-8">

          {/* Title */}
          {isEditing ? (
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className={`${inputCls} text-2xl font-bold mb-4`}
            />
          ) : (
            <h1 className="text-3xl font-bold tracking-tight mb-4">
              {doc.title}
            </h1>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            <Tag>{doc.category}</Tag>
            <Tag>{doc.department}</Tag>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground border-y py-3 mb-6">
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Uploaded {doc.uploadedAt}
            </span>
            <span className="inline-flex items-center gap-2">
              <User className="h-4 w-4" /> By {doc.uploadedBy}
            </span>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Description
            </h3>
            {isEditing ? (
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 rounded-md border border-input bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            ) : (
              <p className="text-foreground leading-relaxed">
                {doc.description}
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Tags
            </h3>
            {isEditing ? (
              <input
                value={editTags}
                onChange={(e) => setEditTags(e.target.value)}
                placeholder="tag1, tag2, tag3"
                className={inputCls}
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {doc.tags.map((t) => <Tag key={t}>{t}</Tag>)}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 flex-wrap">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-2 h-10 px-5 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="inline-flex items-center gap-2 h-10 px-5 rounded-md border-2 border-primary text-primary text-sm font-semibold hover:bg-primary/5 transition"
                >
                  <X className="h-4 w-4" /> Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 h-10 px-5 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition"
                >
                  <Download className="h-4 w-4" /> Download
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-2 h-10 px-5 rounded-md border-2 border-primary text-primary text-sm font-semibold hover:bg-primary/5 transition"
                >
                  <Pencil className="h-4 w-4" /> Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center gap-2 h-10 px-5 rounded-md border-2 border-red-500 text-red-500 text-sm font-semibold hover:bg-red-50 transition"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </article>
      </div>
    </AppLayout>
  );
}