import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  BookOpen,
  Activity,
  Search,
  CheckCircle,
  XCircle,
  HelpCircle,
  UserPlus,
  FileText,
  Clock,
} from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Input } from "@/components/common/Input";
import { Stat } from "@/components/common/Stat";
import { Spinner } from "@/components/common/Spinner";
import { ErrorState } from "@/components/common/ErrorState";
import { Tabs, TabContent } from "@/components/common/Tabs";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/common/Table";
import { Avatar } from "@/components/common/Avatar";
import { Select } from "@/components/common/Select";
import { useDebounce } from "@/hooks";
import { adminApi } from "./api/admin-api";
import type { ServiceHealth } from "./api/admin-api";
import { signsApi } from "@/features/communication/api/translate-api";
import { storiesApi } from "@/features/stories/api/stories-api";

// ----- helper maps -----

const difficultyColor = {
  beginner: "green" as const,
  intermediate: "amber" as const,
  advanced: "red" as const,
};

const themeColor = {
  animal: "blue" as const,
  human: "purple" as const,
  wisdom: "amber" as const,
  sacrifice: "red" as const,
  karmic: "gray" as const,
};

const difficultyOptions = [
  { value: "all", label: "All difficulties" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

function serviceStatusIcon(status: ServiceHealth["status"]) {
  switch (status) {
    case "healthy":
      return <CheckCircle className="h-4 w-4 text-emerald-500" />;
    case "unhealthy":
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return <HelpCircle className="h-4 w-4 text-amber-500" />;
  }
}

function serviceStatusBadge(status: ServiceHealth["status"]) {
  const map = { healthy: "green", unhealthy: "red", unknown: "amber" } as const;
  const label = { healthy: "Healthy", unhealthy: "Unhealthy", unknown: "Unknown" } as const;
  return (
    <Badge color={map[status]} size="sm">
      {label[status]}
    </Badge>
  );
}

function formatRelativeTime(timestamp: string | null): string {
  if (!timestamp) return "Unknown";
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString();
}

// ----- main component -----

export function AdminPage() {
  const [userSearch, setUserSearch] = useState("");
  const debouncedSearch = useDebounce(userSearch, 300);

  // Signs tab state
  const [signSearch, setSignSearch] = useState("");
  const debouncedSignSearch = useDebounce(signSearch, 300);
  const [signDifficulty, setSignDifficulty] = useState("all");

  // Stories tab state
  const [storyDifficulty, setStoryDifficulty] = useState("all");

  // ---- queries ----

  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => adminApi.getStats(),
  });

  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ["admin-users", debouncedSearch],
    queryFn: () =>
      adminApi.listUsers({ search: debouncedSearch || undefined }),
  });

  const {
    data: signs,
    isLoading: signsLoading,
    error: signsError,
    refetch: refetchSigns,
  } = useQuery({
    queryKey: ["admin-signs", debouncedSignSearch, signDifficulty],
    queryFn: () =>
      signsApi.list({
        q: debouncedSignSearch || undefined,
        difficulty: signDifficulty === "all" ? undefined : signDifficulty,
        perPage: 50,
      }),
  });

  const {
    data: stories,
    isLoading: storiesLoading,
    error: storiesError,
    refetch: refetchStories,
  } = useQuery({
    queryKey: ["admin-stories", storyDifficulty],
    queryFn: () =>
      storiesApi.list({
        difficulty: storyDifficulty === "all" ? undefined : storyDifficulty,
        perPage: 50,
      }),
  });

  // ---- tabs ----

  const tabItems = [
    {
      value: "overview",
      label: "Overview",
      icon: <Activity className="h-4 w-4" />,
    },
    {
      value: "users",
      label: "Users",
      icon: <Users className="h-4 w-4" />,
    },
    {
      value: "content",
      label: "Content",
      icon: <BookOpen className="h-4 w-4" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Admin Panel
        </h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          System administration and user management
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Stat
          label="Total Users"
          value={stats?.totalUsers ?? "--"}
          icon={<Users className="h-5 w-5" />}
        />
        <Stat
          label="Active Users"
          value={stats?.activeUsers ?? "--"}
          icon={<Activity className="h-5 w-5" />}
        />
        <Stat
          label="Signs in DB"
          value={stats?.totalSigns ?? "--"}
          icon={<BookOpen className="h-5 w-5" />}
        />
        <Stat
          label="Stories"
          value={stats?.totalStories ?? "--"}
          icon={<BookOpen className="h-5 w-5" />}
        />
      </div>

      <Tabs items={tabItems} defaultValue="overview">
        {/* ====== Overview Tab ====== */}
        <TabContent value="overview">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* System Health */}
            <Card padding="lg">
              <CardTitle>System Health</CardTitle>
              <CardDescription>Live service status</CardDescription>
              <div className="mt-4 space-y-3">
                {statsLoading ? (
                  <div className="flex justify-center py-8">
                    <Spinner />
                  </div>
                ) : statsError ? (
                  <ErrorState onRetry={() => refetchStats()} />
                ) : (
                  (stats?.services ?? []).map((svc) => (
                    <div
                      key={svc.name}
                      className="flex items-center justify-between rounded-lg bg-[var(--bg-secondary)] px-4 py-3"
                    >
                      <div className="flex items-center gap-2">
                        {serviceStatusIcon(svc.status)}
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          {svc.name}
                        </span>
                      </div>
                      {serviceStatusBadge(svc.status)}
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Activity Feed */}
            <Card padding="lg">
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest system events</CardDescription>
              <div className="mt-4 max-h-80 space-y-1 overflow-y-auto">
                {statsLoading ? (
                  <div className="flex justify-center py-8">
                    <Spinner />
                  </div>
                ) : statsError ? (
                  <ErrorState onRetry={() => refetchStats()} />
                ) : !stats?.recentActivity?.length ? (
                  <div className="flex h-48 items-center justify-center rounded-lg bg-[var(--bg-tertiary)]">
                    <p className="text-sm text-[var(--text-muted)]">
                      No recent activity
                    </p>
                  </div>
                ) : (
                  stats.recentActivity.map((item, idx) => (
                    <div
                      key={`${item.type}-${idx}`}
                      className="flex items-start gap-3 rounded-lg px-3 py-2.5 hover:bg-[var(--bg-secondary)] transition-colors"
                    >
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--bg-tertiary)]">
                        {item.type === "user_registered" ? (
                          <UserPlus className="h-4 w-4 text-blue-500" />
                        ) : (
                          <FileText className="h-4 w-4 text-purple-500" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-[var(--text-primary)] leading-snug">
                          {item.description}
                        </p>
                        <div className="mt-0.5 flex items-center gap-1 text-xs text-[var(--text-muted)]">
                          <Clock className="h-3 w-3" />
                          {formatRelativeTime(item.timestamp)}
                        </div>
                      </div>
                      <Badge
                        color={
                          item.type === "user_registered" ? "blue" : "purple"
                        }
                        size="sm"
                      >
                        {item.type === "user_registered"
                          ? "Registration"
                          : "Content"}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </TabContent>

        {/* ====== Users Tab ====== */}
        <TabContent value="users">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
              <Input
                placeholder="Search users..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          {usersLoading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : usersError ? (
            <ErrorState onRetry={() => refetchUsers()} />
          ) : !users?.data?.length ? (
            <div className="py-12 text-center text-sm text-[var(--text-muted)]">
              No users found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.data.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={u.avatarUrl}
                          name={u.fullName}
                          size="sm"
                        />
                        <span className="font-medium">{u.fullName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-[var(--text-muted)]">
                      {u.email}
                    </TableCell>
                    <TableCell>
                      <Badge
                        color={
                          u.roles.includes("admin")
                            ? "purple"
                            : u.roles.includes("teacher")
                              ? "blue"
                              : "gray"
                        }
                        size="sm"
                      >
                        {u.roles[0] || "learner"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        color={u.isActive ? "green" : "gray"}
                        size="sm"
                      >
                        {u.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-[var(--text-muted)]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabContent>

        {/* ====== Content Tab ====== */}
        <TabContent value="content">
          <div className="space-y-8">
            {/* Signs Section */}
            <Card padding="lg">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Sign Database</CardTitle>
                  <CardDescription>
                    Manage the ISL sign dictionary
                    {signs && (
                      <span className="ml-2 text-[var(--text-muted)]">
                        ({signs.total} total)
                      </span>
                    )}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                    <Input
                      placeholder="Search signs..."
                      value={signSearch}
                      onChange={(e) => setSignSearch(e.target.value)}
                      className="pl-9 w-56"
                    />
                  </div>
                  <Select
                    value={signDifficulty}
                    onValueChange={setSignDifficulty}
                    options={difficultyOptions}
                    className="w-44"
                  />
                </div>
              </div>

              <div className="mt-4">
                {signsLoading ? (
                  <div className="flex justify-center py-8">
                    <Spinner />
                  </div>
                ) : signsError ? (
                  <ErrorState onRetry={() => refetchSigns()} />
                ) : !signs?.data?.length ? (
                  <div className="py-12 text-center text-sm text-[var(--text-muted)]">
                    No signs found
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Word</TableHead>
                        <TableHead>Gloss</TableHead>
                        <TableHead>Difficulty</TableHead>
                        <TableHead className="text-right">Usage</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {signs.data.map((sign) => (
                        <TableRow key={sign.id}>
                          <TableCell>
                            <span className="font-medium text-[var(--text-primary)]">
                              {sign.englishWord}
                            </span>
                            {sign.hindiWord && (
                              <span className="ml-2 text-xs text-[var(--text-muted)]">
                                ({sign.hindiWord})
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <code className="rounded bg-[var(--bg-tertiary)] px-1.5 py-0.5 text-xs font-mono">
                              {sign.gloss}
                            </code>
                          </TableCell>
                          <TableCell>
                            <Badge
                              color={
                                difficultyColor[
                                  sign.difficulty as keyof typeof difficultyColor
                                ] ?? "gray"
                              }
                              size="sm"
                            >
                              {sign.difficulty}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right tabular-nums text-sm text-[var(--text-muted)]">
                            {(sign as { usageCount?: number }).usageCount ?? 0}
                          </TableCell>
                          <TableCell>
                            <Badge
                              color={
                                (sign as { isActive?: boolean }).isActive !== false
                                  ? "green"
                                  : "gray"
                              }
                              size="sm"
                            >
                              {(sign as { isActive?: boolean }).isActive !== false
                                ? "Active"
                                : "Inactive"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </Card>

            {/* Stories Section */}
            <Card padding="lg">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Story Management</CardTitle>
                  <CardDescription>
                    Manage Jataka Tales content
                    {stories && (
                      <span className="ml-2 text-[var(--text-muted)]">
                        ({stories.total} total)
                      </span>
                    )}
                  </CardDescription>
                </div>
                <Select
                  value={storyDifficulty}
                  onValueChange={setStoryDifficulty}
                  options={difficultyOptions}
                  className="w-44"
                />
              </div>

              <div className="mt-4">
                {storiesLoading ? (
                  <div className="flex justify-center py-8">
                    <Spinner />
                  </div>
                ) : storiesError ? (
                  <ErrorState onRetry={() => refetchStories()} />
                ) : !stories?.data?.length ? (
                  <div className="py-12 text-center text-sm text-[var(--text-muted)]">
                    No stories found
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Theme</TableHead>
                        <TableHead>Difficulty</TableHead>
                        <TableHead className="text-right">Chapters</TableHead>
                        <TableHead className="text-right">Views</TableHead>
                        <TableHead>Published</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stories.data.map((story) => (
                        <TableRow key={story.id}>
                          <TableCell>
                            <div>
                              <span className="font-medium text-[var(--text-primary)]">
                                {story.titleEn}
                              </span>
                              {story.titleHi && (
                                <p className="text-xs text-[var(--text-muted)]">
                                  {story.titleHi}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              color={
                                themeColor[
                                  story.theme as keyof typeof themeColor
                                ] ?? "gray"
                              }
                              size="sm"
                            >
                              {story.theme}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              color={
                                difficultyColor[
                                  story.difficulty as keyof typeof difficultyColor
                                ] ?? "gray"
                              }
                              size="sm"
                            >
                              {story.difficulty}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right tabular-nums text-sm text-[var(--text-muted)]">
                            {story.chapterCount}
                          </TableCell>
                          <TableCell className="text-right tabular-nums text-sm text-[var(--text-muted)]">
                            {story.viewCount.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge
                              color={
                                (story as { isPublished?: boolean }).isPublished
                                  ? "green"
                                  : "amber"
                              }
                              size="sm"
                            >
                              {(story as { isPublished?: boolean }).isPublished
                                ? "Published"
                                : "Draft"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </Card>
          </div>
        </TabContent>
      </Tabs>
    </div>
  );
}
