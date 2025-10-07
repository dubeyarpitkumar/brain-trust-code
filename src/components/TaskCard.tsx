import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit, Trash2, X } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { useIsMobile } from "@/hooks/use-mobile";
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
  const isMobile = useIsMobile();
  const [expanded, setExpanded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const isCompleted = task.status === "completed";
  const notesLines = task.notes?.split("\n").length || 0;
  const shouldTruncate = task.notes && notesLines > 3;
  return <>
    <motion.div initial={{
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
      <Card 
        className={`glass border-2 hover:shadow-lg transition-shadow ${
          isMobile ? "h-[170px] cursor-pointer active:scale-[0.98]" : ""
        }`}
        onClick={isMobile ? () => setModalOpen(true) : undefined}
      >
        <CardHeader className="flex flex-row items-start gap-4 space-y-0">
          <Checkbox 
            checked={isCompleted} 
            onCheckedChange={() => {
              onToggleStatus(task.id, isCompleted ? "pending" : "completed");
            }} 
            onClick={(e) => e.stopPropagation()}
            className="mt-1 rounded-md text-base font-normal text-slate-950 bg-slate-100" 
          />
          <div className="flex-1 min-w-0">
            <h3 className={`text-lg font-semibold ${isMobile ? "line-clamp-1" : "truncate"} ${isCompleted ? "line-through text-muted-foreground" : ""}`}>
              {task.title}
            </h3>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }} 
              className="h-8 w-8"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }} 
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {task.notes && <CardContent>
            <p className={`text-muted-foreground whitespace-pre-wrap ${
              isMobile ? "line-clamp-3" : (!expanded && shouldTruncate ? "line-clamp-3" : "")
            }`}>
              {task.notes}
            </p>
            {!isMobile && shouldTruncate && <Button variant="link" onClick={() => setExpanded(!expanded)} className="p-0 h-auto mt-2">
                {expanded ? t("tasks.readLess") : t("tasks.readMore")}
              </Button>}
          </CardContent>}
      </Card>
    </motion.div>

    {/* Mobile Modal */}
    {isMobile && (
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-[90vw] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className={`text-xl font-semibold pr-8 ${isCompleted ? "line-through text-muted-foreground" : ""}`}>
              {task.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {task.notes && (
              <div>
                <p className="text-sm font-medium mb-2">{t("tasks.notes") || "Notes"}</p>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {task.notes}
                </p>
              </div>
            )}
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">{t("tasks.status") || "Status"}:</p>
              <span className={`text-sm ${isCompleted ? "text-green-600" : "text-orange-600"}`}>
                {isCompleted ? t("tasks.completed") : t("tasks.pending")}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )}
  </>;
}