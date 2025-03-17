import { ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { Home, FileText, PieChart, Mic, Settings, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useAudio } from '@/hooks/use-audio';
import { VoiceCommandOverlay } from '@/components/ui/voice-command-overlay';

interface MainLayoutProps {
  children: ReactNode;
}

const menuItems = [
  { icon: Home, label: 'Início', href: '/' },
  { icon: FileText, label: 'Faturas', href: '/bill-reader' },
  { icon: PieChart, label: 'Dashboard', href: '/dashboard' },
  { icon: Mic, label: 'Lumin AI', href: '/chat' },
  { icon: Settings, label: 'Definições', href: '/settings' }
];

export function MainLayout({ children }: MainLayoutProps) {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { isListening } = useAudio();

  const MobileMenu = () => (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="left" className="w-[80%] p-0 bg-gradient-to-b from-[#004466] to-[#0088CC]">
        <div className="flex flex-col h-full">
          <div className="p-4 text-white">
            <h1 className="text-xl font-bold text-center">MY POUPAR+</h1>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                    "hover:bg-white/10",
                    isActive ? "bg-white/20 text-white" : "text-white/80"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Menu Mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#004466] p-4 flex items-center shadow-lg">
        <Button
          variant="ghost"
          size="icon"
          className="text-white"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <h1 className="text-white text-lg font-bold ml-4">MY POUPAR+</h1>
      </div>
      <MobileMenu />

      {/* Menu Desktop */}
      <div className="hidden lg:block w-16 hover:w-64 transition-all duration-300 bg-gradient-to-b from-[#004466] to-[#0088CC] fixed h-full shadow-xl group">
        <div className="p-4">
          <h1 className="text-xl font-bold text-white text-center mb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            MY POUPAR+
          </h1>
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                    "hover:bg-white/10",
                    isActive ? "bg-white/20 text-white" : "text-white/80"
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Área Principal */}
      <main className="flex-1 lg:ml-16 p-4 lg:p-8 mt-16 lg:mt-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Voice Command Overlay */}
      <VoiceCommandOverlay isListening={isListening} />
    </div>
  );
}