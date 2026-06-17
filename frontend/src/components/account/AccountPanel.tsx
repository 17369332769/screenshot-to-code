import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  deleteProject,
  fetchProject,
  HostedProject,
  login,
  logout,
} from "../../lib/account";
import { useAccountStore } from "../../store/account-store";
import { useAppStore } from "../../store/app-store";
import { useProjectStore } from "../../store/project-store";
import { AppState } from "../../types";
import { useI18n } from "../../i18n";

interface AccountPanelProps {
  enabled: boolean;
}

function AccountPanel({ enabled }: AccountPanelProps) {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    session,
    projects,
    currentProjectId,
    setSession,
    setProjects,
    upsertProject,
    removeProject,
    setCurrentProjectId,
  } = useAccountStore();
  const { hydrateProjectSnapshot } = useProjectStore();
  const { setAppState } = useAppStore();

  const usageLabel = useMemo(() => {
    if (!session) return null;
    return t("freeGenerationsLeft", {
      remaining: session.usage.remainingFreeGenerations,
      limit: session.usage.limit,
    });
  }, [session, t]);

  if (!enabled) return null;

  const handleLogin = async () => {
    if (!email.trim()) {
      toast.error(t("pleaseEnterEmail"));
      return;
    }

    setIsSubmitting(true);
    try {
      const nextSession = await login(email.trim());
      setSession(nextSession);
      toast.success(t("signedIn"));
    } catch (error) {
      console.error(error);
      toast.error(t("couldNotSignIn"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setSession(null);
      setProjects([]);
      setCurrentProjectId(null);
      toast.success(t("signedOut"));
    } catch (error) {
      console.error(error);
      toast.error(t("couldNotSignOut"));
    }
  };

  const handleOpenProject = async (projectId: string) => {
    try {
      const project = await fetchProject(projectId);
      upsertProject(project);
      setCurrentProjectId(project.id);
      hydrateProjectSnapshot({
        inputMode: project.inputMode ?? "image",
        referenceImages: project.referenceImages,
        initialPrompt: project.initialPrompt,
        commits: project.commits,
        head: project.head,
        latestCommitHash: project.latestCommitHash,
      });
      setAppState(project.head ? AppState.CODE_READY : AppState.INITIAL);
      toast.success(t("projectLoaded"));
    } catch (error) {
      console.error(error);
      toast.error(t("couldNotLoadProject"));
    }
  };

  const handleDeleteProject = async (project: HostedProject) => {
    try {
      await deleteProject(project.id);
      removeProject(project.id);
      toast.success(t("projectDeleted"));
    } catch (error) {
      console.error(error);
      toast.error(t("couldNotDeleteProject"));
    }
  };

  return (
    <div className="rounded-[1.75rem] border border-stone-200/80 bg-white/85 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold tracking-[-0.02em] text-stone-950 dark:text-white">
            {t("account")}
          </h3>
          <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-zinc-300">
            {t("accountDescription")}
          </p>
        </div>
        {session && (
          <button
            onClick={handleLogout}
            className="rounded-full border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-700 dark:border-zinc-700 dark:text-zinc-300"
          >
            {t("logOut")}
          </button>
        )}
      </div>

      {!session ? (
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={t("emailPlaceholder")}
            className="flex-1 rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none ring-0 focus:border-stone-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          />
          <button
            onClick={handleLogin}
            disabled={isSubmitting}
            className="rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60 dark:bg-white dark:text-stone-950"
          >
            {isSubmitting ? t("signingIn") : t("signIn")}
          </button>
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          <div className="rounded-2xl bg-stone-100 px-4 py-3 text-sm text-stone-700 dark:bg-zinc-900 dark:text-zinc-300">
            <div className="font-medium">{session.user.email}</div>
            <div className="mt-1 text-xs text-stone-500 dark:text-zinc-500">
              {usageLabel}
            </div>
          </div>

          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500 dark:text-zinc-500">
              {t("projects")}
            </div>
            {projects.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-stone-300 px-4 py-4 text-sm text-stone-500 dark:border-zinc-700 dark:text-zinc-400">
                {t("noSavedProjects")}
              </div>
            ) : (
              <div className="space-y-2">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className={`rounded-2xl border px-4 py-3 ${
                      currentProjectId === project.id
                        ? "border-stone-900 bg-stone-100 dark:border-white dark:bg-zinc-900"
                        : "border-stone-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <button
                        onClick={() => handleOpenProject(project.id)}
                        className="min-w-0 text-left"
                      >
                        <div className="truncate text-sm font-semibold text-stone-900 dark:text-white">
                          {project.name}
                        </div>
                        <div className="mt-1 text-xs text-stone-500 dark:text-zinc-500">
                          {t("updatedAt", {
                            date: new Date(project.updatedAt).toLocaleString(),
                          })}
                        </div>
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project)}
                        className="text-xs text-stone-500 hover:text-red-600 dark:text-zinc-400"
                      >
                        {t("delete")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AccountPanel;
