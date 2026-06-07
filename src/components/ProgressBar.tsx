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
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  }[size];

  const textColor = color || getProgressColor(progress);

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-xs font-medium text-gray-600">{label}</span>}
          {showPercentage && (
            <span className="text-xs font-medium" style={{ color: textColor }}>
              {Math.round(progress)}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${height}`}>
        <div
          className={`h-full transition-all duration-300 ease-out rounded-full`}
          style={{
            width: `${Math.min(100, Math.max(0, progress))}%`,
            backgroundColor: textColor,
          }}
        />
      </div>
    </div>
  );
}
