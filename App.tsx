import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import KanbanBoard from './components/KanbanBoard';
import { ProjectsProvider } from './hooks/useProjects';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('dashboard');

  return (
    <ProjectsProvider>
      <div className="flex h-screen bg-gray-900 text-gray-100 font-sans">
        <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
        <main className="flex-1 p-8 overflow-y-auto">
          {currentView === 'dashboard' ? (
            <Dashboard />
          ) : (
            <KanbanBoard projectId={currentView} />
          )}
        </main>
      </div>
    </ProjectsProvider>
  );
};

export default App;