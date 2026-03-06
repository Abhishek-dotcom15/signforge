import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { User, Palette, Bell, Shield, Globe } from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Switch } from "@/components/common/Switch";
import { Tabs, TabContent } from "@/components/common/Tabs";
import { Avatar } from "@/components/common/Avatar";
import { Alert } from "@/components/common/Alert";
import { useAuthStore } from "@/stores/auth-store";
import { useThemeStore } from "@/stores/theme-store";
import { userApi } from "@/features/user/api/user-api";
import { getErrorMessage } from "@/lib/api-client";
import toast from "react-hot-toast";

export function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const updateProfile = useMutation({
    mutationFn: () => userApi.updateProfile({ fullName, displayName }),
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      toast.success("Profile saved");
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const changePassword = useMutation({
    mutationFn: () => userApi.changePassword({ currentPassword, newPassword }),
    onSuccess: () => {
      toast.success("Password updated");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const handlePasswordSubmit = () => {
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    changePassword.mutate();
  };

  const tabItems = [
    { value: "profile", label: "Profile", icon: <User className="h-4 w-4" /> },
    { value: "appearance", label: "Appearance", icon: <Palette className="h-4 w-4" /> },
    { value: "notifications", label: "Notifications", icon: <Bell className="h-4 w-4" /> },
    { value: "security", label: "Security", icon: <Shield className="h-4 w-4" /> },
    { value: "language", label: "Language", icon: <Globe className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Settings</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Manage your account preferences</p>
      </div>

      <Tabs items={tabItems} defaultValue="profile">
        {/* Profile */}
        <TabContent value="profile">
          <Card padding="lg">
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
            <div className="mt-6 flex flex-col gap-6 sm:flex-row">
              <div className="flex flex-col items-center gap-3">
                <Avatar src={user?.avatarUrl} name={user?.fullName || "U"} size="xl" />
                <Button variant="secondary" size="sm">Change photo</Button>
              </div>
              <div className="flex-1 space-y-4">
                <Input label="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                <Input label="Display name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} hint="How your name appears to others" />
                <Input label="Email" value={user?.email || ""} disabled hint="Contact support to change your email" />
                <div className="flex justify-end">
                  <Button onClick={() => updateProfile.mutate()} loading={updateProfile.isPending}>Save changes</Button>
                </div>
              </div>
            </div>
          </Card>
        </TabContent>

        {/* Appearance */}
        <TabContent value="appearance">
          <Card padding="lg">
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how SignForge looks</CardDescription>
            <div className="mt-6 space-y-4">
              <p className="text-sm font-medium text-[var(--text-primary)]">Theme</p>
              <div className="grid grid-cols-3 gap-3">
                {(["light", "dark", "system"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`rounded-xl border-2 p-4 text-center text-sm font-medium capitalize transition-colors ${
                      theme === t
                        ? "border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-400"
                        : "border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]"
                    }`}
                  >
                    {t === "light" && <Palette className="mx-auto mb-2 h-6 w-6" />}
                    {t === "dark" && <Palette className="mx-auto mb-2 h-6 w-6" />}
                    {t === "system" && <Globe className="mx-auto mb-2 h-6 w-6" />}
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </TabContent>

        {/* Notifications */}
        <TabContent value="notifications">
          <Card padding="lg">
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Choose what notifications you receive</CardDescription>
            <div className="mt-6 space-y-1 divide-y">
              <Switch
                label="Email notifications"
                description="Receive updates about your account via email"
                checked={emailNotifs}
                onCheckedChange={setEmailNotifs}
                className="py-4"
              />
              <Switch
                label="Push notifications"
                description="Get browser push notifications for real-time updates"
                checked={pushNotifs}
                onCheckedChange={setPushNotifs}
                className="py-4"
              />
              <Switch
                label="Weekly digest"
                description="Receive a weekly summary of your learning progress"
                checked={true}
                onCheckedChange={() => {}}
                className="py-4"
              />
            </div>
          </Card>
        </TabContent>

        {/* Security */}
        <TabContent value="security">
          <div className="space-y-6">
            <Card padding="lg">
              <CardTitle>Change Password</CardTitle>
              <div className="mt-4 space-y-4">
                <Input
                  label="Current password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <Input
                  label="New password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  hint="Minimum 8 characters"
                  autoComplete="new-password"
                  error={newPassword.length > 0 && newPassword.length < 8 ? "Must be at least 8 characters" : undefined}
                />
                <Input
                  label="Confirm new password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  error={confirmPassword.length > 0 && confirmPassword !== newPassword ? "Passwords do not match" : undefined}
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handlePasswordSubmit}
                    loading={changePassword.isPending}
                    disabled={!currentPassword || !newPassword || !confirmPassword}
                  >
                    Update password
                  </Button>
                </div>
              </div>
            </Card>
            <Card padding="lg">
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>Manage devices where you're logged in</CardDescription>
              <div className="mt-4">
                <Alert variant="info">
                  Session management will be available in a future update.
                </Alert>
              </div>
            </Card>
            <Card padding="lg" className="border-red-200 dark:border-red-800">
              <CardTitle className="!text-red-600 dark:!text-red-400">Danger Zone</CardTitle>
              <CardDescription>Irreversible account actions</CardDescription>
              <div className="mt-4">
                <Button variant="danger" size="sm">Delete account</Button>
              </div>
            </Card>
          </div>
        </TabContent>

        {/* Language */}
        <TabContent value="language">
          <Card padding="lg">
            <CardTitle>Language & Accessibility</CardTitle>
            <CardDescription>Configure language and accessibility options</CardDescription>
            <div className="mt-6 space-y-1 divide-y">
              <div className="py-4">
                <p className="text-sm font-medium text-[var(--text-primary)]">Interface Language</p>
                <div className="mt-2 flex gap-3">
                  {[{ code: "en", label: "English" }, { code: "hi", label: "Hindi" }].map((lang) => (
                    <button
                      key={lang.code}
                      className={`rounded-lg border px-4 py-2 text-sm font-medium ${
                        (user?.locale || "en") === lang.code
                          ? "border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-400"
                          : "border-[var(--border-default)] text-[var(--text-secondary)]"
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>
              <Switch
                label="Deaf-friendly mode"
                description="Optimize the interface with visual cues instead of audio"
                checked={user?.isDeaf || false}
                onCheckedChange={() => {}}
                className="py-4"
              />
              <Switch
                label="High contrast mode"
                description="Increase contrast for better visibility"
                checked={false}
                onCheckedChange={() => {}}
                className="py-4"
              />
            </div>
          </Card>
        </TabContent>
      </Tabs>
    </div>
  );
}
