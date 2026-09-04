export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-t-indigo-500 border-r-transparent border-b-amber-500 border-l-transparent"></div>
        <p className="text-lg font-semibold tracking-wider text-white animate-pulse">Loading Digital Life Lessons...</p>
      </div>
    </div>
  );
}
