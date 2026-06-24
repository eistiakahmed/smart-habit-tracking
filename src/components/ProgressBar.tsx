import { getProgressColor } from '@/lib/utils';

interface ProgressBarProps {
  progress: number;
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  color?: string;
  label?: string;
}

export default function ProgressBar({
  progress,
  size = 'md',
  showPercentage = true,
  color,
  label,
}: ProgressBarProps) {
  const height = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  }[size];

  const barColor = color || getProgressColor(progress);

  return (
    <div className="w-full font-sans">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs font-semibold text-slate-400">{label}</span>}
          {showPercentage && (
            <span className="text-xs font-bold" style={{ color: barColor }}>
              {Math.round(progress)}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-slate-950/60 border border-slate-800/80 rounded-full overflow-hidden p-[1px] ${height}`}>
        <div
          className="h-full transition-all duration-500 ease-out rounded-full shadow-[0_0_8px_rgba(255,255,255,0.05)]"
          style={{
            width: `${Math.min(100, Math.max(0, progress))}%`,
            backgroundColor: barColor,
            boxShadow: `0 0 10px ${barColor}40`,
          }}
        />
      </div>
    </div>
  );
}
