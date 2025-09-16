import React, { useState } from 'react';
import { useProjects } from '../hooks/useProjects';
import { KANBAN_STATUSES } from '../constants';
import KanbanColumn from './KanbanColumn';
import AiReportModal from './AiReportModal';
import { ReportIcon } from './icons/Icons';

interface KanbanBoardProps {
  projectId: string;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ projectId }) => {
  const { getTasksByProjectId, getProjectById } = useProjects();
  const project = getProjectById(projectId);
  const tasks = getTasksByProjectId(projectId);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  if (!project) {
    return <div className="text-center text-xl text-gray-400">Project not found.</div>;
  }
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">{project.name}</h1>
        <button
          onClick={() => setIsReportModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
        >
          <ReportIcon className="w-5 h-5" />
          Generate AI Report
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6 flex-grow">
        {KANBAN_STATUSES.map(status => (
          <KanbanColumn
            key={status}
            status={status}
            projectId={projectId}
            tasks={tasks.filter(task => task.status === status)}
          />
        ))}
      </div>
      
      {isReportModalOpen && (
         <AiReportModal
            project={project}
            tasks={tasks}
            isOpen={isReportModalOpen}
            onClose={() => setIsReportModalOpen(false)}
        />
      )}
    </div>
  );
};

export default KanbanBoard;