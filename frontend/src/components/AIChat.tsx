import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Task } from '@/contexts/TaskContext';
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
}

export const AIChat = ({ isOpen, onClose, tasks, projectName }: AIChatProps) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

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

        return {
            total: totalTasks,
            completed: completedTasks,
            inProgress: inProgressTasks,
            todo: todoTasks,
            highPriority: highPriorityTasks,
            mediumPriority: mediumPriorityTasks,
            lowPriority: lowPriorityTasks
        };
    };

    const generateAIResponse = async (userMessage: string): Promise<string> => {
        // Simulate AI processing delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

        const summary = getTaskSummary();
        const lowerMessage = userMessage.toLowerCase();

        if (lowerMessage.includes('summary') || lowerMessage.includes('overview')) {
            return `Here's a summary of your "${projectName}" project:\n\n` +
                `📊 **Task Overview:**\n` +
                `• Total Tasks: ${summary.total}\n` +
                `• Completed: ${summary.completed} (${Math.round((summary.completed / Math.max(summary.total, 1)) * 100)}%)\n` +
                `• In Progress: ${summary.inProgress}\n` +
                `• To Do: ${summary.todo}\n\n` +
                `🎯 **Priority Breakdown:**\n` +
                `• High Priority: ${summary.highPriority}\n` +
                `• Medium Priority: ${summary.mediumPriority}\n` +
                `• Low Priority: ${summary.lowPriority}`;
        }

        if (lowerMessage.includes('high priority') || lowerMessage.includes('urgent')) {
            const highPriorityTasks = tasks.filter(t => t.priority === 'high');
            if (highPriorityTasks.length === 0) {
                return "You have no high priority tasks at the moment. Great job staying on top of things! 🎉";
            }
            return `You have ${highPriorityTasks.length} high priority task(s):\n\n` +
                highPriorityTasks.map(task => `• ${task.title} (${task.status})`).join('\n');
        }

        if (lowerMessage.includes('completed') || lowerMessage.includes('done')) {
            const completedTasks = tasks.filter(t => t.status === 'done');
            if (completedTasks.length === 0) {
                return "No completed tasks yet. Keep working towards your goals! 💪";
            }
            return `You've completed ${completedTasks.length} task(s):\n\n` +
                completedTasks.map(task => `• ${task.title}`).join('\n');
        }

        if (lowerMessage.includes('progress') || lowerMessage.includes('in progress')) {
            const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
            if (inProgressTasks.length === 0) {
                return "No tasks are currently in progress. Consider moving some tasks forward! 🚀";
            }
            return `You have ${inProgressTasks.length} task(s) in progress:\n\n` +
                inProgressTasks.map(task => `• ${task.title}${task.priority === 'high' ? ' (High Priority)' : ''}`).join('\n');
        }

        if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
            return `I can help you with your "${projectName}" project! Here's what I can do:\n\n` +
                `🔍 **Ask me about:**\n` +
                `• "Give me a summary" - Get project overview\n` +
                `• "What are my high priority tasks?" - See urgent items\n` +
                `• "Show completed tasks" - Review finished work\n` +
                `• "What's in progress?" - Check active tasks\n\n` +
                `💡 **Try asking:**\n` +
                `• "How many tasks do I have?"\n` +
                `• "What's my progress?"\n` +
                `• "Which tasks need attention?"`;
        }

        // Default response for unrecognized queries
        return `I understand you're asking about "${userMessage}". While I'm still learning about your specific project needs, I can help you with:\n\n` +
            `• Project summaries and task overviews\n` +
            `• Priority and status information\n` +
            `• Progress tracking insights\n\n` +
            `Try asking me for a "summary" or "high priority tasks" to get started! 😊`;
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
        <div className="fixed inset-y-0 right-0 w-96 bg-background border-l border-border shadow-lg z-50 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm">AI Assistant</h3>
                        <p className="text-xs text-muted-foreground">{projectName}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={clearChat}
                        className="h-8 w-8"
                        title="Clear chat"
                    >
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="h-8 w-8"
                    >
                        <X className="h-4 w-4" />
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
                        <h4 className="font-medium mb-2">AI Assistant Ready</h4>
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
    );
};
