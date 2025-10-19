import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface AIChatToggleProps {
    onClick: () => void;
    isOpen: boolean;
}

export const AIChatToggle = ({ onClick, isOpen }: AIChatToggleProps) => {
    return (
        <Button
            onClick={onClick}
            variant={isOpen ? "secondary" : "outline"}
            size="icon"
            className={`fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-40 transition-all duration-300 ${isOpen ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-accent'
                }`}
            title={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
        >
            <Sparkles className={`h-6 w-6 transition-transform duration-300 ${isOpen ? 'rotate-12' : ''}`} />
        </Button>
    );
};
