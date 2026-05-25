"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createArea, updateArea, deleteArea } from "@/actions/admin";
import { Plus, Pencil, Trash2 } from "lucide-react";

// Character counter component
function CharacterCounter({ value, maxLength }: { value: string; maxLength: number }) {
  const count = value?.length || 0;
  const isOverLimit = count > maxLength;
  return (
    <span className={`text-xs ${isOverLimit ? 'text-red-500' : 'text-navy/50'}`}>
      {count}/{maxLength}
    </span>
  );
}

export default function AdminAreasPage() {
  const [areas, setAreas] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    content: "",
    image: "",
    seoTitle: "",
    seoDescription: "",
    featured: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAreas();
    fetchProperties();
  }, []);

  async function fetchAreas() {
    try {
      const res = await fetch("/api/admin/areas");
      if (res.ok) {
        const data = await res.json();
        setAreas(data);
      }
    } catch (error) {
      console.error("Failed to fetch areas:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchProperties() {
    try {
      // Skip fetching properties to avoid 500 error
      // Properties can be selected by ID manually
      setProperties([]);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) {
      await updateArea(editing, formData);
    } else {
      await createArea(formData);
    }
    setEditing(null);
    setShowForm(false);
    setFormData({
      name: "",
      slug: "",
      description: "",
      content: "",
      image: "",
      seoTitle: "",
      seoDescription: "",
      featured: false,
    });
    fetchAreas();
  }

  async function handleDelete(id: string) {
    if (confirm("Are you sure?")) {
      await deleteArea(id);
      fetchAreas();
    }
  }

  function handleEdit(area: any) {
    setEditing(area.id);
    setFormData({
      name: area.name,
      slug: area.slug,
      description: area.description || "",
      content: area.content || "",
      image: area.image || "",
      seoTitle: area.seoTitle || "",
      seoDescription: area.seoDescription || "",
      featured: area.featured,
    });
    setShowForm(true);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy">Areas</h1>
        <Button onClick={() => setShowForm(!showForm)} variant="gold">
          <Plus className="h-4 w-4 mr-2" />
          Add Area
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 rounded-xl border bg-white p-6">
          <h3 className="text-lg font-semibold text-navy mb-4">
            {editing ? "Edit Area" : "Add New Area"}
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Short Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="content">Content (HTML)</Label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={10}
                className="w-full rounded-md border px-3 py-2 text-sm"
                placeholder="Enter HTML content with links and images..."
              />
            </div>
            <div>
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="seoTitle">SEO Title</Label>
                <CharacterCounter value={formData.seoTitle} maxLength={60} />
              </div>
              <Input
                id="seoTitle"
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                placeholder="Optional: Custom title for search engines (max 60 chars)"
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="seoDescription">SEO Description</Label>
                <CharacterCounter value={formData.seoDescription} maxLength={160} />
              </div>
              <textarea
                id="seoDescription"
                value={formData.seoDescription}
                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                rows={3}
                className="w-full rounded-md border px-3 py-2 text-sm"
                placeholder="Optional: Custom description for search engines (max 160 chars)"
              />
            </div>
            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm text-navy">Featured Area</span>
              </label>
            </div>
            <div className="flex gap-2">
              <Button type="submit" variant="gold">
                {editing ? "Update" : "Create"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </form>
      )}

      <div className="mt-6 overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-navy/5">
            <tr className="text-left text-navy/60">
              <th className="p-4">Name</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Featured</th>
              <th className="p-4">Link</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-navy/50">Loading...</td>
              </tr>
            ) : (
              areas.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="p-4">{a.name}</td>
                  <td className="p-4">{a.slug}</td>
                  <td className="p-4">{a.featured ? "Yes" : "No"}</td>
                  <td className="p-4">
                    <Link href={`/areas/${a.slug}`} className="text-gold hover:underline">View</Link>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(a)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(a.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
