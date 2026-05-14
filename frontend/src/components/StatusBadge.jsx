const styles = {
  Todo: 'bg-slate-100 text-slate-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  Completed: 'bg-emerald-100 text-emerald-700',
  Active: 'bg-emerald-100 text-emerald-700',
  Archived: 'bg-slate-100 text-slate-600',
  High: 'bg-rose-100 text-rose-700',
  Medium: 'bg-amber-100 text-amber-700',
  Low: 'bg-teal-100 text-teal-700'
};

const StatusBadge = ({ value }) => (
  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[value] || styles.Todo}`}>
    {value}
  </span>
);

export default StatusBadge;
