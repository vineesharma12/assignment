import { Link } from 'react-router-dom';

const NotFound = () => (
  <main className="grid min-h-screen place-items-center bg-slate-50 p-4">
    <section className="panel max-w-md p-8 text-center">
      <p className="text-sm font-semibold text-brand-600">404</p>
      <h1 className="mt-2 text-2xl font-bold text-slate-950">Page not found</h1>
      <p className="mt-2 text-sm text-slate-500">The page you are looking for does not exist.</p>
      <Link className="btn-primary mt-6" to="/dashboard">Back to dashboard</Link>
    </section>
  </main>
);

export default NotFound;
