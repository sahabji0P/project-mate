import { TaskCard } from '@/components/TaskCard';
import { Button } from '@/components/ui/button';
import { Task, TaskStatus } from '@/contexts/TaskContext';
import { Plus } from 'lucide-react';
import { useState } from 'react';

interface TaskColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: TaskStatus) => void;
  onAddTask: (status: TaskStatus) => void;
  draggedTaskId: string | null;
}

export const TaskColumn = ({
  title,
  status,
  tasks,
  onEdit,
  onDelete,
  onToggleComplete,
  onDragStart,
  onDragOver,
  onDrop,
  onAddTask,
  draggedTaskId,
}: TaskColumnProps) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    onDragOver(e);
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    onDrop(e, status);
    setIsDragOver(false);
  };

  const getColumnColor = () => {
    switch (status) {
      case 'todo':
        return 'bg-red-500/5';
      case 'in-progress':
        return 'bg-yellow-500/5';
      case 'done':
        return 'bg-green-500/5';
      default:
        return 'bg-muted/30';
    }
  };

  return (
    <div className={`flex-1 w-full md:min-w-[280px] ${getColumnColor()} rounded-lg p-4 transition-all duration-300`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-foreground">{title}</h3>
          <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
            {tasks.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-background/50"
          onClick={() => onAddTask(status)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`space-y-0 min-h-[200px] rounded-md transition-all duration-200 ${isDragOver ? 'bg-accent/50 ring-2 ring-accent-foreground/20' : ''
          }`}
      >
        {tasks.length === 0 && !isDragOver && (
          <div className="flex items-center justify-center h-32 text-xs text-muted-foreground">
            Drop tasks here
          </div>
        )}
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleComplete={onToggleComplete}
            onDragStart={onDragStart}
            isDragging={draggedTaskId === task._id}
          />
        ))}
      </div>
    </div>
  );
};
