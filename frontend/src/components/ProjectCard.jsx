import { Link } from 'react-router-dom';
import { Calendar, Users } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { formatDate } from '../utils/format';

const ProjectCard = ({ project }) => (
  <Link to={`/projects/${project._id}`} className="panel block p-5 transition hover:-translate-y-0.5 hover:border-brand-200">
    <div className="flex items-start justify-between gap-4">
      <div>
        <h3 className="font-semibold text-slate-950">{project.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-slate-600">{project.description || 'No description added.'}</p>
      </div>
      <StatusBadge value={project.status} />
    </div>
    <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-500">
      <span className="inline-flex items-center gap-2"><Users size={16} />{project.teamMembers?.length || 0} members</span>
      <span className="inline-flex items-center gap-2"><Calendar size={16} />{formatDate(project.createdAt)}</span>
    </div>
  </Link>
);

export default ProjectCard;
