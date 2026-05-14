import { useEffect, useState } from 'react';
import api from '../api/axios';
import Loader from '../components/Loader';
import { initials } from '../utils/format';

const TeamMembers = () => {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    api.get('/users').then(({ data }) => setUsers(data));
  }, []);

  if (!users) return <Loader />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Team Members</h1>
        <p className="text-sm text-slate-500">People available for project and task assignment.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {users.map((user) => (
          <article className="panel flex items-center gap-4 p-5" key={user._id}>
            <div className="grid h-12 w-12 place-items-center rounded-lg bg-brand-50 font-bold text-brand-700">{initials(user.name)}</div>
            <div>
              <h2 className="font-semibold text-slate-950">{user.name}</h2>
              <p className="text-sm text-slate-500">{user.email}</p>
              <p className="mt-1 text-xs font-semibold text-slate-500">{user.role}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default TeamMembers;
