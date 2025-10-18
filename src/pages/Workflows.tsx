import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, Plus, Trash2, Play, Pause } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WorkflowRule {
  id: string;
  name: string;
  trigger: string;
  condition: string;
  action: string;
  enabled: boolean;
}

export default function Workflows() {
  const { toast } = useToast();
  const [rules, setRules] = useState<WorkflowRule[]>(() => {
    const stored = localStorage.getItem("workflowRules");
    return stored ? JSON.parse(stored) : [
      {
        id: "1",
        name: "Low Stock Alert",
        trigger: "stock_level_change",
        condition: "quantity < reorder_level",
        action: "send_email_notification",
        enabled: true,
      },
      {
        id: "2",
        name: "Auto Purchase Order",
        trigger: "stock_below_reorder",
        condition: "quantity < reorder_level",
        action: "create_purchase_order",
        enabled: true,
      },
    ];
  });

  const [newRule, setNewRule] = useState<Partial<WorkflowRule>>({
    name: "",
    trigger: "",
    condition: "",
    action: "",
    enabled: true,
  });

  const triggers = [
    { value: "stock_level_change", label: "Stock Level Changes" },
    { value: "new_sale", label: "New Sale Invoice" },
    { value: "new_purchase", label: "New Purchase Order" },
    { value: "payment_received", label: "Payment Received" },
    { value: "invoice_overdue", label: "Invoice Overdue" },
    { value: "daily_schedule", label: "Daily Schedule" },
  ];

  const conditions = [
    { value: "quantity < reorder_level", label: "Quantity below reorder point" },
    { value: "amount > threshold", label: "Amount exceeds threshold" },
    { value: "days_overdue > 30", label: "More than 30 days overdue" },
    { value: "customer_type = 'premium'", label: "Premium customer" },
  ];

  const actions = [
    { value: "send_email_notification", label: "Send Email Notification" },
    { value: "create_purchase_order", label: "Create Purchase Order" },
    { value: "update_stock_status", label: "Update Stock Status" },
    { value: "generate_report", label: "Generate Report" },
    { value: "send_whatsapp", label: "Send WhatsApp Message" },
  ];

  const saveRules = (updatedRules: WorkflowRule[]) => {
    setRules(updatedRules);
    localStorage.setItem("workflowRules", JSON.stringify(updatedRules));
  };

  const addRule = () => {
    if (!newRule.name || !newRule.trigger || !newRule.action) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const rule: WorkflowRule = {
      id: Date.now().toString(),
      name: newRule.name,
      trigger: newRule.trigger!,
      condition: newRule.condition || "",
      action: newRule.action!,
      enabled: true,
    };

    saveRules([...rules, rule]);
    setNewRule({ name: "", trigger: "", condition: "", action: "", enabled: true });
    toast({
      title: "Rule Created",
      description: `Workflow rule "${rule.name}" has been created`,
    });
  };

  const toggleRule = (id: string) => {
    const updated = rules.map(rule =>
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    );
    saveRules(updated);
    toast({
      title: "Rule Updated",
      description: "Workflow rule status has been changed",
    });
  };

  const deleteRule = (id: string) => {
    const updated = rules.filter(rule => rule.id !== id);
    saveRules(updated);
    toast({
      title: "Rule Deleted",
      description: "Workflow rule has been removed",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Zap className="h-8 w-8" />
          Workflow Automation
        </h1>
        <p className="text-muted-foreground">Configure automated workflows and business rules</p>
      </div>

      <Tabs defaultValue="rules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rules">Active Rules</TabsTrigger>
          <TabsTrigger value="create">Create Rule</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Workflow Rules</CardTitle>
              <CardDescription>
                {rules.filter(r => r.enabled).length} of {rules.length} rules are currently active
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {rules.map((rule) => (
                <div key={rule.id} className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{rule.name}</h4>
                      <Badge variant={rule.enabled ? "default" : "outline"}>
                        {rule.enabled ? "Active" : "Paused"}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p><strong>Trigger:</strong> {triggers.find(t => t.value === rule.trigger)?.label}</p>
                      {rule.condition && <p><strong>Condition:</strong> {rule.condition}</p>}
                      <p><strong>Action:</strong> {actions.find(a => a.value === rule.action)?.label}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleRule(rule.id)}
                    >
                      {rule.enabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteRule(rule.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Workflow Rule</CardTitle>
              <CardDescription>Define triggers, conditions, and actions for automation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ruleName">Rule Name</Label>
                <Input
                  id="ruleName"
                  placeholder="e.g., Auto-reorder low stock items"
                  value={newRule.name || ""}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="trigger">Trigger Event</Label>
                <Select
                  value={newRule.trigger}
                  onValueChange={(value) => setNewRule({ ...newRule, trigger: value })}
                >
                  <SelectTrigger id="trigger">
                    <SelectValue placeholder="Select trigger" />
                  </SelectTrigger>
                  <SelectContent>
                    {triggers.map((trigger) => (
                      <SelectItem key={trigger.value} value={trigger.value}>
                        {trigger.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition">Condition (Optional)</Label>
                <Select
                  value={newRule.condition}
                  onValueChange={(value) => setNewRule({ ...newRule, condition: value })}
                >
                  <SelectTrigger id="condition">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditions.map((condition) => (
                      <SelectItem key={condition.value} value={condition.value}>
                        {condition.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="action">Action</Label>
                <Select
                  value={newRule.action}
                  onValueChange={(value) => setNewRule({ ...newRule, action: value })}
                >
                  <SelectTrigger id="action">
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    {actions.map((action) => (
                      <SelectItem key={action.value} value={action.value}>
                        {action.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={addRule} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create Workflow Rule
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
