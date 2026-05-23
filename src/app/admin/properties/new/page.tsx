import { PropertyForm } from "@/components/admin/property-form";

export default function NewPropertyPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-6">Add Property</h1>
      <PropertyForm />
    </div>
  );
}
