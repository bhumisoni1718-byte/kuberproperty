"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { upsertSiteSetting } from "@/actions/admin";
import { Save } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ key: "", value: "" });
  const [loading, setLoading] = useState(true);

  async function fetchSettings() {
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSettings();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const parsedValue = JSON.parse(formData.value);
      await upsertSiteSetting(formData.key, parsedValue);
      setEditing(null);
      setShowForm(false);
      setFormData({ key: "", value: "" });
      fetchSettings();
    } catch (error) {
      alert("Invalid JSON value. Please enter valid JSON.");
    }
  }

  function handleEdit(setting: any) {
    setEditing(setting.key);
    setFormData({
      key: setting.key,
      value: JSON.stringify(setting.value, null, 2),
    });
    setShowForm(true);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy">Site Settings</h1>
        <Button onClick={() => setShowForm(!showForm)} variant="gold">
          <Save className="h-4 w-4 mr-2" />
          Add Setting
        </Button>
      </div>
      <p className="text-sm text-navy/60 mt-2">
        CMS settings stored as key-value JSON. Use this to update homepage, hero, footer & SEO content without code changes.
      </p>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 rounded-xl border bg-white p-6">
          <h3 className="text-lg font-semibold text-navy mb-4">
            {editing ? "Edit Setting" : "Add New Setting"}
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="key">Key</Label>
              <Input
                id="key"
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                required
                disabled={!!editing}
              />
            </div>
            <div>
              <Label htmlFor="value">Value (JSON)</Label>
              <Textarea
                id="value"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                required
                rows={8}
                className="font-mono text-sm"
                placeholder='{"title": "Example", "description": "Example description"}'
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

      <div className="mt-6 space-y-4">
        {loading ? (
          <p className="text-center text-navy/50 py-8">Loading...</p>
        ) : settings.length === 0 ? (
          <p className="text-navy/50">No settings yet. Seed data creates defaults.</p>
        ) : (
          settings.map((s) => (
            <div key={s.id} className="rounded-xl border bg-white p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-mono text-sm font-medium">{s.key}</p>
                  <pre className="mt-2 text-xs text-navy/70 overflow-auto">
                    {JSON.stringify(s.value, null, 2)}
                  </pre>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleEdit(s)}>
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
