import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Member' });

  if (user) return <Navigate to="/dashboard" replace />;

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 p-4">
      <section className="panel w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-slate-950">Create your workspace account</h1>
        <p className="mt-1 text-sm text-slate-500">Use a strong password with a symbol and number.</p>
        <form className="mt-6 space-y-4" onSubmit={submit}>
          <label className="block text-sm font-semibold text-slate-700">Name<input className="input mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
          <label className="block text-sm font-semibold text-slate-700">Email<input className="input mt-1" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
          <label className="block text-sm font-semibold text-slate-700">Password<input className="input mt-1" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></label>
          <label className="block text-sm font-semibold text-slate-700">Role<select className="input mt-1" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option>Member</option><option>Admin</option></select></label>
          <button className="btn-primary w-full" disabled={loading}>{loading ? 'Creating...' : 'Register'}</button>
        </form>
        <p className="mt-5 text-center text-sm text-slate-600">
          Already have an account? <Link className="font-semibold text-brand-600" to="/login">Login</Link>
        </p>
      </section>
    </main>
  );
};

export default Register;
