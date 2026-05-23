"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createTestimonial, updateTestimonial, deleteTestimonial } from "@/actions/admin";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", role: "", content: "", rating: 5, featured: false, order: 0 });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) {
      await updateTestimonial(editing, formData);
    } else {
      await createTestimonial(formData);
    }
    setEditing(null);
    setShowForm(false);
    setFormData({ name: "", role: "", content: "", rating: 5, featured: false, order: 0 });
  }

  async function handleDelete(id: string) {
    if (confirm("Are you sure?")) {
      await deleteTestimonial(id);
    }
  }

  function handleEdit(testimonial: any) {
    setEditing(testimonial.id);
    setFormData({
      name: testimonial.name,
      role: testimonial.role,
      content: testimonial.content,
      rating: testimonial.rating,
      featured: testimonial.featured,
      order: testimonial.order,
    });
    setShowForm(true);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy">Testimonials</h1>
        <Button onClick={() => setShowForm(!showForm)} variant="gold">
          <Plus className="h-4 w-4 mr-2" />
          Add Testimonial
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 rounded-xl border bg-white p-6">
          <h3 className="text-lg font-semibold text-navy mb-4">
            {editing ? "Edit Testimonial" : "Add New Testimonial"}
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
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                rows={3}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="rating">Rating (1-5)</Label>
                <Input
                  id="rating"
                  type="number"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="order">Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                />
              </div>
              <div className="flex items-center pt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-navy">Featured</span>
                </label>
              </div>
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

      <div className="mt-6 space-y-4">
        {testimonials.map((t) => (
          <div key={t.id} className="rounded-xl border bg-white p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-medium text-navy">{t.name} — {t.role}</p>
                <p className="text-sm text-navy/70 mt-1">&ldquo;{t.content}&rdquo;</p>
                <div className="flex gap-4 mt-2 text-xs text-navy/50">
                  <span>Rating: {t.rating}/5</span>
                  <span>Featured: {t.featured ? "Yes" : "No"}</span>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <Button size="sm" variant="outline" onClick={() => handleEdit(t)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(t.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        {testimonials.length === 0 && <p className="text-center text-navy/50 py-8">No testimonials yet. Add your first testimonial.</p>}
      </div>
    </div>
  );
}
