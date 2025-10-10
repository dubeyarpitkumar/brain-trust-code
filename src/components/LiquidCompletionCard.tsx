import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

interface LiquidCompletionCardProps {
  title: string;
  percentage: number;
}

export function LiquidCompletionCard({ title, percentage }: LiquidCompletionCardProps) {
  return (
    <Card className="glass border-0 shadow-lg overflow-hidden relative">
      <CardHeader className="pb-2 md:pb-3 relative z-10">
        <CardTitle className="text-xs md:text-sm font-medium text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="relative h-20 md:h-28 pt-0">
        {/* Liquid container */}
        <div className="absolute inset-0 overflow-hidden rounded-b-lg">
          {/* Liquid wave */}
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${percentage}%` }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute bottom-0 left-0 right-0 gradient-cyan"
            style={{
              clipPath: "url(#wave)",
            }}
          >
            {/* Wave animation */}
            <div className="wave-animation" />
          </motion.div>
          
          {/* SVG for wave effect */}
          <svg className="hidden">
            <defs>
              <clipPath id="wave" clipPathUnits="objectBoundingBox">
                <path d="M0,0.5 Q0.25,0.4 0.5,0.5 T1,0.5 L1,1 L0,1 Z">
                  <animate
                    attributeName="d"
                    dur="3s"
                    repeatCount="indefinite"
                    values="
                      M0,0.5 Q0.25,0.4 0.5,0.5 T1,0.5 L1,1 L0,1 Z;
                      M0,0.5 Q0.25,0.6 0.5,0.5 T1,0.5 L1,1 L0,1 Z;
                      M0,0.5 Q0.25,0.4 0.5,0.5 T1,0.5 L1,1 L0,1 Z
                    "
                  />
                </path>
              </clipPath>
            </defs>
          </svg>
        </div>

        {/* Percentage text */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <motion.p
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground drop-shadow-lg"
          >
            {percentage}%
          </motion.p>
        </div>
      </CardContent>

      <style>{`
        .wave-animation {
          position: absolute;
          width: 200%;
          height: 100%;
          background: linear-gradient(
            180deg,
            hsl(var(--accent) / 0.8),
            hsl(var(--accent))
          );
          animation: wave-flow 3s ease-in-out infinite;
        }

        @keyframes wave-flow {
          0%, 100% {
            transform: translateX(0) translateY(0);
          }
          50% {
            transform: translateX(-25%) translateY(-5px);
          }
        }
      `}</style>
    </Card>
  );
}
