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
  const [newKeyName, setNewKeyName] = useState("");
  const [createdKey, setCreatedKey] = useState<string | null>(null);

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
            <div className="mt-8 flex h-48 items-center justify-center rounded-lg bg-[var(--bg-tertiary)]">
              <p className="text-sm text-[var(--text-muted)]">Usage chart will render here</p>
            </div>
          </Card>
        </TabContent>

        {/* Webhooks Tab */}
        <TabContent value="webhooks">
          {!webhooks?.length ? (
            <EmptyState
              icon={<Webhook className="h-8 w-8" />}
              title="No webhooks configured"
              description="Set up webhooks to receive real-time notifications when events occur."
              action={{ label: "Add webhook", onClick: () => {} }}
            />
          ) : (
            <div className="space-y-3">
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
