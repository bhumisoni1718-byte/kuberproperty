"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createTeamMember, updateTeamMember, deleteTeamMember } from "@/actions/admin";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminTeamPage() {
  const [team, setTeam] = useState<any[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", role: "", bio: "", order: 0 });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) {
      await updateTeamMember(editing, formData);
    } else {
      await createTeamMember(formData);
    }
    setEditing(null);
    setShowForm(false);
    setFormData({ name: "", role: "", bio: "", order: 0 });
  }

  async function handleDelete(id: string) {
    if (confirm("Are you sure?")) {
      await deleteTeamMember(id);
    }
  }

  function handleEdit(member: any) {
    setEditing(member.id);
    setFormData({
      name: member.name,
      role: member.role,
      bio: member.bio,
      order: member.order,
    });
    setShowForm(true);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy">Team Members</h1>
        <Button onClick={() => setShowForm(!showForm)} variant="gold">
          <Plus className="h-4 w-4 mr-2" />
          Add Team Member
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 rounded-xl border bg-white p-6">
          <h3 className="text-lg font-semibold text-navy mb-4">
            {editing ? "Edit Team Member" : "Add New Team Member"}
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
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                required
                rows={3}
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

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {team.map((m) => (
          <div key={m.id} className="rounded-xl border bg-white p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-semibold text-navy">{m.name}</p>
                <p className="text-sm text-gold">{m.role}</p>
                <p className="text-sm text-navy/70 mt-2">{m.bio}</p>
              </div>
              <div className="flex gap-2 ml-4">
                <Button size="sm" variant="outline" onClick={() => handleEdit(m)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(m.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        {team.length === 0 && <p className="text-center text-navy/50 py-8 col-span-2">No team members yet. Add your first team member.</p>}
      </div>
    </div>
  );
}
