import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Task } from '@/contexts/TaskContext';
import { useToast } from '@/hooks/use-toast';
import aiService from '@/services/ai';
import {
    Bot,
    RefreshCw,
    Send,
    Sparkles,
    User,
    X
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Message {
    id: string;
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
}

interface AIChatProps {
    isOpen: boolean;
    onClose: () => void;
    tasks: Task[];
    projectName: string;
    projectId?: string;
}

export const AIChat = ({ isOpen, onClose, tasks, projectName, projectId }: AIChatProps) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const getTaskSummary = () => {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.status === 'done').length;
        const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
        const todoTasks = tasks.filter(t => t.status === 'todo').length;

        const highPriorityTasks = tasks.filter(t => t.priority === 'high').length;
        const mediumPriorityTasks = tasks.filter(t => t.priority === 'medium').length;
        const lowPriorityTasks = tasks.filter(t => t.priority === 'low').length;

        const todayTasks = tasks.filter(t => t.listSection === 'today').length;
        const tomorrowTasks = tasks.filter(t => t.listSection === 'tomorrow').length;
        const laterTasks = tasks.filter(t => t.listSection === 'later').length;

        return {
            total: totalTasks,
            completed: completedTasks,
            inProgress: inProgressTasks,
            todo: todoTasks,
            highPriority: highPriorityTasks,
            mediumPriority: mediumPriorityTasks,
            lowPriority: lowPriorityTasks,
            today: todayTasks,
            tomorrow: tomorrowTasks,
            later: laterTasks
        };
    };

    const generateAIResponse = async (userMessage: string): Promise<string> => {
        try {
            // Use real AI service to get response
            const response = await aiService.sendChatMessage(userMessage, projectId);
            return response.message;
        } catch (error) {
            console.error('AI chat error:', error);

            // Fallback to local summary if API fails
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { status?: number } };
                if (axiosError.response?.status === 401) {
                    throw error; // Re-throw auth errors to be handled by interceptor
                }
            }

            toast({
                title: 'AI Service Unavailable',
                description: 'Showing local task summary instead.',
                variant: 'destructive',
            });

            // Fallback to local summary
            const summary = getTaskSummary();
            return `Here's a local summary of your "${projectName}" project:\n\n` +
                `� **Task Overview:**\n` +
                `• Total Tasks: ${summary.total}\n` +
                `• Completed: ${summary.completed} (${Math.round((summary.completed / Math.max(summary.total, 1)) * 100)}%)\n` +
                `• In Progress: ${summary.inProgress}\n` +
                `• To Do: ${summary.todo}\n\n` +
                `🎯 **Priority Breakdown:**\n` +
                `• High Priority: ${summary.highPriority}\n` +
                `• Medium Priority: ${summary.mediumPriority}\n` +
                `• Low Priority: ${summary.lowPriority}\n\n` +
                `_Note: AI assistant is temporarily unavailable._`;
        }
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            type: 'user',
            content: inputValue.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const aiResponse = await generateAIResponse(userMessage.content);
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                type: 'ai',
                content: aiResponse,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                type: 'ai',
                content: 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const clearChat = () => {
        setMessages([]);
    };

    const quickActions = [
        { label: 'Project Summary', query: 'Give me a summary' },
        { label: 'High Priority Tasks', query: 'What are my high priority tasks?' },
        { label: 'Progress Update', query: 'What\'s in progress?' },
        { label: 'Completed Tasks', query: 'Show completed tasks' }
    ];

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop overlay for mobile - click to close */}
            <div
                className="fixed inset-0 bg-black/50 z-20 md:hidden"
                onClick={onClose}
                aria-label="Close AI chat"
            />

            {/* AI Chat Panel */}
            <div className={`fixed top-16 bottom-0 right-0 w-full md:w-96 bg-background border-l border-border shadow-2xl z-30 flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Sparkles className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm">Saathi - Task Manager</h3>
                            <p className="text-xs text-muted-foreground">{projectName}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={clearChat}
                            className="h-8 w-8 hidden md:flex"
                            title="Clear chat"
                        >
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="h-9 w-9 md:h-8 md:w-8"
                            title="Close AI Assistant"
                        >
                            <X className="h-5 w-5 md:h-4 md:w-4" />
                        </Button>
                    </div>
                </div>

                {/* Quick Actions */}
                {messages.length === 0 && (
                    <div className="p-4 border-b border-border">
                        <p className="text-xs text-muted-foreground mb-3">Quick actions:</p>
                        <div className="grid grid-cols-2 gap-2">
                            {quickActions.map((action, index) => (
                                <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    className="text-xs h-8"
                                    onClick={() => setInputValue(action.query)}
                                >
                                    {action.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="p-4 bg-primary/5 rounded-full mb-4">
                                <Bot className="h-8 w-8 text-primary" />
                            </div>
                            <h4 className="font-medium mb-2">Your Task Saathi Ready</h4>
                            <p className="text-sm text-muted-foreground mb-4">
                                Ask me anything about your project tasks and progress.
                            </p>
                            <div className="text-xs text-muted-foreground">
                                <p>Try: "Give me a summary" or "What are my high priority tasks?"</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {message.type === 'ai' && (
                                        <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                            <Bot className="h-4 w-4 text-primary" />
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${message.type === 'user'
                                            ? 'bg-primary text-primary-foreground ml-auto'
                                            : 'bg-muted'
                                            }`}
                                    >
                                        <div className="whitespace-pre-wrap">{message.content}</div>
                                        <div
                                            className={`text-xs mt-1 opacity-70 ${message.type === 'user' ? 'text-primary-foreground' : 'text-muted-foreground'
                                                }`}
                                        >
                                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                    {message.type === 'user' && (
                                        <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                            <User className="h-4 w-4 text-primary-foreground" />
                                        </div>
                                    )}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                        <Bot className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="bg-muted rounded-lg px-3 py-2">
                                        <div className="flex items-center gap-2">
                                            <div className="animate-spin rounded-full h-3 w-3 border-2 border-primary border-t-transparent"></div>
                                            <span className="text-sm text-muted-foreground">Thinking...</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </ScrollArea>

                {/* Input */}
                <div className="p-4 border-t border-border">
                    <div className="flex gap-2">
                        <Input
                            ref={inputRef}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask about your tasks..."
                            disabled={isLoading}
                            className="flex-1"
                        />
                        <Button
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim() || isLoading}
                            size="icon"
                            className="flex-shrink-0"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        Ask about summaries, priorities, progress, or any task-related questions.
                    </p>
                </div>
            </div>
        </>
    );
};
