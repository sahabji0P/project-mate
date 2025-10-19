import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Task, TaskStatus } from '@/contexts/TaskContext';
import { Circle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  defaultStatus?: TaskStatus;
  onSave: (data: { title: string; description: string; status: TaskStatus; priority?: 'high' | 'medium' | 'low'; color?: string }) => void;
}

const COLORS = [
  { name: 'None', value: '' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Pink', value: '#ec4899' },
];

const STATUS_LABELS: Record<TaskStatus, string> = {
  'todo': 'To Do',
  'in-progress': 'In Progress',
  'done': 'Done',
};

export const TaskDialog = ({ open, onOpenChange, task, defaultStatus, onSave }: TaskDialogProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(defaultStatus || 'todo');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low' | 'none'>('none');
  const [color, setColor] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
      setPriority(task.priority || 'none');
      setColor(task.color || '');
    } else {
      setTitle('');
      setDescription('');
      setStatus(defaultStatus || 'todo');
      setPriority('none');
      setColor('');
    }
  }, [task, defaultStatus, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSave({
        title,
        description,
        status,
        priority: priority === 'none' ? undefined : priority,
        color: color || undefined
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{task ? 'Edit Task' : 'Create Task'}</DialogTitle>
            <DialogDescription>
              {task ? 'Update your task details.' : 'Add a new task to your board.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description"
                rows={4}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as TaskStatus)}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(value) => setPriority(value as 'high' | 'medium' | 'low' | 'none')}>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="color">Color Tag</Label>
              <div className="grid grid-cols-8 gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setColor(c.value)}
                    className={`h-8 rounded-md border-2 transition-all ${color === c.value ? 'border-foreground scale-110' : 'border-border'
                      }`}
                    style={{ backgroundColor: c.value || 'transparent' }}
                    title={c.name}
                  >
                    {!c.value && <Circle className="h-4 w-4 mx-auto text-muted-foreground" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {task ? 'Save Changes' : 'Create Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
