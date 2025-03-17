import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { format, addMonths, differenceInMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Target, PiggyBank, Calendar, Info } from "lucide-react";
import { getLuminResponse } from "@/lib/lumin-ai";
import { motion } from "framer-motion";

type GoalType = "savings" | "investment" | "debt_repayment";
type GoalCategory = "emergency_fund" | "house" | "car" | "education" | "retirement" | "travel" | "other";

interface Goal {
  type: GoalType;
  category: GoalCategory;
  name: string;
  targetAmount: number;
  monthlyContribution: number;
  startDate: Date;
  targetDate: Date;
}

interface GoalWizardProps {
  onComplete: (goal: Omit<Goal, "id" | "currentAmount">) => void;
  onCancel: () => void;
}

export function GoalWizard({ onComplete, onCancel }: GoalWizardProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState<Partial<Goal>>({
    startDate: new Date(),
  });
  const [aiRecommendation, setAiRecommendation] = useState<string | null>(null);

  const updateGoal = async (updates: Partial<Goal>) => {
    setGoal((prev) => ({ ...prev, ...updates }));

    if (updates.type && updates.category && !aiRecommendation) {
      try {
        const response = await getLuminResponse(`Quero ${updates.category === 'house' ? 'comprar uma casa' : 
          updates.category === 'car' ? 'comprar um carro' : 
          updates.category === 'education' ? 'investir em educação' : 
          updates.category === 'retirement' ? 'planejar minha aposentadoria' : 
          'criar uma reserva de emergência'}`);

        if (response.recommendations) {
          const { monthlyContribution, timeframe, savingsGoal } = response.recommendations;
          setAiRecommendation(response.response);

          if (savingsGoal) {
            setGoal(prev => ({
              ...prev,
              targetAmount: savingsGoal,
              monthlyContribution: monthlyContribution || (savingsGoal / (timeframe || 12)),
              targetDate: addMonths(new Date(), timeframe || 12)
            }));
          }
        }
      } catch (error) {
        console.error("Error getting AI recommendations:", error);
      }
    }
  };

  const calculateMonthlyContribution = () => {
    if (goal.targetAmount && goal.targetDate) {
      const months = differenceInMonths(goal.targetDate, goal.startDate || new Date());
      if (months > 0) {
        const monthly = goal.targetAmount / months;
        updateGoal({ monthlyContribution: Math.ceil(monthly * 100) / 100 });
      }
    }
  };

  const handleNext = () => {
    if (step === 1 && (!goal.type || !goal.category || !goal.name)) {
      toast({
        title: "Campos Obrigatórios",
        description: "Por favor, preencha todos os campos antes de continuar.",
        variant: "destructive",
      });
      return;
    }

    if (step === 2 && !goal.targetAmount) {
      toast({
        title: "Valor Obrigatório",
        description: "Por favor, defina o valor do seu objetivo.",
        variant: "destructive",
      });
      return;
    }

    if (step === 3 && !goal.targetDate) {
      toast({
        title: "Data Obrigatória",
        description: "Por favor, defina a data alvo do seu objetivo.",
        variant: "destructive",
      });
      return;
    }

    if (step === 4) {
      if (!goal.monthlyContribution) {
        calculateMonthlyContribution();
      }
      onComplete(goal as Goal);
      return;
    }

    setStep(step + 1);
    if (step === 3) {
      calculateMonthlyContribution();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-lg mx-auto bg-white/10 backdrop-blur-lg border-white/20">
        <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-center text-white">
              Criar Novo Objetivo
            </h2>
            <Progress 
              value={(step / 4) * 100} 
              className="h-2 bg-white/20"
              indicatorClassName="bg-gradient-to-r from-indigo-400 to-purple-500"
            />
          </div>

          {step === 1 && (
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Tipo de Objetivo</label>
                <Select
                  value={goal.type}
                  onValueChange={(value: GoalType) => updateGoal({ type: value })}
                >
                  <SelectTrigger className="w-full bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="savings">Poupança</SelectItem>
                    <SelectItem value="investment">Investimento</SelectItem>
                    <SelectItem value="debt_repayment">Pagamento de Dívida</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white">Categoria</label>
                <Select
                  value={goal.category}
                  onValueChange={(value: GoalCategory) => updateGoal({ category: value })}
                >
                  <SelectTrigger className="w-full bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="emergency_fund">Fundo de Emergência</SelectItem>
                    <SelectItem value="house">Casa</SelectItem>
                    <SelectItem value="car">Carro</SelectItem>
                    <SelectItem value="education">Educação</SelectItem>
                    <SelectItem value="retirement">Aposentadoria</SelectItem>
                    <SelectItem value="travel">Viagem</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white">Nome do Objetivo</label>
                <Input
                  value={goal.name || ""}
                  onChange={(e) => updateGoal({ name: e.target.value })}
                  placeholder="Ex: Comprar uma casa"
                  className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>

              {aiRecommendation && (
                <div className="bg-white/10 backdrop-blur-lg p-3 sm:p-4 rounded-lg flex items-start gap-2 sm:gap-3">
                  <Info className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-white/90">
                    {aiRecommendation}
                  </p>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/10 backdrop-blur-lg rounded-lg">
                <Target className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                <div>
                  <h3 className="font-medium text-sm sm:text-base text-white">Quanto você precisa?</h3>
                  <p className="text-xs sm:text-sm text-white/80">
                    Defina o valor total que precisa alcançar
                  </p>
                </div>
              </div>
              <Input
                type="number"
                value={goal.targetAmount || ""}
                onChange={(e) => updateGoal({ targetAmount: Number(e.target.value) })}
                placeholder="€0.00"
                className="text-lg sm:text-xl w-full bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/10 backdrop-blur-lg rounded-lg">
                <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                <div>
                  <h3 className="font-medium text-sm sm:text-base text-white">Quando quer alcançar?</h3>
                  <p className="text-xs sm:text-sm text-white/80">
                    Escolha uma data alvo realista
                  </p>
                </div>
              </div>
              <Input
                type="date"
                value={goal.targetDate ? format(goal.targetDate, "yyyy-MM-dd") : ""}
                onChange={(e) => updateGoal({ targetDate: new Date(e.target.value) })}
                min={format(addMonths(new Date(), 1), "yyyy-MM-dd")}
                className="w-full bg-white/10 border-white/20 text-white"
              />
            </div>
          )}

          {step === 4 && goal.monthlyContribution && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/10 backdrop-blur-lg rounded-lg">
                <PiggyBank className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                <div>
                  <h3 className="font-medium text-sm sm:text-base text-white">Poupança Mensal Recomendada</h3>
                  <p className="text-lg sm:text-2xl font-bold text-white">
                    €{goal.monthlyContribution.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm sm:text-base text-white">Resumo do Objetivo</h4>
                <div className="grid gap-2 text-xs sm:text-sm">
                  <div className="flex justify-between py-2 border-b border-white/20">
                    <span className="text-white/80">Objetivo</span>
                    <span className="font-medium text-white">{goal.name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/20">
                    <span className="text-white/80">Valor Total</span>
                    <span className="font-medium text-white">€{goal.targetAmount?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/20">
                    <span className="text-white/80">Data Alvo</span>
                    <span className="font-medium text-white">
                      {format(goal.targetDate!, "dd/MM/yyyy", { locale: ptBR })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-2 sm:pt-4">
            <Button
              variant="outline"
              onClick={() => step === 1 ? onCancel() : setStep(step - 1)}
              className="text-sm sm:text-base px-3 sm:px-4 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              {step === 1 ? "Cancelar" : "Voltar"}
            </Button>
            <Button
              onClick={handleNext}
              className="text-sm sm:text-base px-3 sm:px-4 bg-gradient-to-r from-indigo-400 to-purple-500 hover:from-indigo-500 hover:to-purple-600 text-white"
            >
              {step === 4 ? "Concluir" : "Próximo"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}