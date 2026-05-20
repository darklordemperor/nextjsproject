export default function EmployerJobsPage() {
  return (
    <main className="min-h-screen bg-[#f6f7f4] px-6 py-10 text-slate-950">
      <section className="mx-auto max-w-5xl">
        <p className="text-sm font-medium text-emerald-700">Employer</p>
        <h1 className="mt-2 text-3xl font-semibold">Jobs</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
          Protected employer dashboard route. Job management can now be connected to
          the Laravel API through the shared axios client.
        </p>
      </section>
    </main>
  );
}
