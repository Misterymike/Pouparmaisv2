import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Mic, Command } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type VoiceCommand = {
  command: string;
  description: string;
  context?: string[];
};

const VOICE_COMMANDS: VoiceCommand[] = [
  { 
    command: "Abrir faturas", 
    description: "Navega para o leitor de faturas",
    context: ["/", "/dashboard"] 
  },
  { 
    command: "Análise financeira", 
    description: "Mostra análise detalhada das suas finanças",
    context: ["/", "/dashboard", "/expenses"] 
  },
  { 
    command: "Como economizar", 
    description: "Exibe dicas personalizadas de economia",
    context: ["*"] 
  },
  { 
    command: "Voltar", 
    description: "Retorna para a página anterior",
    context: ["*"] 
  },
  {
    command: "Mostrar simulador",
    description: "Abre o simulador de poupança",
    context: ["/", "/expenses", "/dreams"]
  },
  {
    command: "Ajuda",
    description: "Mostra ajuda sobre a página atual",
    context: ["*"]
  },
  {
    command: "Ativar música",
    description: "Ativa/desativa música de fundo",
    context: ["*"]
  }
];

export function VoiceCommandOverlay({
  isListening,
  className,
}: {
  isListening: boolean;
  className?: string;
}) {
  const [location] = useLocation();
  const [relevantCommands, setRelevantCommands] = useState<VoiceCommand[]>([]);

  useEffect(() => {
    // Filter commands based on current context/location
    const filtered = VOICE_COMMANDS.filter(
      cmd => cmd.context?.includes("*") || cmd.context?.includes(location)
    );
    setRelevantCommands(filtered);

    // Debug logs
    console.log("Voice Command Overlay - Current location:", location);
    console.log("Voice Command Overlay - isListening:", isListening);
    console.log("Voice Command Overlay - Filtered commands:", filtered);
  }, [location, isListening]);

  return (
    <AnimatePresence>
      {isListening && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className={cn(
            "fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-lg bg-background/80 backdrop-blur-lg rounded-lg border shadow-lg p-4",
            "dark:bg-gray-900/80 dark:border-gray-800",
            className
          )}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="relative">
              <Mic className="h-5 w-5 text-primary animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
            </div>
            <h3 className="text-sm font-medium text-foreground">Comandos de Voz Disponíveis</h3>
          </div>

          <div className="space-y-2">
            {relevantCommands.map((cmd, index) => (
              <motion.div
                key={cmd.command}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-accent/50 transition-colors group"
              >
                <Command className="h-4 w-4 text-muted-foreground group-hover:text-accent-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground group-hover:text-accent-foreground">{cmd.command}</p>
                  <p className="text-xs text-muted-foreground">{cmd.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}