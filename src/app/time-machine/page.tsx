import { TimeMachine } from '@/components/unique-features/TimeMachine';
import { api } from '@/lib/api';

export default function TimeMachinePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🔮 Time Machine</h1>
        <p className="text-gray-600">
          Explore alternative timelines, simulate what-if scenarios, and predict your future performance
        </p>
      </div>

      <TimeMachine userId="current" />
    </div>
  );
}
