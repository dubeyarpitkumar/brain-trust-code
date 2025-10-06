import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskCard } from "@/components/TaskCard";
import { TaskForm } from "@/components/TaskForm";
import { EmptyState } from "@/components/EmptyState";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Plus, Search, LogOut, User, ArrowUpDown, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Tables } from "@/integrations/supabase/types";
import { AITaskGenerator } from "@/components/AITaskGenerator";

type Task = Tables<"tasks">;

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "pending">("all");
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [aiGeneratorOpen, setAiGeneratorOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user?.id!)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error: any) {
      toast.error(error.message || t("messages.error"));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (data: { title: string; notes: string }) => {
    try {
      const { error } = await supabase.from("tasks").insert({
        title: data.title,
        notes: data.notes,
        user_id: user?.id!,
        status: "pending",
      });

      if (error) throw error;
      toast.success(t("messages.taskCreated"));
      fetchTasks();
    } catch (error: any) {
      toast.error(error.message || t("messages.error"));
    }
  };

  const handleUpdateTask = async (data: { title: string; notes: string }) => {
    if (!editingTask) return;

    try {
      const { error } = await supabase
        .from("tasks")
        .update({
          title: data.title,
          notes: data.notes,
        })
        .eq("id", editingTask.id);

      if (error) throw error;
      toast.success(t("messages.taskUpdated"));
      fetchTasks();
      setEditingTask(null);
    } catch (error: any) {
      toast.error(error.message || t("messages.error"));
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", id);

      if (error) throw error;
      toast.success(t("messages.taskDeleted"));
      fetchTasks();
    } catch (error: any) {
      toast.error(error.message || t("messages.error"));
    }
  };

  const handleToggleStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
      fetchTasks();
    } catch (error: any) {
      toast.error(error.message || t("messages.error"));
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success(t("messages.logoutSuccess"));
  };

  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }

    // Filter by search query (debounced in the input)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.notes?.toLowerCase().includes(query)
      );
    }

    // Sort
    return filtered.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
    });
  }, [tasks, searchQuery, statusFilter, sortOrder]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "completed").length;
    const pending = total - completed;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, rate };
  }, [tasks]);

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <header className="border-b glass sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gradient">{t("tasks.myTasks")}</h1>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  {t("auth.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <StatCard title={t("dashboard.totalTasks")} value={stats.total} />
          <StatCard
            title={t("dashboard.completedTasks")}
            value={stats.completed}
            className="gradient-success text-white"
          />
          <StatCard title={t("dashboard.pendingTasks")} value={stats.pending} />
          <StatCard
            title={t("dashboard.completionRate")}
            value={`${stats.rate}%`}
            className="gradient-primary text-white"
          />
        </motion.div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("tasks.search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
            <TabsList>
              <TabsTrigger value="all">{t("tasks.all")}</TabsTrigger>
              <TabsTrigger value="pending">{t("tasks.pending")}</TabsTrigger>
              <TabsTrigger value="completed">{t("tasks.completed")}</TabsTrigger>
            </TabsList>
          </Tabs>

          <Button
            variant="outline"
            onClick={() => setSortOrder(sortOrder === "latest" ? "oldest" : "latest")}
          >
            <ArrowUpDown className="mr-2 h-4 w-4" />
            {sortOrder === "latest" ? t("tasks.sortLatest") : t("tasks.sortOldest")}
          </Button>

          <Button onClick={() => setFormOpen(true)} className="gradient-primary">
            <Plus className="mr-2 h-4 w-4" />
            {t("tasks.addTask")}
          </Button>

          <Button onClick={() => setAiGeneratorOpen(true)} variant="outline" className="border-primary/50">
            <Sparkles className="mr-2 h-4 w-4" />
            {t("ai.title")}
          </Button>
        </div>

        {/* Tasks List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : filteredTasks.length === 0 ? (
          <EmptyState />
        ) : (
          <AnimatePresence>
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={(task) => {
                    setEditingTask(task);
                    setFormOpen(true);
                  }}
                  onDelete={handleDeleteTask}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>

      {/* Task Form */}
      <TaskForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingTask(null);
        }}
        onSave={editingTask ? handleUpdateTask : handleCreateTask}
        task={editingTask}
      />

      {/* AI Task Generator */}
      <AITaskGenerator
        open={aiGeneratorOpen}
        onClose={() => setAiGeneratorOpen(false)}
        onTasksSaved={fetchTasks}
      />
    </div>
  );
}

function StatCard({
  title,
  value,
  className,
}: {
  title: string;
  value: number | string;
  className?: string;
}) {
  return (
    <Card className={className || "glass"}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
