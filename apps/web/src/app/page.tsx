import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">Stragra Workspace</h1>
      <p className="text-lg text-gray-600 mb-8">Modular multi-tenant platform</p>
      <div className="flex gap-4">
        <Link
          href="/files"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          File Explorer
        </Link>
      </div>
    </main>
  );
}
