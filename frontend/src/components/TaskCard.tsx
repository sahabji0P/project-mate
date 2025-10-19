import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Task } from '@/contexts/TaskContext';
import { AlertCircle, Edit, GripVertical, MoreHorizontal, Trash2 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  isDragging?: boolean;
}

export const TaskCard = ({ task, onEdit, onDelete, onToggleComplete, onDragStart, isDragging }: TaskCardProps) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      className={`group bg-card border-l-4 border-t border-r border-b rounded-lg p-4 mb-3 cursor-move transition-all duration-300 hover:border-foreground/20 hover:shadow-md animate-fade-in ${isDragging ? 'opacity-50 scale-95' : 'opacity-100'
        }`}
      style={{ borderLeftColor: task.color || 'transparent' }}
    >
      <div className="flex items-start gap-3">
        <div className="pt-1 opacity-0 group-hover:opacity-40 transition-opacity">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>

        <Checkbox
          checked={task.completed || task.status === 'done'}
          onCheckedChange={() => onToggleComplete(task.id)}
          className="mt-0.5"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h4 className={`text-sm font-medium text-foreground break-words flex-1 ${task.status === 'done' || task.completed ? 'line-through opacity-60' : ''
              }`}>
              {task.title}
            </h4>
            {task.priority === 'high' && (
              <Badge variant="destructive" className="text-xs gap-1 flex-shrink-0">
                <AlertCircle className="h-3 w-3" />
                High
              </Badge>
            )}
            {task.priority === 'medium' && (
              <Badge variant="default" className="text-xs gap-1 flex-shrink-0 bg-yellow-500 text-yellow-50">
                <AlertCircle className="h-3 w-3" />
                Medium
              </Badge>
            )}
            {task.priority === 'low' && (
              <Badge variant="secondary" className="text-xs flex-shrink-0">
                Low
              </Badge>
            )}
          </div>
          {task.description && (
            <p className={`text-xs text-muted-foreground line-clamp-3 break-words ${task.status === 'done' || task.completed ? 'line-through opacity-50' : ''
              }`}>
              {task.description}
            </p>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
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
