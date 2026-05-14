import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CheckCircle2, Clock, FolderKanban, ListTodo, TimerOff } from 'lucide-react';
import api from '../api/axios';
import Loader from '../components/Loader';

const colors = ['#2563eb', '#14b8a6', '#f59e0b', '#ef4444'];

const Stat = ({ label, value, icon: Icon }) => (
  <div className="panel p-5">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
      </div>
      <div className="grid h-11 w-11 place-items-center rounded-lg bg-brand-50 text-brand-700"><Icon size={22} /></div>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/dashboard/stats').then(({ data }) => setStats(data));
  }, []);

  if (!stats) return <Loader />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Dashboard</h1>
        <p className="text-sm text-slate-500">A live overview of team delivery and workload.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Stat label="Total Projects" value={stats.totalProjects} icon={FolderKanban} />
        <Stat label="Total Tasks" value={stats.totalTasks} icon={ListTodo} />
        <Stat label="Completed" value={stats.completedTasks} icon={CheckCircle2} />
        <Stat label="Pending" value={stats.pendingTasks} icon={Clock} />
        <Stat label="Overdue" value={stats.overdueTasks} icon={TimerOff} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="panel p-5">
          <h2 className="font-semibold text-slate-950">Task Status</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={stats.statusCounts} dataKey="value" nameKey="name" outerRadius={95} label>
                  {stats.statusCounts.map((entry, index) => <Cell key={entry.name} fill={colors[index % colors.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="panel p-5">
          <h2 className="font-semibold text-slate-950">Priority Mix</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <BarChart data={stats.priorityCounts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
      <section className="panel p-5">
        <h2 className="font-semibold text-slate-950">Recent Activity</h2>
        <div className="mt-4 divide-y divide-slate-100">
          {stats.recentActivity.map((item) => (
            <div className="py-3 text-sm" key={item._id}>
              <span className="font-semibold text-slate-900">{item.actor?.name || 'Someone'}</span>
              <span className="text-slate-600"> {item.message}</span>
            </div>
          ))}
          {!stats.recentActivity.length && <p className="text-sm text-slate-500">No activity yet.</p>}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
