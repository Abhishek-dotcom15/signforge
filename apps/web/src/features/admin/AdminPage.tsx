import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, BookOpen, Activity, Search } from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Input } from "@/components/common/Input";
import { Stat } from "@/components/common/Stat";
import { Spinner } from "@/components/common/Spinner";
import { ErrorState } from "@/components/common/ErrorState";
import { Tabs, TabContent } from "@/components/common/Tabs";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/common/Table";
import { Avatar } from "@/components/common/Avatar";
import { useDebounce } from "@/hooks";
import { adminApi } from "./api/admin-api";

export function AdminPage() {
  const [userSearch, setUserSearch] = useState("");
  const debouncedSearch = useDebounce(userSearch, 300);

  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => adminApi.getStats(),
  });

  const { data: users, isLoading: usersLoading, error: usersError, refetch } = useQuery({
    queryKey: ["admin-users", debouncedSearch],
    queryFn: () => adminApi.listUsers({ search: debouncedSearch || undefined }),
  });

  const tabItems = [
    { value: "overview", label: "Overview", icon: <Activity className="h-4 w-4" /> },
    { value: "users", label: "Users", icon: <Users className="h-4 w-4" /> },
    { value: "content", label: "Content", icon: <BookOpen className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Admin Panel</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          System administration and user management
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Stat label="Total Users" value={stats?.totalUsers ?? "--"} icon={<Users className="h-5 w-5" />} />
        <Stat label="Active Users" value={stats?.activeUsers ?? "--"} icon={<Activity className="h-5 w-5" />} />
        <Stat label="Signs in DB" value={stats?.totalSigns ?? "--"} icon={<BookOpen className="h-5 w-5" />} />
        <Stat label="Stories" value={stats?.totalStories ?? "--"} icon={<BookOpen className="h-5 w-5" />} />
      </div>

      <Tabs items={tabItems} defaultValue="overview">
        {/* Overview */}
        <TabContent value="overview">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card padding="lg">
              <CardTitle>System Health</CardTitle>
              <CardDescription>All services operational</CardDescription>
              <div className="mt-4 space-y-3">
                {["API Server", "Database", "Redis Cache", "Worker Queue"].map((service) => (
                  <div key={service} className="flex items-center justify-between rounded-lg bg-[var(--bg-secondary)] px-4 py-3">
                    <span className="text-sm font-medium text-[var(--text-primary)]">{service}</span>
                    <Badge color="green" size="sm">Healthy</Badge>
                  </div>
                ))}
              </div>
            </Card>
            <Card padding="lg">
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest system events</CardDescription>
              <div className="mt-4 flex h-48 items-center justify-center rounded-lg bg-[var(--bg-tertiary)]">
                <p className="text-sm text-[var(--text-muted)]">Activity feed will render here</p>
              </div>
            </Card>
          </div>
        </TabContent>

        {/* Users */}
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
            <div className="flex justify-center py-8"><Spinner /></div>
          ) : usersError ? (
            <ErrorState onRetry={() => refetch()} />
          ) : !users?.data?.length ? (
            <div className="py-12 text-center text-sm text-[var(--text-muted)]">No users found</div>
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
                        <Avatar src={u.avatarUrl} name={u.fullName} size="sm" />
                        <span className="font-medium">{u.fullName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-[var(--text-muted)]">{u.email}</TableCell>
                    <TableCell>
                      <Badge
                        color={u.roles.includes("admin") ? "purple" : u.roles.includes("teacher") ? "blue" : "gray"}
                        size="sm"
                      >
                        {u.roles[0] || "learner"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge color={u.isActive ? "green" : "gray"} size="sm">
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

        {/* Content */}
        <TabContent value="content">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card padding="lg">
              <CardTitle>Sign Database</CardTitle>
              <CardDescription>Manage the ISL sign dictionary</CardDescription>
              <div className="mt-4 flex h-32 items-center justify-center rounded-lg bg-[var(--bg-tertiary)]">
                <p className="text-sm text-[var(--text-muted)]">Sign management interface coming soon</p>
              </div>
            </Card>
            <Card padding="lg">
              <CardTitle>Story Management</CardTitle>
              <CardDescription>Manage Jataka Tales content</CardDescription>
              <div className="mt-4 flex h-32 items-center justify-center rounded-lg bg-[var(--bg-tertiary)]">
                <p className="text-sm text-[var(--text-muted)]">Story management interface coming soon</p>
              </div>
            </Card>
          </div>
        </TabContent>
      </Tabs>
    </div>
  );
}
