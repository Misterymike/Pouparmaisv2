import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

export function TermsModal({
  open,
  onOpenChange,
  onAccept,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: () => void;
}) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAccept = async () => {
    setIsProcessing(true);
    try {
      await onAccept();
    } finally {
      setIsProcessing(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Termos e Condições de Uso - MY POUPAR+</DialogTitle>
          <DialogDescription>
            Por favor, leia atentamente os nossos termos e condições antes de utilizar a aplicação.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 p-4 rounded-md border">
          <div className="space-y-4">
            <section>
              <h2 className="text-lg font-semibold mb-2">1. Definições</h2>
              <p>Aplicação: A plataforma digital disponibilizada através de dispositivos móveis.</p>
              <p>Usuário: Qualquer pessoa singular ou coletiva que aceda e utilize a aplicação.</p>
              <p>POUPAR Coins: Recompensas digitais concedidas ao utilizador por meio de ações realizadas dentro da aplicação.</p>
              <p>Lumin AI: Assistente virtual que auxilia os utilizadores em decisões financeiras, leitura de documentos, sugestões de poupança e gestão de tempo.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">2. Aceitação dos Termos</h2>
              <p>O acesso e uso da aplicação pressupõem a leitura, compreensão e aceitação dos presentes Termos e Condições.</p>
              <p>A utilização da aplicação destina-se apenas a maiores de 18 anos.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">3. Privacidade e Proteção de Dados</h2>
              <p>A recolha e o tratamento de dados pessoais seguem o disposto no Regulamento Geral de Proteção de Dados (RGPD - Regulamento UE 2016/679).</p>
              <p>O utilizador tem direito ao acesso, retificação, eliminação e portabilidade dos seus dados, de acordo com os artigos 15.º a 20.º do RGPD.</p>
              <p>Nenhuma informação será partilhada com terceiros sem o consentimento explícito do utilizador, exceto quando exigido por lei.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">4. Acessibilidade e Inclusão</h2>
              <p>O Lumin AI está equipado com ferramentas de acessibilidade para pessoas com diferentes necessidades, incluindo:</p>
              <ul className="list-disc pl-6">
                <li>Leitura de documentos por meio da câmara do dispositivo</li>
                <li>Opções de transcrição automática de texto</li>
                <li>Navegação por voz e comandos simplificados</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">5. POUPAR Coins</h2>
              <p>As POUPAR Coins são recompensas digitais não convertíveis em dinheiro real fora da aplicação, mas podem ser trocadas por descontos ou ofertas específicas na plataforma.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">6. Limitação de Responsabilidade</h2>
              <p>A MY POUPAR+ e o Lumin AI são fornecidos "como estão", sem garantias de resultados financeiros.</p>
              <p>Decisões financeiras tomadas com base nas informações fornecidas pela aplicação são de responsabilidade exclusiva do utilizador.</p>
            </section>
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-4 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Recusar
          </Button>
          <Button 
            onClick={handleAccept}
            disabled={isProcessing}
          >
            {isProcessing ? "Processando..." : "Aceitar Termos"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
