
import React, { useState } from 'react';
import { Task } from '../types';

interface TaskFormProps {
  existingTask?: Task;
  onSubmit: (data: { title: string; description?: string; imageUrl?: string; dueDate?: string; }) => void;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ existingTask, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(existingTask?.title || '');
  const [description, setDescription] = useState(existingTask?.description || '');
  const [image, setImage] = useState<string | undefined>(existingTask?.imageUrl);
  const [dueDate, setDueDate] = useState(existingTask?.dueDate || '');
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Title is required');
      return;
    }
    onSubmit({ title, description, imageUrl: image, dueDate });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-300">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-300">Due Date</label>
        <input
          type="date"
          id="dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-300">Image</label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageUpload}
          className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-600 file:text-white hover:file:bg-gray-500"
        />
        {image && <img src={image} alt="Preview" className="mt-2 rounded-md max-h-40" />}
      </div>
      <div className="flex justify-end space-x-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500">
          {existingTask ? 'Save Changes' : 'Add Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;