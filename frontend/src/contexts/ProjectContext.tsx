// import React, { createContext, useContext, useState, useEffect } from 'react';

// export interface Project {
//   id: string;
//   name: string;
//   description: string;
//   createdAt: string;
// }

// interface ProjectContextType {
//   projects: Project[];
//   addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
//   updateProject: (id: string, project: Partial<Omit<Project, 'id' | 'createdAt'>>) => void;
//   deleteProject: (id: string) => void;
// }

// const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [projects, setProjects] = useState<Project[]>(() => {
//     const stored = localStorage.getItem('projects');
//     return stored ? JSON.parse(stored) : [];
//   });

//   useEffect(() => {
//     localStorage.setItem('projects', JSON.stringify(projects));
//   }, [projects]);

//   const addProject = (project: Omit<Project, 'id' | 'createdAt'>) => {
//     const newProject: Project = {
//       ...project,
//       id: crypto.randomUUID(),
//       createdAt: new Date().toISOString(),
//     };
//     setProjects(prev => [newProject, ...prev]);
//   };

//   const updateProject = (id: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>) => {
//     setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
//   };

//   const deleteProject = (id: string) => {
//     setProjects(prev => prev.filter(p => p.id !== id));
//   };

//   return (
//     <ProjectContext.Provider value={{ projects, addProject, updateProject, deleteProject }}>
//       {children}
//     </ProjectContext.Provider>
//   );
// };

// export const useProjects = () => {
//   const context = useContext(ProjectContext);
//   if (!context) throw new Error('useProjects must be used within ProjectProvider');
//   return context;
// };



import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useToast } from '../hooks/use-toast';
import projectService, { CreateProjectData, Project, UpdateProjectData } from '../services/project';
import { useAuth } from './AuthContext';

interface ProjectContextType {
  projects: Project[];
  isLoading: boolean;
  getProjects: () => Promise<void>;
  getProject: (id: string) => Promise<Project | undefined>;
  addProject: (data: CreateProjectData) => Promise<void>;
  updateProject: (id: string, data: UpdateProjectData) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within ProjectProvider');
  }
  return context;
};

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Fetch projects when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      getProjects();
    } else {
      setProjects([]);
    }
  }, [isAuthenticated]);

  const getProjects = async () => {
    try {
      setIsLoading(true);
      const fetchedProjects = await projectService.getProjects();
      setProjects(fetchedProjects);
    } catch (error: any) {
      console.error('Failed to fetch projects:', error);
      toast({
        title: 'Error',
        description: 'Failed to load projects',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getProject = async (id: string): Promise<Project | undefined> => {
    try {
      const project = await projectService.getProject(id);
      return project;
    } catch (error: any) {
      console.error('Failed to fetch project:', error);
      toast({
        title: 'Error',
        description: 'Failed to load project',
        variant: 'destructive',
      });
      return undefined;
    }
  };

  const addProject = async (data: CreateProjectData) => {
    try {
      setIsLoading(true);
      const newProject = await projectService.createProject(data);
      setProjects((prev) => [newProject, ...prev]);
      toast({
        title: 'Success',
        description: 'Project created successfully',
      });
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to create project';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProject = async (id: string, data: UpdateProjectData) => {
    try {
      setIsLoading(true);
      const updatedProject = await projectService.updateProject(id, data);
      setProjects((prev) =>
        prev.map((project) => (project._id === id ? updatedProject : project))
      );
      toast({
        title: 'Success',
        description: 'Project updated successfully',
      });
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to update project';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      setIsLoading(true);
      await projectService.deleteProject(id);
      setProjects((prev) => prev.filter((project) => project._id !== id));
      toast({
        title: 'Success',
        description: 'Project deleted successfully',
      });
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to delete project';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: ProjectContextType = {
    projects,
    isLoading,
    getProjects,
    getProject,
    addProject,
    updateProject,
    deleteProject,
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};