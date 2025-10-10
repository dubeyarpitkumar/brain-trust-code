import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash2 } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
type Task = Tables<"tasks">;
interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, status: string) => void;
}
export function TaskCard({
  task,
  onEdit,
  onDelete,
  onToggleStatus
}: TaskCardProps) {
  const {
    t
  } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const isCompleted = task.status === "completed";
  const notesLines = task.notes?.split("\n").length || 0;
  const shouldTruncate = task.notes && notesLines > 3;
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} exit={{
    opacity: 0,
    y: -20
  }} transition={{
    duration: 0.2
  }}>
      <Card className="glass border-2 hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-start gap-4 space-y-0">
          <Checkbox checked={isCompleted} onCheckedChange={() => onToggleStatus(task.id, isCompleted ? "pending" : "completed")} className="mt-1 rounded-md text-base font-normal text-slate-950 bg-slate-100" />
          <div className="flex-1 min-w-0">
            <h3 className={`text-lg font-semibold truncate ${isCompleted ? "line-through text-muted-foreground" : ""}`}>
              {task.title}
            </h3>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => onEdit(task)} className="h-8 w-8">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(task.id)} className="h-8 w-8 text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {task.notes && <CardContent>
            <p className={`text-muted-foreground whitespace-pre-wrap ${!expanded && shouldTruncate ? "line-clamp-3" : ""}`}>
              {task.notes}
            </p>
            {shouldTruncate && <Button variant="link" onClick={() => setExpanded(!expanded)} className="p-0 h-auto mt-2">
                {expanded ? t("tasks.readLess") : t("tasks.readMore")}
              </Button>}
          </CardContent>}
      </Card>
    </motion.div>;
}