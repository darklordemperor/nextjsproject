export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#f6f7f4] px-6 py-10 text-slate-950">
      <section className="mx-auto max-w-5xl">
        <p className="text-sm font-medium text-emerald-700">Dashboard</p>
        <h1 className="mt-2 text-3xl font-semibold">Job board dashboard</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
          This route is protected by the server-side auth proxy and can be used as
          the shared dashboard landing page.
        </p>
      </section>
    </main>
  );
}
