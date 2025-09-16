import React from 'react';
import { useProjects } from '../hooks/useProjects';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Tooltip as PieTooltip } from 'recharts';
import { Status } from '../types';

const COLORS: { [key in Status]: string } = {
  'To Do': '#3B82F6', // blue-500
  'In Progress': '#FBBF24', // amber-400
  'Done': '#22C55E', // green-500
};

const Dashboard: React.FC = () => {
  const { projects, tasks } = useProjects();

  const totalTasksByStatus = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {} as { [key in Status]: number });

  const chartData = [
    {
      name: 'Tasks',
      'To Do': totalTasksByStatus['To Do'] || 0,
      'In Progress': totalTasksByStatus['In Progress'] || 0,
      'Done': totalTasksByStatus['Done'] || 0,
      'Total': tasks.length,
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Dashboard</h1>
      
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-semibold text-gray-200 mb-4">Overall Task Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', color: '#E5E7EB' }}
              cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }}
            />
            <Legend wrapperStyle={{ color: '#E5E7EB' }} />
            <Bar dataKey="To Do" fill={COLORS['To Do']} stackId="a" />
            <Bar dataKey="In Progress" fill={COLORS['In Progress']} stackId="a" />
            <Bar dataKey="Done" fill={COLORS['Done']} stackId="a" />
            <Bar dataKey="Total" fill="#9CA3AF" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h2 className="text-2xl font-bold text-white mb-4">Projects Status</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => {
          const projectTasks = tasks.filter(t => t.projectId === project.id);
          const projectTasksByStatus = projectTasks.reduce((acc, task) => {
            acc[task.status] = (acc[task.status] || 0) + 1;
            return acc;
          }, {} as { [key in Status]: number });

          const pieData = Object.entries(projectTasksByStatus).map(([name, value]) => ({ name, value }));

          return (
            <div key={project.id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-4">{project.name}</h3>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-400">Total Tasks: <span className="font-bold text-white">{projectTasks.length}</span></p>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li><span className="text-blue-400">To Do:</span> {projectTasksByStatus['To Do'] || 0}</li>
                    <li><span className="text-amber-400">In Progress:</span> {projectTasksByStatus['In Progress'] || 0}</li>
                    <li><span className="text-green-400">Done:</span> {projectTasksByStatus['Done'] || 0}</li>
                  </ul>
                </div>
                <div className="w-24 h-24">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={40} fill="#8884d8">
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[entry.name as Status]} />
                        ))}
                      </Pie>
                      <PieTooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;