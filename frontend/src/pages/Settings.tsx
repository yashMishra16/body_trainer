import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Settings() {
  const [apiSettings, setApiSettings] = useState({
    anthropicKey: '',
    openaiKey: '',
  });

  const [notifications, setNotifications] = useState({
    workoutReminders: true,
    progressCheckins: true,
    mealReminders: false,
  });

  return (
    <div className="min-h-screen bg-gray-950 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <nav className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <Link to="/dashboard" className="btn-secondary text-sm">← Dashboard</Link>
        </nav>

        <div className="space-y-6">
          <div className="card">
            <h3 className="text-xl font-bold text-white mb-4">🔑 API Configuration</h3>
            <p className="text-sm text-gray-400 mb-4">
              API keys are configured on the server via environment variables. Contact your admin to update them.
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Anthropic Claude API</label>
                <input
                  type="password"
                  className="input-field"
                  value={apiSettings.anthropicKey}
                  onChange={e => setApiSettings(p => ({ ...p, anthropicKey: e.target.value }))}
                  placeholder="Configured server-side"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">OpenAI API (Fallback)</label>
                <input
                  type="password"
                  className="input-field"
                  value={apiSettings.openaiKey}
                  onChange={e => setApiSettings(p => ({ ...p, openaiKey: e.target.value }))}
                  placeholder="Configured server-side"
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-xl font-bold text-white mb-4">🔔 Notifications</h3>
            <div className="space-y-4">
              {[
                { key: 'workoutReminders', label: 'Workout Reminders', desc: 'Daily reminders for scheduled workouts' },
                { key: 'progressCheckins', label: 'Weekly Check-ins', desc: 'Reminders to log progress and review' },
                { key: 'mealReminders', label: 'Meal Timing Alerts', desc: 'Notifications for pre/post workout meals' },
              ].map(setting => (
                <div key={setting.key} className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">{setting.label}</div>
                    <div className="text-sm text-gray-400">{setting.desc}</div>
                  </div>
                  <button
                    onClick={() =>
                      setNotifications(prev => ({
                        ...prev,
                        [setting.key]: !prev[setting.key as keyof typeof prev],
                      }))
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications[setting.key as keyof typeof notifications]
                        ? 'bg-green-500'
                        : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications[setting.key as keyof typeof notifications]
                          ? 'translate-x-6'
                          : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="text-xl font-bold text-white mb-4">🗃️ Data Management</h3>
            <div className="space-y-3">
              <button className="btn-secondary w-full">
                📥 Export Progress Data
              </button>
              <button className="btn-secondary w-full">
                🔄 Regenerate Blueprint
              </button>
              <button className="w-full py-2 px-4 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors font-semibold">
                🗑️ Reset All Data
              </button>
            </div>
          </div>

          <div className="card">
            <h3 className="text-xl font-bold text-white mb-2">ℹ️ About</h3>
            <p className="text-gray-400 text-sm">
              Body Trainer v1.0.0 — 5-Agent Aesthetic Physique System
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Powered by Anthropic Claude & OpenAI GPT-4
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
