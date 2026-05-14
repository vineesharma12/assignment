import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import api from '../api/axios';
import ConfirmDialog from '../components/ConfirmDialog';
import Loader from '../components/Loader';
import StatusBadge from '../components/StatusBadge';
import TaskCard from '../components/TaskCard';
import { useAuth } from '../context/AuthContext';

const ProjectDetails = () => {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [users, setUsers] = useState([]);
  const [confirm, setConfirm] = useState(false);

  const load = async () => {
    const [{ data: detail }, { data: userData }] = await Promise.all([api.get(`/projects/${id}`), api.get('/users')]);
    setData(detail);
    setUsers(userData);
  };

  useEffect(() => { load(); }, [id]);

  const update = async () => {
    try {
      await api.put(`/projects/${id}`, {
        title: data.project.title,
        description: data.project.description,
        status: data.project.status,
        teamMembers: data.project.teamMembers.map((member) => member._id || member)
      });
      toast.success('Project updated');
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  const remove = async () => {
    await api.delete(`/projects/${id}`);
    toast.success('Project deleted');
    navigate('/projects');
  };

  const setMemberIds = (ids) => {
    setData({
      ...data,
      project: {
        ...data.project,
        teamMembers: users.filter((user) => ids.includes(user._id))
      }
    });
  };

  if (!data) return <Loader />;

  const memberIds = data.project.teamMembers.map((member) => member._id || member);

  return (
    <div className="space-y-6">
      <Link to="/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-brand-700"><ArrowLeft size={16} />Back to projects</Link>
      <section className="panel p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            {isAdmin ? (
              <input className="input text-xl font-bold" value={data.project.title} onChange={(e) => setData({ ...data, project: { ...data.project, title: e.target.value } })} />
            ) : (
              <h1 className="text-2xl font-bold text-slate-950">{data.project.title}</h1>
            )}
            <div className="mt-3"><StatusBadge value={data.project.status} /></div>
          </div>
          {isAdmin && (
            <div className="flex gap-2">
              <button className="btn-secondary" onClick={update}><Save size={17} />Save</button>
              <button className="btn-secondary text-rose-600" onClick={() => setConfirm(true)}><Trash2 size={17} />Delete</button>
            </div>
          )}
        </div>
        {isAdmin ? (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <textarea className="input min-h-28" value={data.project.description} onChange={(e) => setData({ ...data, project: { ...data.project, description: e.target.value } })} />
            <div className="space-y-3">
              <select className="input" value={data.project.status} onChange={(e) => setData({ ...data, project: { ...data.project, status: e.target.value } })}>
                <option>Active</option><option>Completed</option><option>Archived</option>
              </select>
              <select className="input min-h-28" multiple value={memberIds} onChange={(e) => setMemberIds(Array.from(e.target.selectedOptions).map((o) => o.value))}>
                {users.map((user) => <option key={user._id} value={user._id}>{user.name} ({user.role})</option>)}
              </select>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-600">{data.project.description}</p>
        )}
      </section>
      <section>
        <h2 className="mb-3 font-semibold text-slate-950">Project Tasks</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.tasks.map((task) => <TaskCard key={task._id} task={task} compact />)}
        </div>
        {!data.tasks.length && <div className="panel p-6 text-sm text-slate-500">No tasks in this project yet.</div>}
      </section>
      <ConfirmDialog open={confirm} title="Delete project" message="This will delete the project and all tasks inside it." onCancel={() => setConfirm(false)} onConfirm={remove} />
    </div>
  );
};

export default ProjectDetails;
