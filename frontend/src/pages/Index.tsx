// import { ProjectCard } from '@/components/ProjectCard';
// import { ProjectDialog } from '@/components/ProjectDialog';
// import { AuthDialog } from '@/components/auth/AuthDialog';
// import { Button } from '@/components/ui/button';
// import { useAuth } from '@/contexts/AuthContext';
// import { Project, useProjects } from '@/contexts/ProjectContext';
// import { useToast } from '@/hooks/use-toast';
// import { CheckSquare, Plus, Sparkles, Users } from 'lucide-react';
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const Index = () => {
//   const { projects, addProject, updateProject, deleteProject } = useProjects();
//   const { isAuthenticated, user } = useAuth();
//   const navigate = useNavigate();
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [editingProject, setEditingProject] = useState<Project | null>(null);
//   const [authDialogOpen, setAuthDialogOpen] = useState(false);
//   const { toast } = useToast();

//   const handleSave = (data: { name: string; description: string }) => {
//     if (editingProject) {
//       updateProject(editingProject.id, data);
//       toast({
//         title: 'Project updated',
//         description: 'Your project has been updated successfully.',
//       });
//     } else {
//       addProject(data);
//       toast({
//         title: 'Project created',
//         description: 'Your new project has been created successfully.',
//       });
//     }
//     setEditingProject(null);
//   };

//   const handleEdit = (project: Project) => {
//     setEditingProject(project);
//     setDialogOpen(true);
//   };

//   const handleDelete = (id: string) => {
//     deleteProject(id);
//     toast({
//       title: 'Project deleted',
//       description: 'The project has been removed.',
//     });
//   };

//   const handleNewProject = () => {
//     setEditingProject(null);
//     setDialogOpen(true);
//   };

//   // Landing page for non-authenticated users
//   if (!isAuthenticated) {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="max-w-7xl mx-auto px-6 py-12">
//           {/* Hero Section */}
//           <div className="text-center py-24">
//             <div className="max-w-4xl mx-auto">
//               <div className="flex justify-center mb-8">
//                 <div className="p-4 bg-primary/10 rounded-2xl">
//                   <Sparkles className="h-12 w-12 text-primary" />
//                 </div>
//               </div>
//               <h1 className="text-5xl font-light text-foreground mb-6">
//                 Organize Your Tasks with
//                 <span className="font-semibold text-primary"> TaskMate</span>
//               </h1>
//               <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
//                 A modern task management application with AI-powered insights to help you stay organized and productive.
//               </p>

//               <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
//                 <Button
//                   size="lg"
//                   onClick={() => setAuthDialogOpen(true)}
//                   className="gap-2"
//                 >
//                   <Sparkles className="h-5 w-5" />
//                   Get Started Free
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="lg"
//                   onClick={() => setAuthDialogOpen(true)}
//                 >
//                   Sign In
//                 </Button>
//               </div>

//               {/* Features Grid */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
//                 <div className="text-center">
//                   <div className="p-3 bg-blue-500/10 rounded-xl w-fit mx-auto mb-4">
//                     <CheckSquare className="h-8 w-8 text-blue-500" />
//                   </div>
//                   <h3 className="font-semibold mb-2">Task Management</h3>
//                   <p className="text-sm text-muted-foreground">
//                     Create, organize, and track your tasks with priority levels and color coding.
//                   </p>
//                 </div>

//                 <div className="text-center">
//                   <div className="p-3 bg-purple-500/10 rounded-xl w-fit mx-auto mb-4">
//                     <Sparkles className="h-8 w-8 text-purple-500" />
//                   </div>
//                   <h3 className="font-semibold mb-2">AI Assistant</h3>
//                   <p className="text-sm text-muted-foreground">
//                     Get intelligent summaries and insights about your projects and tasks.
//                   </p>
//                 </div>

//                 <div className="text-center">
//                   <div className="p-3 bg-green-500/10 rounded-xl w-fit mx-auto mb-4">
//                     <Users className="h-8 w-8 text-green-500" />
//                   </div>
//                   <h3 className="font-semibold mb-2">Project Organization</h3>
//                   <p className="text-sm text-muted-foreground">
//                     Organize tasks into projects and track progress with visual boards.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <AuthDialog
//           open={authDialogOpen}
//           onOpenChange={setAuthDialogOpen}
//           defaultMode="register"
//         />
//       </div>
//     );
//   }

//   // Authenticated user dashboard
//   return (
//     <div className="min-h-screen bg-background">
//       <div className="max-w-7xl mx-auto px-6 py-12">
//         <div className="flex items-center justify-between mb-12">
//           <div>
//             <h1 className="text-3xl font-light text-foreground mb-2">
//               Welcome back, {user?.name}!
//             </h1>
//             <p className="text-sm text-muted-foreground">
//               Manage your projects and track your progress
//             </p>
//           </div>
//           <Button onClick={handleNewProject} className="gap-2">
//             <Plus className="h-4 w-4" />
//             New Project
//           </Button>
//         </div>

//         {projects.length === 0 ? (
//           <div className="text-center py-24">
//             <div className="max-w-md mx-auto">
//               <h2 className="text-xl font-medium text-foreground mb-2">No projects yet</h2>
//               <p className="text-sm text-muted-foreground mb-8">
//                 Create your first project to get started with organizing your tasks
//               </p>
//               <Button onClick={handleNewProject} className="gap-2">
//                 <Plus className="h-4 w-4" />
//                 Create Project
//               </Button>
//             </div>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {projects.map((project) => (
//               <ProjectCard
//                 key={project.id}
//                 project={project}
//                 onEdit={handleEdit}
//                 onDelete={handleDelete}
//               />
//             ))}
//           </div>
//         )}

//         <ProjectDialog
//           open={dialogOpen}
//           onOpenChange={setDialogOpen}
//           project={editingProject}
//           onSave={handleSave}
//         />
//       </div>
//     </div>
//   );
// };

// export default Index;



import { ProjectCard } from '@/components/ProjectCard';
import { ProjectDialog } from '@/components/ProjectDialog';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useProjects } from '@/contexts/ProjectContext';
import { Project } from '@/services/project';
import { CheckSquare, Plus, Sparkles, Users } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { projects, addProject, updateProject, deleteProject } = useProjects();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleSave = async (data: { name: string; description: string }) => {
    try {
      if (editingProject) {
        await updateProject(editingProject._id, data);
      } else {
        await addProject(data);
      }
      setDialogOpen(false);
      setEditingProject(null);
    } catch (error) {
      // Error handling is done in ProjectContext
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProject(id);
    } catch (error) {
      // Error handling is done in ProjectContext
    }
  };

  const handleNewProject = () => {
    setEditingProject(null);
    setDialogOpen(true);
  };

  // Landing page for non-authenticated users
  if (!isAuthenticated) {
    return (
      <div className="bg-background">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Hero Section */}
          <div className="text-center py-24">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-center mb-8">
                <div className="p-4 bg-primary/10 rounded-2xl">
                  <Sparkles className="h-12 w-12 text-primary" />
                </div>
              </div>
              <h1 className="text-5xl font-light text-foreground mb-6">
                Organize Your Tasks with
                <span className="font-semibold text-primary"> TaskMate</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
                A modern task management application with AI-powered insights to help you stay organized and productive.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Button
                  size="lg"
                  onClick={() => navigate('/register')}
                  className="gap-2"
                >
                  <Sparkles className="h-5 w-5" />
                  Get Started Free
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                <div className="text-center">
                  <div className="p-3 bg-blue-500/10 rounded-xl w-fit mx-auto mb-4">
                    <CheckSquare className="h-8 w-8 text-blue-500" />
                  </div>
                  <h3 className="font-semibold mb-2">Task Management</h3>
                  <p className="text-sm text-muted-foreground">
                    Create, organize, and track your tasks with priority levels and color coding.
                  </p>
                </div>

                <div className="text-center">
                  <div className="p-3 bg-purple-500/10 rounded-xl w-fit mx-auto mb-4">
                    <Sparkles className="h-8 w-8 text-purple-500" />
                  </div>
                  <h3 className="font-semibold mb-2">AI Assistant</h3>
                  <p className="text-sm text-muted-foreground">
                    Get intelligent summaries and insights about your projects and tasks.
                  </p>
                </div>

                <div className="text-center">
                  <div className="p-3 bg-green-500/10 rounded-xl w-fit mx-auto mb-4">
                    <Users className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="font-semibold mb-2">Project Organization</h3>
                  <p className="text-sm text-muted-foreground">
                    Organize tasks into projects and track progress with visual boards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated user dashboard
  return (
    <>
      <DashboardHeader />
      <div className="bg-background">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-3xl font-light text-foreground mb-2">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage your projects and track your progress
              </p>
            </div>
            <Button onClick={handleNewProject} className="gap-2">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-24">
              <div className="max-w-md mx-auto">
                <h2 className="text-xl font-medium text-foreground mb-2">No projects yet</h2>
                <p className="text-sm text-muted-foreground mb-8">
                  Create your first project to get started with organizing your tasks
                </p>
                <Button onClick={handleNewProject} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Project
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

          <ProjectDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            project={editingProject}
            onSave={handleSave}
          />
        </div>
      </div>
    </>
  );
};

export default Index;