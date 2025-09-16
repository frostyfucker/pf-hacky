
import React, { useState } from 'react';
import { Status, Task } from '../types';
import TaskCard from './TaskCard';
import { useProjects } from '../hooks/useProjects';
import { PlusIcon } from './icons/Icons';
import Modal from './Modal';
import TaskForm from './TaskForm';

interface KanbanColumnProps {
  status: Status;
  projectId: string;
  tasks: Task[];
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ status, projectId, tasks }) => {
  const { moveTask, addTask } = useProjects();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
        // Simple logic to drop at the end of the list
        moveTask(taskId, status, tasks.length);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };
    
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleAddTask = (taskData: { title: string; description?: string; imageUrl?: string; dueDate?: string; }) => {
    addTask({
        ...taskData,
        projectId,
        status,
    });
    setIsAddingTask(false);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`bg-gray-800 rounded-lg p-4 flex flex-col transition-colors ${isDragOver ? 'bg-gray-700' : ''}`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg text-white">{status}</h2>
        <span className="bg-gray-700 text-gray-300 text-sm font-bold px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>
      <div className="flex-grow space-y-4 overflow-y-auto">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
      <button
        onClick={() => setIsAddingTask(true)}
        className="mt-4 flex items-center justify-center w-full p-2 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
      >
        <PlusIcon className="h-5 w-5 mr-2" />
        Add Task
      </button>

      <Modal isOpen={isAddingTask} onClose={() => setIsAddingTask(false)} title="Add New Task">
        <TaskForm onSubmit={handleAddTask} onCancel={() => setIsAddingTask(false)} />
      </Modal>
    </div>
  );
};

export default KanbanColumn;