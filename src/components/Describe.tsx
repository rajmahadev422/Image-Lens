
interface DescribeProps {
  result: string;
  isLoading: boolean;
}

const Describe = ({result, isLoading}: DescribeProps) => {
  
  return (
    <div>
      {result ? (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/3 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/5">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs text-white/40 tracking-widest uppercase font-medium">
              Analysis Result
            </span>
          </div>
          <div className="px-5 py-5">
            <p className="text-white/75 text-sm leading-relaxed">{result}</p>
          </div>
        </div>
      ) : isLoading ? (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/3 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/5">
            <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-xs text-white/40 tracking-widest uppercase font-medium">
              Generating…
            </span>
          </div>
          <div className="px-5 py-5 space-y-2.5">
            {[100, 85, 92, 60].map((w, i) => (
              <div
                key={i}
                className="h-3 rounded-full bg-white/5 animate-pulse"
                style={{ width: `${w}%`, animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/3 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/5">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs text-white/40 tracking-widest uppercase font-medium">
              Analysis Result
            </span>
          </div>
          <div className="px-5 py-5">
            <p className="text-white/75 text-sm leading-relaxed">
              Please Add Image to see result.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Describe;
