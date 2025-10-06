import { useTranslation } from "react-i18next";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export function EmptyState() {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="mb-4 p-6 rounded-full bg-primary/10">
        <CheckCircle2 className="h-16 w-16 text-primary" />
      </div>
      <h3 className="text-2xl font-semibold mb-2">{t("tasks.noTasks")}</h3>
      <p className="text-muted-foreground">{t("tasks.noTasksDesc")}</p>
    </motion.div>
  );
}
