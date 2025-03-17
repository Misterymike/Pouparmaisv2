import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Crown, Phone, Clock, Shield, Sparkles, Calculator, Brain, Target } from "lucide-react";

interface PremiumModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PREMIUM_FEATURES = [
  {
    icon: <Brain className="h-6 w-6 text-indigo-500" />,
    title: "Análise Avançada",
    description: "IA de última geração para análise financeira personalizada"
  },
  {
    icon: <Calculator className="h-6 w-6 text-green-500" />,
    title: "Simulações Detalhadas",
    description: "Ferramentas avançadas de simulação e projeção financeira"
  },
  {
    icon: <Target className="h-6 w-6 text-purple-500" />,
    title: "Metas Inteligentes",
    description: "Sistema avançado de definição e acompanhamento de objetivos"
  }
];

export function PremiumModal({ open, onOpenChange }: PremiumModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<"mbway" | "spin" | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const { toast } = useToast();

  const handleSubscribe = async () => {
    if (!phoneNumber || phoneNumber.length !== 9) {
      toast({
        title: "Erro",
        description: "Por favor, insira um número de telemóvel válido.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Subscrição iniciada!",
      description: "Enviámos um pedido de pagamento para o seu telemóvel.",
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-b from-slate-900 to-slate-950 border-blue-500/20 shadow-xl">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur-lg opacity-50" />
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 rounded-2xl shadow-xl relative">
                <Crown className="h-8 w-8 text-white animate-pulse" />
              </div>
            </div>
          </div>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            POUPAR+ Premium
          </DialogTitle>
          <DialogDescription className="text-center text-slate-300">
            Desbloqueie todo o potencial da sua gestão financeira!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 py-6">
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-b from-blue-950 to-blue-900 border border-blue-500/20 hover:border-blue-400/30 hover:shadow-lg transition-all duration-300">
                <Clock className="h-6 w-6 text-blue-400" />
                <span className="text-sm text-center font-medium text-slate-200">Acesso Prioritário</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-b from-cyan-950 to-cyan-900 border border-cyan-500/20 hover:border-cyan-400/30 hover:shadow-lg transition-all duration-300">
                <Shield className="h-6 w-6 text-cyan-400" />
                <span className="text-sm text-center font-medium text-slate-200">Análise Ilimitada</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-b from-blue-950 to-blue-900 border border-blue-500/20 hover:border-blue-400/30 hover:shadow-lg transition-all duration-300">
                <Sparkles className="h-6 w-6 text-blue-400" />
                <span className="text-sm text-center font-medium text-slate-200">Relatórios Pro</span>
              </div>
            </div>

            {/* Premium Features */}
            <div className="space-y-4 bg-gradient-to-b from-slate-800 to-slate-900 p-4 rounded-lg border border-blue-500/20">
              {PREMIUM_FEATURES.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 group">
                  <div className="flex-shrink-0 p-2 rounded-lg bg-gradient-to-b from-slate-900 to-slate-950 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-200">{feature.title}</h3>
                    <p className="text-xs text-slate-400">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={paymentMethod === "mbway" ? "default" : "outline"}
                onClick={() => setPaymentMethod("mbway")}
                className={`w-full ${
                  paymentMethod === "mbway"
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700"
                    : "border-blue-500/20 text-slate-200 hover:bg-blue-950"
                }`}
              >
                MB WAY
              </Button>
              <Button
                variant={paymentMethod === "spin" ? "default" : "outline"}
                onClick={() => setPaymentMethod("spin")}
                className={`w-full ${
                  paymentMethod === "spin"
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700"
                    : "border-blue-500/20 text-slate-200 hover:bg-blue-950"
                }`}
              >
                SPIN
              </Button>
            </div>

            {paymentMethod && (
              <div className="space-y-2 animate-fadeIn">
                <Label htmlFor="phone" className="text-slate-200">Número de telemóvel</Label>
                <div className="flex gap-2">
                  <div className="flex items-center px-3 bg-slate-800 rounded-l-md border border-blue-500/20 border-r-0">
                    <Phone className="h-4 w-4 text-blue-400" />
                    <span className="ml-2 text-slate-300">+351</span>
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="968677320"
                    maxLength={9}
                    className="rounded-l-none bg-slate-800 border-blue-500/20 text-slate-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
            className="text-slate-300 hover:text-slate-100 hover:bg-blue-950"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubscribe}
            disabled={!paymentMethod || !phoneNumber}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:hover:from-blue-600 disabled:hover:to-cyan-600"
          >
            Começar período gratuito
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}