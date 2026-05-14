import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import api from '../api/axios';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import TaskCard from '../components/TaskCard';
import { useAuth } from '../context/AuthContext';

const empty = { title: '', description: '', priority: 'Medium', status: 'Todo', dueDate: '', assignedTo: '', projectId: '' };

const Tasks = () => {
  const { isAdmin } = useAuth();
  const [tasks, setTasks] = useState(null);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ status: '', priority: '', search: '' });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);

  const query = useMemo(() => new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(([, v]) => v))).toString(), [filters]);

  const load = async () => {
    const [{ data: taskData }, { data: projectData }, { data: userData }] = await Promise.all([
      api.get(`/tasks?${query}`),
      api.get('/projects'),
      api.get('/users')
    ]);
    setTasks(taskData);
    setProjects(projectData);
    setUsers(userData);
  };

  useEffect(() => { load(); }, [query]);

  const submit = async (event) => {
    event.preventDefault();
    try {
      await api.post('/tasks', form);
      toast.success('Task created');
      setOpen(false);
      setForm(empty);
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not create task');
    }
  };

  const updateStatus = async (task, status) => {
    try {
      await api.put(`/tasks/${task._id}`, { status });
      toast.success('Task updated');
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Status update failed');
    }
  };

  if (!tasks) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Tasks</h1>
          <p className="text-sm text-slate-500">Filter, search, assign, and move work forward.</p>
        </div>
        {isAdmin && <button className="btn-primary" onClick={() => setOpen(true)}><Plus size={18} />New Task</button>}
      </div>
      <div className="panel grid gap-3 p-4 md:grid-cols-3">
        <input className="input" placeholder="Search tasks" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
        <select className="input" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}><option value="">All statuses</option><option>Todo</option><option>In Progress</option><option>Completed</option></select>
        <select className="input" value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}><option value="">All priorities</option><option>Low</option><option>Medium</option><option>High</option></select>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {['Todo', 'In Progress', 'Completed'].map((status) => (
          <section key={status} className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">{status}</h2>
            {tasks.tasks.filter((task) => task.status === status).map((task) => <TaskCard key={task._id} task={task} onStatusChange={updateStatus} />)}
          </section>
        ))}
      </div>
      {!tasks.tasks.length && <div className="panel p-8 text-center text-sm text-slate-500">No tasks match the current filters.</div>}
      <Modal open={open} title="Create task" onClose={() => setOpen(false)}>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={submit}>
          <input className="input md:col-span-2" placeholder="Task title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <textarea className="input min-h-28 md:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <select className="input" value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })} required><option value="">Project</option>{projects.map((p) => <option key={p._id} value={p._id}>{p.title}</option>)}</select>
          <select className="input" value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })} required><option value="">Assignee</option>{users.map((u) => <option key={u._id} value={u._id}>{u.name}</option>)}</select>
          <select className="input" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}><option>Low</option><option>Medium</option><option>High</option></select>
          <input className="input" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} required />
          <button className="btn-primary md:col-span-2">Create task</button>
        </form>
      </Modal>
    </div>
  );
};

export default Tasks;
