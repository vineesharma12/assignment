import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { initials } from '../utils/format';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user.name, avatar: user.avatar || '' });

  const submit = async (event) => {
    event.preventDefault();
    const { data } = await api.put('/users/profile', form);
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
    toast.success('Profile updated');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Profile</h1>
        <p className="text-sm text-slate-500">Keep your workspace identity current.</p>
      </div>
      <section className="panel max-w-2xl p-6">
        <div className="mb-6 flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-lg bg-brand-600 text-xl font-bold text-white">{initials(user.name)}</div>
          <div>
            <h2 className="font-semibold text-slate-950">{user.email}</h2>
            <p className="text-sm text-slate-500">{user.role}</p>
          </div>
        </div>
        <form className="space-y-4" onSubmit={submit}>
          <label className="block text-sm font-semibold text-slate-700">Name<input className="input mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
          <label className="block text-sm font-semibold text-slate-700">Avatar URL<input className="input mt-1" value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} /></label>
          <button className="btn-primary">Save profile</button>
        </form>
      </section>
    </div>
  );
};

export default Profile;
