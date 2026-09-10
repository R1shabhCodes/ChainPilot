export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center t-bg t-text p-6">
      <div className="flex flex-col items-center gap-4 max-w-sm text-center">
        <div className="relative flex items-center justify-center">
          <div className="h-12 w-12 rounded-full border-2 border-cyan-500/20 border-t-cyan-500 animate-spin"></div>
          <div className="absolute h-6 w-6 rounded-full bg-cyan-500/10 blur-sm"></div>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold t-text">Loading ChainPilot</h3>
          <p className="text-xs t-text-muted">Initializing dashboard runtime...</p>
        </div>
      </div>
    </div>
  );
}
