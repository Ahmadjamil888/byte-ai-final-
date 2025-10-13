'use client';

import { useState } from 'react';
import ProjectsDashboard from './ProjectsDashboard';

interface UserProgressDisplayProps {
  className?: string;
  onProjectSelect?: (project: any) => void;
}

export default function UserProgressDisplay({ className = '', onProjectSelect }: UserProgressDisplayProps) {
  const [showProjects, setShowProjects] = useState(false);

  const handleProjectSelect = (project: any) => {
    setShowProjects(false);
    if (onProjectSelect) {
      onProjectSelect(project);
    } else if (project.url) {
      // Default behavior: redirect to the project's sandbox URL
      window.open(project.url, '_blank');
    }
  };

  return (
    <>
      <div className={`flex items-center ${className}`}>
        {/* Projects Button */}
        <button
          onClick={() => setShowProjects(true)}
          className="flex items-center gap-2 px-3 py-2 bg-gradient-to-br from-black via-gray-900 to-orange-900/20 border border-orange-500/30 rounded-lg backdrop-blur-sm hover:bg-gray-700/50 transition-colors"
          title="View my projects"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.9) 0%, rgba(20,20,20,0.95) 40%, rgba(139,69,19,0.1) 100%)'
          }}
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-orange-400">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span className="text-sm text-orange-300 font-medium">My Projects</span>
        </button>
      </div>

      <ProjectsDashboard
        isOpen={showProjects}
        onClose={() => setShowProjects(false)}
        onSelectProject={handleProjectSelect}
      />
    </>
  );
}