import { Github, Globe, Linkedin } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="w-full border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    {/* Left Side - Social Links */}
                    <div className="flex items-center gap-3 order-2 sm:order-1">
                        <a
                            href="https://www.linkedin.com/in/itsshashwatjain/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                            aria-label="LinkedIn"
                        >
                            <Linkedin className="h-4 w-4" />
                        </a>
                        <a
                            href="https://github.com/sahabji0P"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                            aria-label="GitHub"
                        >
                            <Github className="h-4 w-4" />
                        </a>
                        <a
                            href="https://shashwatjain.me"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                            aria-label="Website"
                        >
                            <Globe className="h-4 w-4" />
                        </a>
                    </div>

                    {/* Right Side - Developer Info */}
                    <div className="text-center sm:text-right order-1 sm:order-2">
                        <p className="text-sm text-muted-foreground">
                            Developed by{' '}
                            <a
                                href="https://shashwatjain.me"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-foreground hover:text-primary transition-colors"
                            >
                                Shashwat Jain
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};
