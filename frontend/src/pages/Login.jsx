import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CheckSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, user } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (user) return <Navigate to="/dashboard" replace />;

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await login(form);
      toast.success('Welcome back');
      navigate(location.state?.from?.pathname || '/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 p-4">
      <section className="panel w-full max-w-md p-6">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-brand-600 text-white"><CheckSquare /></div>
          <div>
            <h1 className="text-xl font-bold text-slate-950">Sign in to TaskFlow</h1>
            <p className="text-sm text-slate-500">Manage projects, tasks, and teams.</p>
          </div>
        </div>
        <form className="space-y-4" onSubmit={submit}>
          <label className="block text-sm font-semibold text-slate-700">Email<input className="input mt-1" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
          <label className="block text-sm font-semibold text-slate-700">Password<input className="input mt-1" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></label>
          <button className="btn-primary w-full" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
        </form>
        <p className="mt-5 text-center text-sm text-slate-600">
          New here? <Link className="font-semibold text-brand-600" to="/register">Create an account</Link>
        </p>
      </section>
    </main>
  );
};

export default Login;
