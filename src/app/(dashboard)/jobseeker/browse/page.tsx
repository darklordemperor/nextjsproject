export default function JobseekerBrowsePage() {
  return (
    <main className="min-h-screen bg-[#f6f7f4] px-6 py-10 text-slate-950">
      <section className="mx-auto max-w-5xl">
        <p className="text-sm font-medium text-emerald-700">Jobseeker</p>
        <h1 className="mt-2 text-3xl font-semibold">Browse jobs</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
          Protected jobseeker dashboard route. Browse and application workflows can
          now reuse the shared Sanctum-authenticated API client.
        </p>
      </section>
    </main>
  );
}
