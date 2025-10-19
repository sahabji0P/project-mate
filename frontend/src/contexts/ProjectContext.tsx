import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

interface ProjectContextType {
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  updateProject: (id: string, project: Partial<Omit<Project, 'id' | 'createdAt'>>) => void;
  deleteProject: (id: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(() => {
    const stored = localStorage.getItem('projects');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  const addProject = (project: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject: Project = {
      ...project,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setProjects(prev => [newProject, ...prev]);
  };

  const updateProject = (id: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  return (
    <ProjectContext.Provider value={{ projects, addProject, updateProject, deleteProject }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) throw new Error('useProjects must be used within ProjectProvider');
  return context;
};
