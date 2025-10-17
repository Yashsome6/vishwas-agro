import { useState } from "react";
import { useAppData } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CompanySettingsTab() {
  const { data, updateData } = useAppData();
  const { toast } = useToast();
  const [formData, setFormData] = useState(data.company);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateData("company", formData);
    toast({ 
      title: "Company settings updated",
      description: "Your company information has been saved successfully."
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          <div>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>Update your business details and contact information</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gst">GST Number *</Label>
              <Input
                id="gst"
                value={formData.gst}
                onChange={(e) => setFormData({ ...formData, gst: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="address">Business Address *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo">Company Logo (Emoji)</Label>
              <Input
                id="logo"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                maxLength={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="financialYear">Financial Year</Label>
              <Input
                id="financialYear"
                value={formData.financialYear}
                onChange={(e) => setFormData({ ...formData, financialYear: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
