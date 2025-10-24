import { AIChat } from '@/components/AIChat';
import { AIChatToggle } from '@/components/AIChatToggle';
import { TaskBoardHeader } from '@/components/layout/TaskBoardHeader';
import { ListViewSection } from '@/components/ListViewSection';
import { TaskColumn } from '@/components/TaskColumn';
import { TaskDialog } from '@/components/TaskDialog';
import { Button } from '@/components/ui/button';
import { useProjects } from '@/contexts/ProjectContext';
import { ListSection, Task, TaskStatus, useTasks } from '@/contexts/TaskContext';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

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
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project');
  const navigate = useNavigate();
  const { projects } = useProjects();
  const { getTasksByProject, fetchTasksForProject, addTask, updateTask, deleteTask, moveTask, isLoading } = useTasks();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('todo');
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [aiChatOpen, setAiChatOpen] = useState(false);

  const project = projects.find(p => p._id === projectId);
  const tasks = projectId ? getTasksByProject(projectId) : [];

  // Fetch tasks when component mounts or projectId changes
  useEffect(() => {
    if (projectId) {
      fetchTasksForProject(projectId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  if (!project) {
    return (
      <div className="bg-background flex items-center justify-center py-24">
        <div className="text-center">
          <h2 className="text-xl font-medium text-foreground mb-4">Project not found</h2>
          <Button onClick={() => navigate('/')}>Back to Projects</Button>
        </div>
      </div>
    );
  }

  const handleSave = async (data: {
    title: string;
    description: string;
    status: TaskStatus;
    priority?: 'high' | 'medium' | 'low';
    color?: string;
    listSection?: ListSection;
  }) => {
    if (!projectId) return;

    try {
      if (editingTask) {
        await updateTask(projectId, editingTask._id, data);
      } else {
        await addTask(projectId, data);
      }
      setDialogOpen(false);
      setEditingTask(null);
    } catch (error) {
      // Error handling is done in TaskContext
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!projectId) return;

    try {
      await deleteTask(projectId, id);
    } catch (error) {
      // Error handling is done in TaskContext
    }
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

  const handleDrop = async (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    if (!projectId || !draggedTaskId) return;

    try {
      await moveTask(projectId, draggedTaskId, status);
      setDraggedTaskId(null);
    } catch (error) {
      // Error handling is done in TaskContext
    }
  };

  const handleListDrop = async (e: React.DragEvent, section: ListSection) => {
    e.preventDefault();
    if (!projectId || !draggedTaskId) return;

    try {
      await updateTask(projectId, draggedTaskId, { listSection: section });
      setDraggedTaskId(null);
    } catch (error) {
      // Error handling is done in TaskContext
    }
  };

  const handleToggleComplete = async (id: string) => {
    if (!projectId) return;

    const task = tasks.find(t => t._id === id);
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

      try {
        await updateTask(projectId, id, {
          completed: newCompleted,
          status: newStatus
        });
      } catch (error) {
        // Error handling is done in TaskContext
      }
    }
  };

  return (
    <>
      <TaskBoardHeader
        projectName={project.name}
        projectDescription={project.description}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAddTask={() => handleAddTask('todo')}
      />

      <div className="bg-background">
        <div
          className={`max-w-[1400px] mx-auto px-6 py-8 transition-all duration-300 ${aiChatOpen ? 'md:pr-[25rem]' : ''
            }`}
        >
          {viewMode === 'kanban' ? (
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 md:overflow-x-auto pb-4">              {STATUS_COLUMNS.map(({ title, status }) => (
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
            projectId={projectId}
          />
        </div>
      </div>
    </>
  );
};

export default TaskBoard;
