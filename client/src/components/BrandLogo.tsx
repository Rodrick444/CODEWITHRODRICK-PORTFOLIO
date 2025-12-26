import { motion } from "framer-motion";

export default function BrandLogo() {
  return (
    <motion.div
      className="fixed top-3 left-4 z-[60] pointer-events-none"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="flex flex-col items-center">
        <div 
          className="font-display text-2xl font-bold tracking-tight"
          style={{
            color: "hsl(142 76% 50%)",
            textShadow: `
              0 0 5px hsl(142 76% 50% / 0.8),
              0 0 10px hsl(142 76% 50% / 0.6),
              0 0 20px hsl(142 76% 50% / 0.4),
              0 0 40px hsl(142 76% 50% / 0.2)
            `,
          }}
          data-testid="text-logo-symbol"
        >
          &lt;CWR&gt;
        </div>
        <div 
          className="font-display text-[10px] font-semibold tracking-widest mt-0.5"
          style={{
            color: "hsl(142 76% 50%)",
            textShadow: `
              0 0 5px hsl(142 76% 50% / 0.8),
              0 0 10px hsl(142 76% 50% / 0.6),
              0 0 20px hsl(142 76% 50% / 0.4)
            `,
          }}
          data-testid="text-logo-name"
        >
          CODEWITHRODRICK
        </div>
      </div>
    </motion.div>
  );
}
