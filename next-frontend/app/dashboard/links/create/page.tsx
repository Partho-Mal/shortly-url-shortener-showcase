// next-frontend/app/dashboard/links/create/page.tsx
import AdvancedShortLinkForm from "@/components/AdvancedShortLinkForm";

export default function CreatePage() {
  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="space-y-5 max-w-xl mx-auto text-2xl font-bold mb-8">Create a Custom Short Link</h1>
      <AdvancedShortLinkForm />
    </main>
  );
}
