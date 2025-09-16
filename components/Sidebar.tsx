import React, { useState } from 'react';
import { useProjects } from '../hooks/useProjects';
import { DashboardIcon, FolderIcon, PlusIcon, TrashIcon } from './icons/Icons';
import Modal from './Modal';
import { Project } from '../types';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const { projects, addProject, deleteProject } = useProjects();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const handleAddProjectSubmit = (name: string) => {
    if (name) {
      addProject(name);
    }
    setIsAddModalOpen(false);
  };
  
  const handleDeleteClick = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation(); // Prevent parent onClick
    setProjectToDelete(project);
  };

  const confirmDeleteProject = () => {
    if (projectToDelete) {
        if (currentView === projectToDelete.id) {
            setCurrentView('dashboard');
        }
        deleteProject(projectToDelete.id);
        setProjectToDelete(null);
    }
  };

  return (
    <>
      <aside className="w-64 bg-gray-800 text-gray-300 flex flex-col p-4 border-r border-gray-700">
        <div className="text-2xl font-bold mb-8 text-white flex items-center">
          <span className="text-gray-400 mr-2">P</span>rojectFlow
        </div>
        <nav className="flex-1">
          <ul>
            <li
              className={`flex items-center p-2 rounded-md cursor-pointer mb-2 transition-colors ${
                currentView === 'dashboard' ? 'bg-gray-600 text-white' : 'hover:bg-gray-700'
              }`}
              onClick={() => setCurrentView('dashboard')}
            >
              <DashboardIcon className="h-5 w-5 mr-3" />
              Dashboard
            </li>
          </ul>
          <h3 className="text-sm font-semibold text-gray-400 mt-6 mb-2 px-2">PROJECTS</h3>
          <ul className="space-y-1">
            {projects.map(project => (
              <li
                key={project.id}
                className={`flex items-center justify-between p-2 rounded-md cursor-pointer group transition-colors ${
                  currentView === project.id ? 'bg-gray-600 text-white' : 'hover:bg-gray-700'
                }`}
                onClick={() => setCurrentView(project.id)}
              >
                <div className="flex items-center truncate">
                    <FolderIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                    <span className="truncate">{project.name}</span>
                </div>
                <button
                  onClick={(e) => handleDeleteClick(e, project)}
                  className="ml-2 p-1 rounded-full text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-opacity"
                  aria-label={`Delete project ${project.name}`}
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center w-full p-2 rounded-md bg-gray-600 text-white hover:bg-gray-500 transition-colors mt-4"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Project
        </button>
      </aside>
      
      {/* Add Project Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Project">
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const name = formData.get('projectName') as string;
          handleAddProjectSubmit(name);
        }}>
          <label htmlFor="projectName" className="block text-sm font-medium text-gray-300">Project Name or GitHub URL</label>
          <input
            type="text"
            id="projectName"
            name="projectName"
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
            required
            autoFocus
          />
          <div className="flex justify-end space-x-3 pt-4 mt-2">
            <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500">
              Add Project
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Project Confirmation Modal */}
      <Modal isOpen={!!projectToDelete} onClose={() => setProjectToDelete(null)} title="Confirm Deletion">
          <div className="text-gray-300">
              Are you sure you want to delete the project "{projectToDelete?.name}"? This action cannot be undone.
          </div>
          <div className="flex justify-end space-x-3 pt-4 mt-2">
            <button type="button" onClick={() => setProjectToDelete(null)} className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600">Cancel</button>
            <button onClick={confirmDeleteProject} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
              Delete Project
            </button>
          </div>
      </Modal>
    </>
  );
};

export default Sidebar;