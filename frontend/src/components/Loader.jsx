const Loader = ({ fullScreen = false }) => (
  <div className={`grid place-items-center ${fullScreen ? 'min-h-screen' : 'min-h-40'}`}>
    <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-brand-600" />
  </div>
);

export default Loader;
