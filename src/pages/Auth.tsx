import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { CheckCircle2, XCircle } from "lucide-react";

type AuthMode = "signin" | "signup" | "reset";

export default function Auth() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Password validation states
  const [passwordTouched, setPasswordTouched] = useState(false);
  const validations = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "signup") {
        if (!Object.values(validations).every(Boolean)) {
          toast.error(t("validation.passwordMin"));
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          toast.error(t("validation.passwordMatch"));
          setLoading(false);
          return;
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });

        if (error) throw error;
        toast.success(t("messages.signupSuccess"));
        navigate("/dashboard");
      } else if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        toast.success(t("messages.loginSuccess"));
        navigate("/dashboard");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/dashboard`,
        });

        if (error) throw error;
        toast.success(t("messages.resetLinkSent"));
        setMode("signin");
      }
    } catch (error: any) {
      // Translate Supabase error messages
      const errorKey = `errors.${error.message}`;
      const translatedError = t(errorKey);
      // If translation key doesn't exist, use the original message or generic error
      const errorMessage =
        translatedError !== errorKey
          ? translatedError
          : error.message || t("errors.genericError");
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-primary opacity-10" />
      
      {/* Top right controls */}
      <div className="absolute top-4 right-4 flex gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="glass border-2">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gradient">
              {t("auth.welcome")}
            </CardTitle>
            <CardDescription className="text-lg">
              {t("auth.subtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("auth.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                />
              </div>

              {mode !== "reset" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="password">{t("auth.password")}</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setPasswordTouched(true)}
                      required
                      placeholder="••••••••"
                    />
                  </div>

                  {mode === "signup" && passwordTouched && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-2 text-sm"
                    >
                      <ValidationItem
                        valid={validations.length}
                        text={t("validation.passwordMin")}
                      />
                      <ValidationItem
                        valid={validations.uppercase}
                        text={t("validation.passwordUppercase")}
                      />
                      <ValidationItem
                        valid={validations.lowercase}
                        text={t("validation.passwordLowercase")}
                      />
                      <ValidationItem
                        valid={validations.number}
                        text={t("validation.passwordNumber")}
                      />
                      <ValidationItem
                        valid={validations.special}
                        text={t("validation.passwordSpecial")}
                      />
                    </motion.div>
                  )}

                  {mode === "signup" && (
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        {t("auth.confirmPassword")}
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                      />
                    </div>
                  )}
                </>
              )}

              <Button
                type="submit"
                className="w-full gradient-primary"
                disabled={loading}
              >
                {loading
                  ? t("common.loading")
                  : mode === "signup"
                  ? t("auth.signUp")
                  : mode === "signin"
                  ? t("auth.signIn")
                  : t("auth.sendResetLink")}
              </Button>

              <div className="space-y-2 text-center text-sm">
                {mode === "signin" && (
                  <>
                    <button
                      type="button"
                      onClick={() => setMode("reset")}
                      className="text-primary hover:underline block w-full"
                    >
                      {t("auth.forgotPassword")}
                    </button>
                    <div>
                      {t("auth.noAccount")}{" "}
                      <button
                        type="button"
                        onClick={() => setMode("signup")}
                        className="text-primary hover:underline font-medium"
                      >
                        {t("auth.signUp")}
                      </button>
                    </div>
                  </>
                )}

                {mode === "signup" && (
                  <div>
                    {t("auth.haveAccount")}{" "}
                    <button
                      type="button"
                      onClick={() => setMode("signin")}
                      className="text-primary hover:underline font-medium"
                    >
                      {t("auth.signIn")}
                    </button>
                  </div>
                )}

                {mode === "reset" && (
                  <button
                    type="button"
                    onClick={() => setMode("signin")}
                    className="text-primary hover:underline"
                  >
                    {t("auth.backToLogin")}
                  </button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function ValidationItem({ valid, text }: { valid: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2">
      {valid ? (
        <CheckCircle2 className="h-4 w-4 text-success" />
      ) : (
        <XCircle className="h-4 w-4 text-muted-foreground" />
      )}
      <span className={valid ? "text-success" : "text-muted-foreground"}>
        {text}
      </span>
    </div>
  );
}
