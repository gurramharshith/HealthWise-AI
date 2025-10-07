
import { Settings } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center gap-4">
        <div className="bg-primary/10 p-3 rounded-lg">
          <Settings className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account and application settings.
          </p>
        </div>
      </header>
      <Card>
        <CardHeader>
            <CardTitle>Under Construction</CardTitle>
            <CardDescription>
                This page is currently under development. More settings will be available soon.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">Patient and Admin dashboards will be configured here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
