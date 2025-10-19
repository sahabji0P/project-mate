import { useState } from 'react';
import { Task, ListSection } from '@/contexts/TaskContext';
import { ListViewTaskItem } from '@/components/ListViewTaskItem';
import { ChevronDown, ChevronRight, Eye, EyeOff } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface ListViewSectionProps {
  title: string;
  section: ListSection;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, section: ListSection) => void;
  draggedTaskId: string | null;
}

export const ListViewSection = ({
  title,
  section,
  tasks,
  onEdit,
  onDelete,
  onToggleComplete,
  onDragStart,
  onDragOver,
  onDrop,
  draggedTaskId,
}: ListViewSectionProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showCompleted, setShowCompleted] = useState(true);

  const filteredTasks = showCompleted 
    ? tasks 
    : tasks.filter(task => task.status !== 'done' && !task.completed);

  const handleDragOver = (e: React.DragEvent) => {
    onDragOver(e);
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    onDrop(e, section);
    setIsDragOver(false);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <CollapsibleTrigger className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors flex-1">
          {isOpen ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
          <h3 className="text-sm font-medium text-foreground">{title}</h3>
          <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
            {filteredTasks.length}/{tasks.length}
          </span>
        </CollapsibleTrigger>
        
        <div className="flex items-center gap-2 ml-2">
          <Label htmlFor={`show-completed-${section}`} className="text-xs text-muted-foreground cursor-pointer">
            {showCompleted ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Label>
          <Switch
            id={`show-completed-${section}`}
            checked={showCompleted}
            onCheckedChange={setShowCompleted}
            className="scale-75"
          />
        </div>
      </div>
      
      <CollapsibleContent className="mt-2">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`min-h-[100px] p-2 rounded-md transition-all duration-200 ${
            isDragOver ? 'bg-accent/50 ring-2 ring-accent-foreground/20' : ''
          }`}
        >
          {filteredTasks.length === 0 ? (
            <div className="flex items-center justify-center h-20 text-xs text-muted-foreground">
              {tasks.length === 0 ? 'No tasks in this section' : 'No tasks to display'}
            </div>
          ) : (
            filteredTasks.map((task) => (
              <ListViewTaskItem
                key={task.id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleComplete={onToggleComplete}
                onDragStart={onDragStart}
                isDragging={draggedTaskId === task.id}
              />
            ))
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
