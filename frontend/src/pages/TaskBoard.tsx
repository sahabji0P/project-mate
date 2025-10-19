import { AIChat } from '@/components/AIChat';
import { AIChatToggle } from '@/components/AIChatToggle';
import { ListViewSection } from '@/components/ListViewSection';
import { TaskColumn } from '@/components/TaskColumn';
import { TaskDialog } from '@/components/TaskDialog';
import { Button } from '@/components/ui/button';
import { useProjects } from '@/contexts/ProjectContext';
import { ListSection, Task, TaskStatus, useTasks } from '@/contexts/TaskContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, LayoutGrid, List, Plus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const STATUS_COLUMNS: { title: string; status: TaskStatus }[] = [
  { title: 'To Do', status: 'todo' },
  { title: 'In Progress', status: 'in-progress' },
  { title: 'Done', status: 'done' },
];

const LIST_SECTIONS: { title: string; section: ListSection }[] = [
  { title: 'Today', section: 'today' },
  { title: 'Tomorrow', section: 'tomorrow' },
  { title: 'Later', section: 'later' },
];

const TaskBoard = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { projects } = useProjects();
  const { getTasksByProject, addTask, updateTask, deleteTask, moveTask } = useTasks();
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('todo');
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [aiChatOpen, setAiChatOpen] = useState(false);

  const project = projects.find(p => p.id === projectId);
  const tasks = projectId ? getTasksByProject(projectId) : [];

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium text-foreground mb-4">Project not found</h2>
          <Button onClick={() => navigate('/')}>Back to Projects</Button>
        </div>
      </div>
    );
  }

  const handleSave = (data: { title: string; description: string; status: TaskStatus; priority?: 'high' | 'medium' | 'low'; color?: string }) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
      toast({ title: 'Task updated', description: 'Your task has been updated successfully.' });
    } else {
      addTask({ ...data, projectId: projectId! });
      toast({ title: 'Task created', description: 'Your new task has been created successfully.' });
    }
    setEditingTask(null);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteTask(id);
    toast({ title: 'Task deleted', description: 'The task has been removed.' });
  };

  const handleAddTask = (status: TaskStatus) => {
    setDefaultStatus(status);
    setEditingTask(null);
    setDialogOpen(true);
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    if (draggedTaskId) {
      moveTask(draggedTaskId, status);
      setDraggedTaskId(null);
    }
  };

  const handleListDrop = (e: React.DragEvent, section: ListSection) => {
    e.preventDefault();
    if (draggedTaskId) {
      updateTask(draggedTaskId, { listSection: section });
      setDraggedTaskId(null);
    }
  };

  const handleToggleComplete = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      let newStatus: TaskStatus;
      let newCompleted: boolean;

      // If task is currently completed or done, uncheck it and move to todo
      if (task.completed || task.status === 'done') {
        newStatus = 'todo';
        newCompleted = false;
      } else {
        // If task is in todo, move to in-progress
        if (task.status === 'todo') {
          newStatus = 'in-progress';
          newCompleted = false;
        }
        // If task is in-progress, move to done
        else if (task.status === 'in-progress') {
          newStatus = 'done';
          newCompleted = true;
        }
        // Fallback (shouldn't happen)
        else {
          newStatus = 'done';
          newCompleted = true;
        }
      }

      updateTask(id, {
        completed: newCompleted,
        status: newStatus
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-light text-foreground mb-1">{project.name}</h1>
              <p className="text-sm text-muted-foreground">{project.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === 'kanban' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('kanban')}
                className="gap-2"
              >
                <LayoutGrid className="h-4 w-4" />
                Kanban
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="gap-2"
              >
                <List className="h-4 w-4" />
                List
              </Button>
            </div>
            <Button onClick={() => handleAddTask('todo')} className="gap-2">
              <Plus className="h-4 w-4" />
              New Task
            </Button>
          </div>
        </div>

        {viewMode === 'kanban' ? (
          <div className="flex gap-6 overflow-x-auto pb-4">
            {STATUS_COLUMNS.map(({ title, status }) => (
              <TaskColumn
                key={status}
                title={title}
                status={status}
                tasks={tasks.filter(t => t.status === status)}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleComplete={handleToggleComplete}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onAddTask={handleAddTask}
                draggedTaskId={draggedTaskId}
              />
            ))}
          </div>
        ) : (
          <div className="max-w-3xl">
            {LIST_SECTIONS.map(({ title, section }) => (
              <ListViewSection
                key={section}
                title={title}
                section={section}
                tasks={tasks.filter(t => (t.listSection || 'today') === section)}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleComplete={handleToggleComplete}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleListDrop}
                draggedTaskId={draggedTaskId}
              />
            ))}
          </div>
        )}

        <TaskDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          task={editingTask}
          defaultStatus={defaultStatus}
          onSave={handleSave}
        />

        {/* AI Chat Components */}
        <AIChatToggle
          onClick={() => setAiChatOpen(!aiChatOpen)}
          isOpen={aiChatOpen}
        />
        <AIChat
          isOpen={aiChatOpen}
          onClose={() => setAiChatOpen(false)}
          tasks={tasks}
          projectName={project.name}
        />
      </div>
    </div>
  );
};

export default TaskBoard;
