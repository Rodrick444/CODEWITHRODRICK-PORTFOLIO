import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { LogOut, FolderKanban, User, Settings } from "lucide-react";
import ProjectManagement from "@/components/admin/ProjectManagement";
import ProfileManagement from "@/components/admin/ProfileManagement";
import AdminSettings from "@/components/admin/AdminSettings";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      await fetch("/api/auth/me", { credentials: "include" });
      setIsLoading(false);
    } catch (error) {
      toast({
        title: "Authentication required",
        description: "Please log in to access the admin panel",
        variant: "destructive",
      });
      setLocation("/admin/login");
    }
  };

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout");
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      setLocation("/");
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <h1 className="font-display text-lg sm:text-2xl font-bold text-primary truncate">
              CODEWITHRODRICK Admin
            </h1>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              data-testid="button-logout"
              className="shrink-0"
            >
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 sm:py-8">
        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="mb-4 sm:mb-8 w-full sm:w-auto flex flex-row sm:inline-flex">
            <TabsTrigger value="projects" data-testid="tab-projects" className="flex-1 sm:flex-initial min-w-0 text-xs sm:text-sm px-2 sm:px-4">
              <FolderKanban className="h-4 w-4 shrink-0 sm:mr-2" />
              <span className="hidden sm:inline">Projects</span>
            </TabsTrigger>
            <TabsTrigger value="profile" data-testid="tab-profile" className="flex-1 sm:flex-initial min-w-0 text-xs sm:text-sm px-2 sm:px-4">
              <User className="h-4 w-4 shrink-0 sm:mr-2" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="settings" data-testid="tab-settings" className="flex-1 sm:flex-initial min-w-0 text-xs sm:text-sm px-2 sm:px-4">
              <Settings className="h-4 w-4 shrink-0 sm:mr-2" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <ProjectManagement />
          </TabsContent>

          <TabsContent value="profile">
            <ProfileManagement />
          </TabsContent>

          <TabsContent value="settings">
            <AdminSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
