import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GraduationCap, Users, ClipboardCopy, LogIn } from "lucide-react";
import { Card, CardTitle } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import { Input } from "@/components/common/Input";
import { Modal } from "@/components/common/Modal";
import { EmptyState } from "@/components/common/EmptyState";
import { Spinner } from "@/components/common/Spinner";
import { ErrorState } from "@/components/common/ErrorState";
import { Tabs, TabContent } from "@/components/common/Tabs";
import { educationApi } from "./api/education-api";
import { getErrorMessage } from "@/lib/api-client";
import toast from "react-hot-toast";

export function ClassroomPage() {
  const queryClient = useQueryClient();
  const [showJoin, setShowJoin] = useState(false);
  const [joinCode, setJoinCode] = useState("");

  const { data: classes, isLoading, error, refetch } = useQuery({
    queryKey: ["classes"],
    queryFn: () => educationApi.listClasses(),
  });

  const joinClass = useMutation({
    mutationFn: () => educationApi.joinClass(joinCode),
    onSuccess: (data) => {
      toast.success(`Joined ${data.className}!`);
      setShowJoin(false);
      setJoinCode("");
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Join code copied!");
  };

  const tabItems = [
    { value: "teaching", label: "Teaching", icon: <GraduationCap className="h-4 w-4" /> },
    { value: "enrolled", label: "Enrolled", icon: <Users className="h-4 w-4" /> },
  ];

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;
  if (error) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Classroom</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Manage your classes and assignments
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" icon={<LogIn className="h-4 w-4" />} onClick={() => setShowJoin(true)}>
            Join class
          </Button>
        </div>
      </div>

      <Tabs items={tabItems} defaultValue="teaching">
        <TabContent value="teaching">
          {!classes?.teaching.length ? (
            <EmptyState
              icon={<GraduationCap className="h-8 w-8" />}
              title="No classes yet"
              description="Create an institution and class to start teaching."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {classes.teaching.map((cls) => (
                <Card key={cls.id} hoverable padding="md">
                  <CardTitle className="!text-base">{cls.name}</CardTitle>
                  {cls.joinCode && (
                    <div className="mt-3 flex items-center gap-2">
                      <code className="rounded bg-[var(--bg-tertiary)] px-2 py-1 text-xs font-mono">{cls.joinCode}</code>
                      <button
                        onClick={() => copyCode(cls.joinCode!)}
                        className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                        aria-label="Copy join code"
                      >
                        <ClipboardCopy className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  <Badge color="blue" className="mt-2">Teacher</Badge>
                </Card>
              ))}
            </div>
          )}
        </TabContent>

        <TabContent value="enrolled">
          {!classes?.enrolled.length ? (
            <EmptyState
              icon={<Users className="h-8 w-8" />}
              title="Not enrolled in any class"
              description="Ask your teacher for a join code to get started."
              action={{ label: "Join a class", onClick: () => setShowJoin(true) }}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {classes.enrolled.map((cls) => (
                <Card key={cls.id} hoverable padding="md">
                  <CardTitle className="!text-base">{cls.name}</CardTitle>
                  <Badge color="green" className="mt-2">Student</Badge>
                </Card>
              ))}
            </div>
          )}
        </TabContent>
      </Tabs>

      {/* Join Modal */}
      <Modal open={showJoin} onOpenChange={setShowJoin} title="Join a Class" size="sm">
        <div className="space-y-4">
          <Input
            label="Join code"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            placeholder="Enter the code from your teacher"
          />
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setShowJoin(false)}>Cancel</Button>
            <Button onClick={() => joinClass.mutate()} loading={joinClass.isPending} disabled={!joinCode.trim()}>
              Join
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
