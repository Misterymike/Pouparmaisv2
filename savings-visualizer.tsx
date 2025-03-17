import { motion } from "framer-motion";
import { useTheme } from "@/components/theme-provider";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface SavingsVisualizerProps {
  currentSavings: number;
  targetSavings: number;
  monthlyContribution: number;
  currency?: string;
}

export function SavingsVisualizer({
  currentSavings,
  targetSavings,
  monthlyContribution,
  currency = "€"
}: SavingsVisualizerProps) {
  const progress = Math.min((currentSavings / targetSavings) * 100, 100);
  const remainingToTarget = Math.max(targetSavings - currentSavings, 0);
  const monthsToTarget = Math.ceil(remainingToTarget / monthlyContribution);

  const circleVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: progress / 100,
      opacity: 1,
      transition: { 
        duration: 2,
        ease: "easeInOut",
      }
    }
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 border-blue-500/20">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      
      <div className="relative p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Progresso da Poupança
            </h3>
            <p className="text-sm text-slate-400">
              Meta: {currency}{targetSavings.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-400">
              {currency}{currentSavings.toLocaleString()}
            </p>
            <p className="text-sm text-slate-400">
              Poupança Atual
            </p>
          </div>
        </div>

        <div className="relative w-full h-[200px]">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full transform -rotate-90"
          >
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              className="stroke-slate-700 fill-none"
              strokeWidth="8"
            />
            
            {/* Animated progress circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              className="stroke-blue-500 fill-none"
              strokeWidth="8"
              strokeLinecap="round"
              variants={circleVariants}
              initial="hidden"
              animate="visible"
            />

            {/* Percentage text */}
            <text
              x="50"
              y="50"
              className="fill-white text-xl font-bold"
              dominantBaseline="middle"
              textAnchor="middle"
              transform="rotate(90 50 50)"
            >
              {Math.round(progress)}%
            </text>
          </svg>

          {/* Animated particles */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-400 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-400">Progresso</span>
              <span className="text-blue-400">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
              <p className="text-sm text-slate-400">Faltam</p>
              <p className="text-lg font-semibold text-blue-400">
                {currency}{remainingToTarget.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
              <p className="text-sm text-slate-400">Tempo Estimado</p>
              <p className="text-lg font-semibold text-purple-400">
                {monthsToTarget} {monthsToTarget === 1 ? 'mês' : 'meses'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
