"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createFAQ, updateFAQ, deleteFAQ } from "@/actions/admin";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ question: "", answer: "", category: "General", order: 0 });

  // This would be fetched from server in real implementation
  // For now, showing the UI structure

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) {
      await updateFAQ(editing, formData);
    } else {
      await createFAQ(formData);
    }
    setEditing(null);
    setShowForm(false);
    setFormData({ question: "", answer: "", category: "General", order: 0 });
    // In real implementation, refetch data
  }

  async function handleDelete(id: string) {
    if (confirm("Are you sure?")) {
      await deleteFAQ(id);
      // In real implementation, refetch data
    }
  }

  function handleEdit(faq: any) {
    setEditing(faq.id);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      order: faq.order,
    });
    setShowForm(true);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy">FAQs</h1>
        <Button onClick={() => setShowForm(!showForm)} variant="gold">
          <Plus className="h-4 w-4 mr-2" />
          Add FAQ
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 rounded-xl border bg-white p-6">
          <h3 className="text-lg font-semibold text-navy mb-4">
            {editing ? "Edit FAQ" : "Add New FAQ"}
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="question">Question</Label>
              <Input
                id="question"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="answer">Answer</Label>
              <Textarea
                id="answer"
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                required
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
        {faqs.map((f) => (
          <div key={f.id} className="rounded-xl border bg-white p-4 flex justify-between items-start">
            <div className="flex-1">
              <p className="font-medium text-navy">{f.question}</p>
              <p className="text-sm text-navy/70 mt-2">{f.answer}</p>
              <p className="text-xs text-navy/50 mt-1">Category: {f.category}</p>
            </div>
            <div className="flex gap-2 ml-4">
              <Button size="sm" variant="outline" onClick={() => handleEdit(f)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleDelete(f.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        {faqs.length === 0 && <p className="text-center text-navy/50 py-8">No FAQs yet. Add your first FAQ.</p>}
      </div>
    </div>
  );
}
