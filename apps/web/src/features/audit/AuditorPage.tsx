import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Shield, Plus, ExternalLink, AlertCircle, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import { Input } from "@/components/common/Input";
import { Modal } from "@/components/common/Modal";
import { Progress } from "@/components/common/Progress";
import { Spinner } from "@/components/common/Spinner";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { auditApi } from "./api/audit-api";
import { getErrorMessage } from "@/lib/api-client";
import toast from "react-hot-toast";

const statusColors = {
  pending: "amber" as const,
  running: "blue" as const,
  completed: "green" as const,
  failed: "red" as const,
};

const severityConfig = {
  critical: { icon: <AlertCircle className="h-4 w-4" />, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950" },
  major: { icon: <AlertTriangle className="h-4 w-4" />, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950" },
  minor: { icon: <Info className="h-4 w-4" />, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950" },
  info: { icon: <CheckCircle2 className="h-4 w-4" />, color: "text-gray-600 dark:text-gray-400", bg: "bg-gray-50 dark:bg-gray-900" },
};

export function AuditorPage() {
  const queryClient = useQueryClient();
  const [showNewAudit, setShowNewAudit] = useState(false);
  const [auditUrl, setAuditUrl] = useState("");
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  const { data: jobs, isLoading, error, refetch } = useQuery({
    queryKey: ["audit-jobs"],
    queryFn: () => auditApi.listJobs({ perPage: 20 }),
  });

  const { data: detail } = useQuery({
    queryKey: ["audit-job", selectedJob],
    queryFn: () => auditApi.getJob(selectedJob!),
    enabled: !!selectedJob,
  });

  const createAudit = useMutation({
    mutationFn: () => auditApi.createJob(auditUrl),
    onSuccess: () => {
      toast.success("Audit started!");
      setShowNewAudit(false);
      setAuditUrl("");
      queryClient.invalidateQueries({ queryKey: ["audit-jobs"] });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Accessibility Auditor</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Scan websites for WCAG 2.2 compliance and ISL accessibility
          </p>
        </div>
        <Button size="sm" icon={<Plus className="h-4 w-4" />} onClick={() => setShowNewAudit(true)}>
          New audit
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      ) : error ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !jobs?.data.length ? (
        <EmptyState
          icon={<Shield className="h-8 w-8" />}
          title="No audits yet"
          description="Run your first accessibility audit to get started."
          action={{ label: "Start audit", onClick: () => setShowNewAudit(true) }}
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Jobs list */}
          <div className="space-y-3 lg:col-span-2">
            {jobs.data.map((job) => (
              <Card
                key={job.id}
                hoverable
                padding="md"
                className={selectedJob === job.id ? "ring-2 ring-brand-500" : ""}
                onClick={() => setSelectedJob(job.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[var(--text-primary)]">{job.url}</p>
                    <p className="text-xs text-[var(--text-muted)]">{new Date(job.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Badge color={statusColors[job.status as keyof typeof statusColors] || "gray"} size="sm">
                    {job.status}
                  </Badge>
                </div>
                {job.score !== null && (
                  <Progress value={job.score} className="mt-3" color={job.score >= 80 ? "green" : job.score >= 50 ? "amber" : "red"} size="sm" />
                )}
              </Card>
            ))}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-3">
            {detail ? (
              <Card padding="lg">
                <div className="flex items-center justify-between">
                  <CardTitle>Audit Report</CardTitle>
                  <a href={detail.url} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline flex items-center gap-1 text-sm">
                    {detail.url} <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
                {detail.score !== null && (
                  <div className="mt-4 text-center">
                    <p className="text-5xl font-bold text-[var(--text-primary)]">{detail.score}</p>
                    <p className="text-sm text-[var(--text-muted)]">Accessibility Score</p>
                  </div>
                )}
                {detail.summary && <CardDescription className="mt-4">{detail.summary}</CardDescription>}
                {detail.issues.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <p className="text-sm font-semibold text-[var(--text-primary)]">Issues ({detail.issues.length})</p>
                    {detail.issues.map((issue) => {
                      const sev = severityConfig[issue.severity as keyof typeof severityConfig] || severityConfig.info;
                      return (
                        <div key={issue.id} className={`rounded-lg p-3 ${sev.bg}`}>
                          <div className="flex items-start gap-2">
                            <span className={sev.color}>{sev.icon}</span>
                            <div>
                              <p className={`text-sm font-medium ${sev.color}`}>{issue.description}</p>
                              {issue.recommendation && (
                                <p className="mt-1 text-xs text-[var(--text-secondary)]">{issue.recommendation}</p>
                              )}
                              <div className="mt-1 flex gap-2">
                                {issue.wcagCriterion && <Badge size="sm" color="purple">{issue.wcagCriterion}</Badge>}
                                <Badge size="sm" color="gray">{issue.category}</Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            ) : (
              <div className="flex h-full items-center justify-center rounded-xl border border-dashed py-20">
                <p className="text-sm text-[var(--text-muted)]">Select an audit to view details</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* New Audit Modal */}
      <Modal open={showNewAudit} onOpenChange={setShowNewAudit} title="New Accessibility Audit" size="sm">
        <div className="space-y-4">
          <Input
            label="Website URL"
            value={auditUrl}
            onChange={(e) => setAuditUrl(e.target.value)}
            placeholder="https://example.com"
            type="url"
          />
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setShowNewAudit(false)}>Cancel</Button>
            <Button onClick={() => createAudit.mutate()} loading={createAudit.isPending} disabled={!auditUrl.trim()}>
              Start audit
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
