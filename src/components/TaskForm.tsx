import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tables } from "@/integrations/supabase/types";

type Task = Tables<"tasks">;

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { title: string; notes: string }) => void;
  task?: Task | null;
}

export function TaskForm({ open, onClose, onSave, task }: TaskFormProps) {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setNotes(task.notes || "");
    } else {
      setTitle("");
      setNotes("");
    }
  }, [task, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, notes });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {task ? t("taskForm.editTask") : t("taskForm.createTask")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t("tasks.title")}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("taskForm.titlePlaceholder")}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">{t("tasks.notes")}</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("taskForm.notesPlaceholder")}
              rows={5}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              {t("taskForm.cancel")}
            </Button>
            <Button type="submit" className="gradient-primary">
              {task ? t("taskForm.save") : t("taskForm.create")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
