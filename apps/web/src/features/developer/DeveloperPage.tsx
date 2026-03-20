import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Key, Plus, Trash2, Copy, Activity, Webhook } from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import { Input } from "@/components/common/Input";
import { Modal } from "@/components/common/Modal";
import { Stat } from "@/components/common/Stat";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/common/Table";
import { EmptyState } from "@/components/common/EmptyState";
import { Spinner } from "@/components/common/Spinner";
import { ErrorState } from "@/components/common/ErrorState";
import { Tabs, TabContent } from "@/components/common/Tabs";
import { developerApi } from "./api/developer-api";
import { getErrorMessage } from "@/lib/api-client";
import toast from "react-hot-toast";

export function DeveloperPage() {
  const queryClient = useQueryClient();
  const [showCreateKey, setShowCreateKey] = useState(false);
  const [showCreateWebhook, setShowCreateWebhook] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newWebhookUrl, setNewWebhookUrl] = useState("");
  const [newWebhookEvents, setNewWebhookEvents] = useState<string[]>(["translation.completed"]);
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [createdWebhookSecret, setCreatedWebhookSecret] = useState<string | null>(null);

  const { data: keys, isLoading: keysLoading, error: keysError, refetch: refetchKeys } = useQuery({
    queryKey: ["api-keys"],
    queryFn: () => developerApi.listApiKeys(),
  });

  const { data: usage } = useQuery({
    queryKey: ["api-usage"],
    queryFn: () => developerApi.getUsage(),
  });

  const { data: webhooks } = useQuery({
    queryKey: ["webhooks"],
    queryFn: () => developerApi.listWebhooks(),
  });

  const createKey = useMutation({
    mutationFn: () => developerApi.createApiKey({ name: newKeyName || "Default" }),
    onSuccess: (data) => {
      setCreatedKey(data.key);
      setNewKeyName("");
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      toast.success("API key created!");
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const revokeKey = useMutation({
    mutationFn: (id: string) => developerApi.revokeApiKey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      toast.success("API key revoked.");
    },
  });

  const createWebhook = useMutation({
    mutationFn: () => developerApi.createWebhook({ url: newWebhookUrl, events: newWebhookEvents }),
    onSuccess: (data) => {
      setCreatedWebhookSecret(data.secret);
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
      toast.success("Webhook created!");
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("Copied to clipboard!");
  };

  const tabItems = [
    { value: "keys", label: "API Keys", icon: <Key className="h-4 w-4" /> },
    { value: "usage", label: "Usage", icon: <Activity className="h-4 w-4" /> },
    { value: "webhooks", label: "Webhooks", icon: <Webhook className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Developer Dashboard</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Manage API keys, monitor usage, and configure webhooks
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Total Requests" value={usage?.totalRequests ?? "--"} icon={<Activity className="h-5 w-5" />} />
        <Stat label="Avg Response" value={usage ? `${usage.avgResponseMs}ms` : "--"} icon={<Activity className="h-5 w-5" />} />
        <Stat label="Active Keys" value={keys?.length ?? "--"} icon={<Key className="h-5 w-5" />} />
      </div>

      <Tabs items={tabItems} defaultValue="keys">
        {/* API Keys Tab */}
        <TabContent value="keys">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-[var(--text-secondary)]">
              Use API keys to authenticate requests to the SignForge API.
            </p>
            <Button size="sm" icon={<Plus className="h-4 w-4" />} onClick={() => setShowCreateKey(true)}>
              Create key
            </Button>
          </div>

          {keysLoading ? (
            <div className="flex justify-center py-8"><Spinner /></div>
          ) : keysError ? (
            <ErrorState onRetry={() => refetchKeys()} />
          ) : !keys?.length ? (
            <EmptyState
              icon={<Key className="h-8 w-8" />}
              title="No API keys"
              description="Create an API key to start making requests."
              action={{ label: "Create key", onClick: () => setShowCreateKey(true) }}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Scopes</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead className="w-20" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {keys.map((k) => (
                  <TableRow key={k.id}>
                    <TableCell className="font-medium">{k.name}</TableCell>
                    <TableCell>
                      <code className="rounded bg-[var(--bg-tertiary)] px-2 py-0.5 text-xs font-mono">{k.prefix}...****</code>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {k.scopes.map((s) => <Badge key={s} size="sm" color="blue">{s}</Badge>)}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-[var(--text-muted)]">
                      {k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleDateString() : "Never"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => revokeKey.mutate(k.id)}
                        aria-label="Revoke key"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabContent>

        {/* Usage Tab */}
        <TabContent value="usage">
          <Card padding="lg">
            <CardTitle>API Usage — Last 30 Days</CardTitle>
            <CardDescription className="mt-1">
              {usage ? `${usage.totalRequests} total requests with ${usage.avgResponseMs}ms average response time.` : "Loading usage data..."}
            </CardDescription>

            {usage?.daily?.length ? (() => {
              const maxRequests = Math.max(...usage.daily.map((d) => d.requests), 1);
              return (
                <div className="mt-6 space-y-4">
                  {/* Bar chart */}
                  <div className="flex items-end gap-1" style={{ height: "12rem" }}>
                    {usage.daily.map((d) => {
                      const heightPct = (d.requests / maxRequests) * 100;
                      return (
                        <div
                          key={d.date}
                          className="group relative flex-1 flex flex-col items-center justify-end"
                          style={{ height: "100%" }}
                        >
                          {/* Tooltip */}
                          <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 hidden group-hover:block whitespace-nowrap rounded bg-[var(--bg-primary)] border border-[var(--border)] px-2 py-1 text-xs shadow-lg z-10">
                            <span className="font-medium text-[var(--text-primary)]">{d.requests} req</span>
                            <span className="text-[var(--text-muted)]"> · {d.avgMs}ms avg</span>
                            <div className="text-[var(--text-muted)]">{new Date(d.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</div>
                          </div>
                          {/* Bar */}
                          <div
                            className="w-full min-w-[4px] rounded-t bg-blue-500 transition-all hover:bg-blue-400"
                            style={{ height: `${Math.max(heightPct, 2)}%` }}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* X-axis labels (show first, middle, last) */}
                  <div className="flex justify-between text-xs text-[var(--text-muted)]">
                    {[usage.daily[0], usage.daily[Math.floor(usage.daily.length / 2)], usage.daily[usage.daily.length - 1]]
                      .filter((d): d is NonNullable<typeof d> => d != null)
                      .map((d) => (
                        <span key={d.date}>{new Date(d.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
                      ))}
                  </div>

                  {/* Summary table */}
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Requests</TableHead>
                        <TableHead className="text-right">Avg Response</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[...usage.daily].reverse().map((d) => (
                        <TableRow key={d.date}>
                          <TableCell className="text-sm">{new Date(d.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</TableCell>
                          <TableCell className="text-right font-mono text-sm">{d.requests.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-mono text-sm">{d.avgMs}ms</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              );
            })() : (
              <div className="mt-8 flex h-48 items-center justify-center rounded-lg bg-[var(--bg-tertiary)]">
                <p className="text-sm text-[var(--text-muted)]">No usage data for this period.</p>
              </div>
            )}
          </Card>
        </TabContent>

        {/* Webhooks Tab */}
        <TabContent value="webhooks">
          {!webhooks?.length ? (
            <EmptyState
              icon={<Webhook className="h-8 w-8" />}
              title="No webhooks configured"
              description="Set up webhooks to receive real-time notifications when events occur."
              action={{ label: "Add webhook", onClick: () => setShowCreateWebhook(true) }}
            />
          ) : (
            <div className="space-y-3">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-[var(--text-secondary)]">
                  Receive real-time notifications when events occur.
                </p>
                <Button size="sm" icon={<Plus className="h-4 w-4" />} onClick={() => setShowCreateWebhook(true)}>
                  Add webhook
                </Button>
              </div>
              {webhooks.map((wh) => (
                <Card key={wh.id} padding="md">
                  <div className="flex items-center justify-between">
                    <div>
                      <code className="text-sm font-mono text-[var(--text-primary)]">{wh.url}</code>
                      <div className="mt-1 flex gap-1">
                        {wh.events.map((e) => <Badge key={e} size="sm" color="purple">{e}</Badge>)}
                      </div>
                    </div>
                    <Badge color={wh.isActive ? "green" : "gray"}>{wh.isActive ? "Active" : "Inactive"}</Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabContent>
      </Tabs>

      {/* Create Webhook Modal */}
      <Modal
        open={showCreateWebhook}
        onOpenChange={(open) => {
          setShowCreateWebhook(open);
          if (!open) {
            setNewWebhookUrl("");
            setNewWebhookEvents(["translation.completed"]);
            setCreatedWebhookSecret(null);
          }
        }}
        title="Add Webhook"
        size="sm"
      >
        {createdWebhookSecret ? (
          <div className="space-y-4">
            <p className="text-sm text-[var(--text-secondary)]">
              Copy this signing secret now. You won't be able to see it again.
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded-lg border bg-[var(--bg-secondary)] px-3 py-2 text-sm font-mono break-all">
                {createdWebhookSecret}
              </code>
              <Button variant="secondary" size="icon" onClick={() => copyKey(createdWebhookSecret)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <Button className="w-full" onClick={() => { setCreatedWebhookSecret(null); setShowCreateWebhook(false); setNewWebhookUrl(""); setNewWebhookEvents(["translation.completed"]); }}>
              Done
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Input
              label="Payload URL"
              value={newWebhookUrl}
              onChange={(e) => setNewWebhookUrl(e.target.value)}
              placeholder="https://example.com/webhook"
            />
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">Events</label>
              <div className="space-y-2">
                {["translation.completed", "sign.created", "sign.updated"].map((event) => (
                  <label key={event} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                    <input
                      type="checkbox"
                      checked={newWebhookEvents.includes(event)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewWebhookEvents((prev) => [...prev, event]);
                        } else {
                          setNewWebhookEvents((prev) => prev.filter((ev) => ev !== event));
                        }
                      }}
                      className="rounded border-[var(--border)]"
                    />
                    <code className="text-xs">{event}</code>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setShowCreateWebhook(false)}>Cancel</Button>
              <Button
                onClick={() => createWebhook.mutate()}
                loading={createWebhook.isPending}
                disabled={!newWebhookUrl.trim() || newWebhookEvents.length === 0}
              >
                Create
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Key Modal */}
      <Modal open={showCreateKey} onOpenChange={setShowCreateKey} title="Create API Key" size="sm">
        {createdKey ? (
          <div className="space-y-4">
            <p className="text-sm text-[var(--text-secondary)]">
              Copy this key now. You won't be able to see it again.
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded-lg border bg-[var(--bg-secondary)] px-3 py-2 text-sm font-mono break-all">
                {createdKey}
              </code>
              <Button variant="secondary" size="icon" onClick={() => copyKey(createdKey)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <Button className="w-full" onClick={() => { setCreatedKey(null); setShowCreateKey(false); }}>
              Done
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Input
              label="Key name"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="e.g., Production API"
            />
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setShowCreateKey(false)}>Cancel</Button>
              <Button onClick={() => createKey.mutate()} loading={createKey.isPending}>
                Create
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
