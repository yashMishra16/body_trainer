import { Link } from 'react-router-dom';
import { useBlueprint } from '../hooks/useAgent';
import Blueprint90Day from '../components/Blueprint90Day';

export default function Dashboard() {
  const { blueprint } = useBlueprint();

  if (!blueprint) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🏋️</div>
          <h2 className="text-2xl font-bold text-white mb-2">No Blueprint Yet</h2>
          <p className="text-gray-400 mb-6">Complete the setup wizard to generate your personalized 90-day blueprint</p>
          <Link to="/setup" className="btn-primary">
            Get Started
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <nav className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">Body Trainer Dashboard</h1>
          <div className="flex gap-3">
            <Link to="/progress" className="btn-secondary text-sm">
              📊 Progress
            </Link>
            <Link to="/settings" className="btn-secondary text-sm">
              ⚙️ Settings
            </Link>
            <Link to="/setup" className="btn-primary text-sm">
              🔄 New Blueprint
            </Link>
          </div>
        </nav>
        <Blueprint90Day blueprint={blueprint} />
      </div>
    </div>
  );
}
