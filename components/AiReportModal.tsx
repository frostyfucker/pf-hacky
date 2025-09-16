import React, { useState, useCallback } from 'react';
import { Project, Task } from '../types';
import Modal from './Modal';
import { generateProjectReport } from '../services/geminiService';
import { DownloadIcon } from './icons/Icons';

interface AiReportModalProps {
  project: Project;
  tasks: Task[];
  isOpen: boolean;
  onClose: () => void;
}

const AiReportModal: React.FC<AiReportModalProps> = ({ project, tasks, isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [refinePrompt, setRefinePrompt] = useState('');

  const handleGenerateReport = useCallback(async (currentRefinePrompt: string) => {
    setIsLoading(true);
    setError('');
    setReport('');
    try {
      const result = await generateProjectReport(project, tasks, currentRefinePrompt);
      setReport(result);
    } catch (err: any) {
      setError(err.message || 'Failed to generate report.');
    } finally {
      setIsLoading(false);
    }
  }, [project, tasks]);

  const handleInitialGenerate = () => {
    handleGenerateReport(refinePrompt);
  };

  const downloadReport = () => {
    const blob = new Blob([report], { type: 'text/markdown;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${project.name}-report.md`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Project Report">
      <div className="space-y-4">
        {isLoading && (
          <div className="flex flex-col items-center justify-center p-8">
            <div className="w-12 h-12 border-4 border-t-gray-500 border-gray-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-300">Generating your report...</p>
          </div>
        )}
        {error && <div className="text-red-400 bg-red-900 p-3 rounded-md">{error}</div>}
        {report && (
          <div>
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-200">Generated Report</h3>
                <button onClick={downloadReport} className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300">
                    <DownloadIcon className="w-4 h-4" />
                    Download
                </button>
            </div>
            <pre className="bg-gray-700 p-4 rounded-md text-gray-200 whitespace-pre-wrap font-sans text-sm max-h-60 overflow-y-auto">{report}</pre>
          </div>
        )}

        {!isLoading && (
            <>
                <div>
                    <label htmlFor="refinePrompt" className="block text-sm font-medium text-gray-300">Refine Prompt (Optional)</label>
                    <input
                    type="text"
                    id="refinePrompt"
                    value={refinePrompt}
                    onChange={(e) => setRefinePrompt(e.target.value)}
                    placeholder="e.g., Make it more formal, summarize in 3 bullet points."
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                    />
                </div>
                <div className="flex justify-end pt-2">
                    <button onClick={handleInitialGenerate} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500">
                    {report ? 'Regenerate' : 'Generate'}
                    </button>
                </div>
            </>
        )}
      </div>
    </Modal>
  );
};

export default AiReportModal;