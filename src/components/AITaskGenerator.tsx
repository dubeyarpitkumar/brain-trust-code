import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Plus, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface GeneratedTask {
  title: string;
  notes: string;
}

interface AITaskGeneratorProps {
  open: boolean;
  onClose: () => void;
  onTasksSaved: () => void;
}

const mockTaskGenerator = (goal: string): GeneratedTask[] => {
  const goalLower = goal.toLowerCase();
  
  const taskTemplates: Record<string, GeneratedTask[]> = {
    fit: [
      { title: "Create a workout schedule", notes: "Plan out 3-4 days of exercise per week with specific activities" },
      { title: "Set up meal prep routine", notes: "Prepare healthy meals in advance for the week" },
      { title: "Track daily water intake", notes: "Aim for 8 glasses of water per day" },
      { title: "Find a workout buddy", notes: "Partner with someone for accountability and motivation" },
    ],
    wedding: [
      { title: "Set wedding budget", notes: "Determine overall budget and allocate to different categories" },
      { title: "Create guest list", notes: "Draft initial list of guests to invite" },
      { title: "Book wedding venue", notes: "Research and visit potential venues, make reservation" },
      { title: "Hire wedding photographer", notes: "Review portfolios and book a professional photographer" },
      { title: "Choose wedding theme", notes: "Decide on color scheme and overall aesthetic" },
    ],
    study: [
      { title: "Create study schedule", notes: "Block out dedicated study time each day" },
      { title: "Organize study materials", notes: "Gather and organize all textbooks, notes, and resources" },
      { title: "Join study group", notes: "Find or create a group for collaborative learning" },
      { title: "Set up distraction-free zone", notes: "Create a dedicated study space with minimal interruptions" },
    ],
    travel: [
      { title: "Research destinations", notes: "Compare potential travel locations and activities" },
      { title: "Set travel budget", notes: "Calculate costs for flights, accommodation, and activities" },
      { title: "Book flights and hotels", notes: "Reserve transportation and accommodation" },
      { title: "Create packing list", notes: "List all essential items to bring on the trip" },
      { title: "Plan daily itinerary", notes: "Outline activities and sights for each day" },
    ],
  };

  // Find matching template
  for (const [key, tasks] of Object.entries(taskTemplates)) {
    if (goalLower.includes(key)) {
      return tasks.slice(0, 5);
    }
  }

  // Default generic tasks
  return [
    { title: `Research about ${goal}`, notes: "Gather information and resources to get started" },
    { title: `Create action plan for ${goal}`, notes: "Break down the goal into smaller, manageable steps" },
    { title: `Set milestones for ${goal}`, notes: "Define key checkpoints to track progress" },
    { title: `Identify resources needed`, notes: "List tools, materials, or help required" },
  ];
};

export function AITaskGenerator({ open, onClose, onTasksSaved }: AITaskGeneratorProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [goal, setGoal] = useState("");
  const [generatedTasks, setGeneratedTasks] = useState<GeneratedTask[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savingTasks, setSavingTasks] = useState<Set<number>>(new Set());

  const handleGenerate = async () => {
    if (!goal.trim()) {
      toast.error(t("ai.enterGoal"));
      return;
    }

    setIsGenerating(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const tasks = mockTaskGenerator(goal);
    setGeneratedTasks(tasks);
    setIsGenerating(false);
    toast.success(t("ai.tasksGenerated", { count: tasks.length }));
  };

  const handleSaveTask = async (task: GeneratedTask, index: number) => {
    setSavingTasks((prev) => new Set(prev).add(index));
    
    try {
      const { error } = await supabase.from("tasks").insert({
        title: task.title,
        notes: task.notes,
        user_id: user?.id!,
        status: "pending",
      });

      if (error) throw error;
      toast.success(t("ai.taskSaved"));
      onTasksSaved();
    } catch (error: any) {
      const errorKey = `errors.${error.message}`;
      const translatedError = t(errorKey);
      const errorMessage =
        translatedError !== errorKey
          ? translatedError
          : error.message || t("ai.saveFailed");
      toast.error(errorMessage);
    } finally {
      setSavingTasks((prev) => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }
  };

  const handleClose = () => {
    setGoal("");
    setGeneratedTasks([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gradient">
            <Sparkles className="h-5 w-5" />
            {t("ai.title")}
          </DialogTitle>
          <DialogDescription>
            {t("ai.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="flex gap-2">
            <Input
              placeholder={t("ai.goalPlaceholder")}
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              disabled={isGenerating}
            />
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !goal.trim()}
              className="gradient-primary"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
            </Button>
          </div>

          <AnimatePresence mode="popLayout">
            {generatedTasks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-3"
              >
                {generatedTasks.map((task, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="glass">
                      <CardContent className="pt-4">
                        <h3 className="font-semibold mb-2">{task.title}</h3>
                        <p className="text-sm text-muted-foreground">{task.notes}</p>
                      </CardContent>
                      <CardFooter>
                        <Button
                          size="sm"
                          onClick={() => handleSaveTask(task, index)}
                          disabled={savingTasks.has(index)}
                          className="w-full"
                        >
                          {savingTasks.has(index) ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              {t("ai.saving")}
                            </>
                          ) : (
                            <>
                              <Plus className="h-4 w-4 mr-2" />
                              {t("ai.saveToTasks")}
                            </>
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
