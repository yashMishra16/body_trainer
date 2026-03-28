import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

interface ProgressEntry {
  date: string;
  value: number | null;
}

// Mock data for demonstration
const mockWeightData: ProgressEntry[] = [
  { date: 'Week 1', value: 80 },
  { date: 'Week 2', value: 79.5 },
  { date: 'Week 3', value: 79 },
  { date: 'Week 4', value: 78.2 },
  { date: 'Week 5', value: 77.8 },
  { date: 'Week 6', value: 77.3 },
];

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { labels: { color: 'rgba(255,255,255,0.7)' } },
    title: { display: false },
  },
  scales: {
    x: {
      ticks: { color: 'rgba(255,255,255,0.5)' },
      grid: { color: 'rgba(255,255,255,0.05)' },
    },
    y: {
      ticks: { color: 'rgba(255,255,255,0.5)' },
      grid: { color: 'rgba(255,255,255,0.05)' },
    },
  },
};

export default function Progress() {
  const [logEntry, setLogEntry] = useState({
    weightKg: '',
    energyLevel: '7',
    sleepHours: '7',
    notes: '',
  });

  const weightChartData = {
    labels: mockWeightData.map(d => d.date),
    datasets: [
      {
        label: 'Weight (kg)',
        data: mockWeightData.map(d => d.value),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <nav className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">Progress Tracker</h1>
          <div className="flex gap-3">
            <Link to="/dashboard" className="btn-secondary text-sm">← Dashboard</Link>
          </div>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-3xl font-bold text-green-400">-2.7kg</div>
            <div className="text-gray-400 text-sm mt-1">Total Weight Lost</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-blue-400">6</div>
            <div className="text-gray-400 text-sm mt-1">Weeks Completed</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-purple-400">42</div>
            <div className="text-gray-400 text-sm mt-1">Days Until Goal</div>
          </div>
        </div>

        <div className="card mb-8">
          <h3 className="text-xl font-bold text-white mb-4">📉 Weight Progress</h3>
          <Line data={weightChartData} options={chartOptions} />
        </div>

        <div className="card">
          <h3 className="text-xl font-bold text-white mb-4">📝 Log Today's Progress</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Weight (kg)</label>
              <input
                type="number"
                className="input-field"
                value={logEntry.weightKg}
                onChange={e => setLogEntry(p => ({ ...p, weightKg: e.target.value }))}
                placeholder="Enter today's weight"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Energy Level: <span className="text-green-400">{logEntry.energyLevel}/10</span>
              </label>
              <input
                type="range"
                min={1}
                max={10}
                value={logEntry.energyLevel}
                onChange={e => setLogEntry(p => ({ ...p, energyLevel: e.target.value }))}
                className="w-full accent-green-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Sleep Hours</label>
              <input
                type="number"
                className="input-field"
                value={logEntry.sleepHours}
                onChange={e => setLogEntry(p => ({ ...p, sleepHours: e.target.value }))}
                min={4}
                max={12}
                step="0.5"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Notes</label>
              <input
                className="input-field"
                value={logEntry.notes}
                onChange={e => setLogEntry(p => ({ ...p, notes: e.target.value }))}
                placeholder="How did today feel?"
              />
            </div>
          </div>
          <button className="btn-primary mt-4">
            💾 Save Progress
          </button>
        </div>
      </div>
    </div>
  );
}
