import { useNavigate } from 'react-router-dom';
import { Project } from '@/contexts/ProjectContext';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Trash2, Edit } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

export const ProjectCard = ({ project, onEdit, onDelete }: ProjectCardProps) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/project/${project.id}`)}
      className="group relative border border-border bg-card rounded-lg p-6 transition-all duration-300 hover:border-foreground/20 cursor-pointer"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-foreground mb-2 truncate">
            {project.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {project.description}
          </p>
          <span className="text-xs text-muted-foreground font-mono">
            {new Date(project.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </span>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button 
              variant="ghost" 
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              onEdit(project);
            }}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(project.id);
              }}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
