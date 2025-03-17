import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Cookie, X } from "lucide-react";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verifica se o usuário já aceitou os cookies
    const hasAcceptedCookies = localStorage.getItem("cookiesAccepted");
    if (!hasAcceptedCookies) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookiesDeclined", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <Card className="fixed bottom-4 left-4 right-4 p-4 md:left-auto md:right-4 md:w-[400px] bg-white/5 backdrop-blur-xl border border-white/10 z-50">
      <div className="flex items-start gap-4">
        <Cookie className="h-6 w-6 flex-shrink-0 text-cyan-400" />
        <div className="space-y-3">
          <div className="space-y-1.5">
            <h3 className="font-semibold">Política de Cookies e RGPD</h3>
            <p className="text-sm text-muted-foreground">
              Utilizamos cookies para melhorar sua experiência. Ao utilizar nosso site, você concorda com nossa política de privacidade em conformidade com o RGPD.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={handleAccept}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
            >
              Aceitar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDecline}
              className="border-white/10"
            >
              Recusar
            </Button>
          </div>
        </div>
        <button
          onClick={handleDecline}
          className="rounded-full p-1 hover:bg-white/10 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </Card>
  );
}
