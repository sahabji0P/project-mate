// import { useNavigate } from 'react-router-dom';
// import { Project } from '@/contexts/ProjectContext';
// import { Button } from '@/components/ui/button';
// import { MoreHorizontal, Trash2, Edit } from 'lucide-react';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';

// interface ProjectCardProps {
//   project: Project;
//   onEdit: (project: Project) => void;
//   onDelete: (id: string) => void;
// }

// export const ProjectCard = ({ project, onEdit, onDelete }: ProjectCardProps) => {
//   const navigate = useNavigate();

//   return (
//     <div 
//       onClick={() => navigate(`/project/${project.id}`)}
//       className="group relative border border-border bg-card rounded-lg p-6 transition-all duration-300 hover:border-foreground/20 cursor-pointer"
//     >
//       <div className="flex items-start justify-between gap-4">
//         <div className="flex-1 min-w-0">
//           <h3 className="text-lg font-medium text-foreground mb-2 truncate">
//             {project.name}
//           </h3>
//           <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
//             {project.description}
//           </p>
//           <span className="text-xs text-muted-foreground font-mono">
//             {new Date(project.createdAt).toLocaleDateString('en-US', {
//               year: 'numeric',
//               month: 'short',
//               day: 'numeric'
//             })}
//           </span>
//         </div>

//         <DropdownMenu>
//           <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
//             <Button 
//               variant="ghost" 
//               size="icon"
//               className="opacity-0 group-hover:opacity-100 transition-opacity"
//             >
//               <MoreHorizontal className="h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuItem onClick={(e) => {
//               e.stopPropagation();
//               onEdit(project);
//             }}>
//               <Edit className="h-4 w-4 mr-2" />
//               Edit
//             </DropdownMenuItem>
//             <DropdownMenuItem 
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onDelete(project.id);
//               }}
//               className="text-destructive"
//             >
//               <Trash2 className="h-4 w-4 mr-2" />
//               Delete
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>
//     </div>
//   );
// };



import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Project } from '@/services/project';
import { Clock1, Edit, FolderOpen, LoaderIcon, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

export const ProjectCard = ({ project, onEdit, onDelete }: ProjectCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader onClick={() => navigate(`/board?project=${project._id}`)}>
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FolderOpen className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">{project.name}</CardTitle>
            <CardDescription className="mt-1.5 mb-5 line-clamp-2">
              {project.description || 'No description'}
            </CardDescription>
            <span className="text-s text-muted-foreground font-mono">
              <Clock1 className="inline mr-1 w-4" />
              {new Date(project.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
            <br />
            <span className="text-s text-muted-foreground font-mono">
              <LoaderIcon className="inline mr-1 w-4" />
              {new Date(project.updatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>


        </div>


      </CardHeader>

      <CardFooter className="flex justify-between pt-4 border-t">

        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(project);
          }}
          className="gap-2"
        >
          <Edit className="h-4 w-4" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(project._id);
          }}
          className="gap-2 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};