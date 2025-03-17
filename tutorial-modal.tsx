import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Award, Coins, Calculator, Wallet2 } from "lucide-react";

const TUTORIAL_STEPS = [
  {
    title: "Bem-vindo ao POUPAR+! 👋",
    description: "Vamos te ajudar a economizar dinheiro de forma divertida e inteligente. Siga este tutorial para ganhar suas primeiras recompensas!",
    reward: { coins: 50, experience: 100 },
    icon: Award,
    narration: "Olá! Sou o Lumin, seu assistente financeiro inteligente. Vou te guiar através da nossa aplicação para que você aproveite ao máximo todas as funcionalidades. Vamos começar?"
  },
  {
    title: "Simulador de Economia 💰",
    description: "Use nosso simulador para descobrir quanto pode poupar em suas contas. Clique no card 'Simulador' para começar.",
    path: "/simulator",
    reward: { coins: 100, experience: 200 },
    icon: Calculator,
    narration: "No simulador, você pode calcular suas potenciais economias em faturas de energia e telecomunicações. É uma ferramenta poderosa que já ajudou milhares de usuários a economizar."
  },
  {
    title: "Sua Carteira Digital 🎯",
    description: "Acompanhe suas economias e conquistas na carteira. Visite a seção 'Carteira' para ver seu progresso.",
    path: "/wallet",
    reward: { coins: 100, experience: 200 },
    icon: Wallet2,
    narration: "Na sua carteira digital, você pode acompanhar seus POUPAR Coins acumulados e trocar por recompensas reais. Cada economia que você faz se transforma em coins!"
  }
];

export function TutorialModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const speak = useCallback((text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pt-PT";
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  }, []);

  useEffect(() => {
    // Só mostra o tutorial se o usuário for novo (level 1 e experience 0)
    // e se o tutorial ainda não foi iniciado
    if (user?.level === 1 && user?.experience === 0 && !hasStarted) {
      setIsOpen(true);
      setHasStarted(true);
      // Inicia a narração do primeiro passo
      speak(TUTORIAL_STEPS[0].narration);
    }
  }, [user, speak, hasStarted]);

  const handleStepComplete = async () => {
    if (isProcessing) return; // Previne múltiplos cliques

    try {
      setIsProcessing(true);
      const step = TUTORIAL_STEPS[currentStep];

      // Atualiza progresso e concede recompensa
      await apiRequest("POST", "/api/tutorial-progress", {
        step: currentStep,
        coinsEarned: step.reward.coins,
        experienceEarned: step.reward.experience,
      });

      // Atualiza o cache do usuário
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });

      toast({
        title: "Parabéns! 🎉",
        description: `Você ganhou ${step.reward.coins} POUPAR Coins e ${step.reward.experience} XP!`,
      });

      // Reproduz som de moedas ao ganhar recompensa
      const coinSound = new Audio("/sounds/coin.mp3");
      coinSound.play();

      if (currentStep + 1 < TUTORIAL_STEPS.length) {
        setCurrentStep(currentStep + 1);
        // Narra o próximo passo
        speak(TUTORIAL_STEPS[currentStep + 1].narration);
      } else {
        setIsOpen(false);
        // Mensagem final do Lumin
        speak("Parabéns! Agora você está pronto para começar sua jornada de economia inteligente. Estou aqui para ajudar sempre que precisar!");
      }
    } catch (error) {
      console.error("Erro ao atualizar progresso:", error);
      toast({
        title: "Erro ao avançar",
        description: "Não foi possível salvar seu progresso. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const currentStepData = TUTORIAL_STEPS[currentStep];
  const StepIcon = currentStepData.icon;

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        // Só permite fechar o modal quando não estiver processando
        if (!isProcessing) {
          setIsOpen(open);
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <StepIcon className="h-6 w-6 text-green-500" />
            {currentStepData.title}
          </DialogTitle>
          <DialogDescription>
            {currentStepData.description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-4 my-4">
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-yellow-500" />
            <span>+{currentStepData.reward.coins}</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-500" />
            <span>+{currentStepData.reward.experience} XP</span>
          </div>
        </div>

        <div className="mt-4 flex justify-between">
          <div className="flex gap-1">
            {TUTORIAL_STEPS.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full ${
                  index === currentStep ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <Button 
            onClick={handleStepComplete}
            disabled={isProcessing}
            className="transform transition-all duration-200 hover:scale-105"
          >
            {isProcessing ? "Processando..." : currentStep + 1 === TUTORIAL_STEPS.length ? "Concluir" : "Próximo"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}