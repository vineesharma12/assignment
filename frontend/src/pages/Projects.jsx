import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import api from '../api/axios';
import Modal from '../components/Modal';
import ProjectCard from '../components/ProjectCard';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';

const empty = { title: '', description: '', status: 'Active', teamMembers: [] };

const Projects = () => {
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState(null);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);

  const load = async () => {
    const [{ data: projectData }, { data: userData }] = await Promise.all([api.get('/projects'), api.get('/users')]);
    setProjects(projectData);
    setUsers(userData);
  };

  useEffect(() => { load(); }, []);

  const submit = async (event) => {
    event.preventDefault();
    try {
      await api.post('/projects', form);
      toast.success('Project created');
      setOpen(false);
      setForm(empty);
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not create project');
    }
  };

  if (!projects) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Projects</h1>
          <p className="text-sm text-slate-500">Create workspaces and manage team membership.</p>
        </div>
        {isAdmin && <button className="btn-primary" onClick={() => setOpen(true)}><Plus size={18} />New Project</button>}
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => <ProjectCard key={project._id} project={project} />)}
      </div>
      {!projects.length && <div className="panel p-8 text-center text-sm text-slate-500">No projects available.</div>}
      <Modal open={open} title="Create project" onClose={() => setOpen(false)}>
        <form className="space-y-4" onSubmit={submit}>
          <input className="input" placeholder="Project title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <textarea className="input min-h-28" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <select className="input" multiple value={form.teamMembers} onChange={(e) => setForm({ ...form, teamMembers: Array.from(e.target.selectedOptions).map((o) => o.value) })}>
            {users.map((user) => <option key={user._id} value={user._id}>{user.name} ({user.role})</option>)}
          </select>
          <button className="btn-primary">Create project</button>
        </form>
      </Modal>
    </div>
  );
};

export default Projects;
