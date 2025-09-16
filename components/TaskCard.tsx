
import React, { useState } from 'react';
import { Task } from '../types';
import { useProjects } from '../hooks/useProjects';
import { EditIcon, TrashIcon, CalendarIcon } from './icons/Icons';
import Modal from './Modal';
import TaskForm from './TaskForm';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { deleteTask, updateTask } = useProjects();
  const [isEditing, setIsEditing] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('taskId', task.id);
  };

  const handleUpdateTask = (taskData: { title: string; description?: string; imageUrl?: string; dueDate?: string; }) => {
    updateTask(task.id, taskData);
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    // Parse date string as local time to avoid timezone issues
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to midnight for accurate date comparison
  const isOverdue = task.dueDate && new Date(task.dueDate) < today && task.status !== 'Done';

  return (
    <>
      <div
        draggable
        onDragStart={handleDragStart}
        className="bg-gray-700 p-4 rounded-lg shadow-md cursor-grab active:cursor-grabbing group"
      >
        {task.imageUrl && (
          <img src={task.imageUrl} alt={task.title} className="w-full h-32 object-cover rounded-md mb-2" />
        )}
        <div className="flex justify-between items-start">
            <h3 className="font-semibold text-gray-100 pr-2">{task.title}</h3>
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-white">
                    <EditIcon className="w-4 h-4" />
                </button>
                <button onClick={() => deleteTask(task.id)} className="text-gray-400 hover:text-red-500">
                    <TrashIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
        {task.description && <p className="text-sm text-gray-400 mt-1">{task.description}</p>}
        {task.dueDate && (
          <div className={`mt-2 flex items-center text-xs ${isOverdue ? 'text-red-400' : 'text-gray-400'}`}>
            <CalendarIcon className="w-4 h-4 mr-1.5" />
            <span>{formatDate(task.dueDate)}</span>
            {isOverdue && <span className="ml-2 font-semibold">(Overdue)</span>}
          </div>
        )}
      </div>

      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Edit Task">
        <TaskForm
          existingTask={task}
          onSubmit={handleUpdateTask}
          onCancel={() => setIsEditing(false)}
        />
      </Modal>
    </>
  );
};

export default TaskCard;