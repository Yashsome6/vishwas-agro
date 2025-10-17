import EmailTemplates from "@/components/notifications/EmailTemplates";

export default function Notifications() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Email Notifications</h1>
        <p className="text-muted-foreground">Manage automated email templates and notifications</p>
      </div>

      <EmailTemplates />
    </div>
  );
}
