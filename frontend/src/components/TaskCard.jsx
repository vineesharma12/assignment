import { CalendarDays, MessageSquare } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { formatDate, initials, isOverdue } from '../utils/format';

const TaskCard = ({ task, onStatusChange, compact = false }) => (
  <article className="panel p-4">
    <div className="flex items-start justify-between gap-3">
      <div>
        <h3 className="font-semibold text-slate-950">{task.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-slate-600">{task.description || 'No description added.'}</p>
      </div>
      <StatusBadge value={task.priority} />
    </div>
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <StatusBadge value={task.status} />
      {isOverdue(task) && <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700">Overdue</span>}
    </div>
    <div className="mt-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <CalendarDays size={16} />
        {formatDate(task.dueDate)}
      </div>
      <div className="flex items-center gap-2">
        {!compact && <span className="text-xs text-slate-500">{task.projectId?.title}</span>}
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
          {initials(task.assignedTo?.name)}
        </div>
      </div>
    </div>
    <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
      <span className="inline-flex items-center gap-1 text-xs text-slate-500">
        <MessageSquare size={14} /> {task.comments?.length || 0}
      </span>
      {onStatusChange && (
        <select className="input max-w-40 py-1.5" value={task.status} onChange={(event) => onStatusChange(task, event.target.value)}>
          <option>Todo</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
      )}
    </div>
  </article>
);

export default TaskCard;
