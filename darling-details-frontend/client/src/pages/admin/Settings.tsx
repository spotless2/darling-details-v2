import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Success",
        description: "Settings have been saved successfully.",
      });
    }, 1000);
  };

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-2xl font-display mb-1">Settings</h1>
          <p className="text-gray-500">Manage your store settings</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input
                  id="storeName"
                  defaultValue="Darling Details"
                  className="max-w-md"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeEmail">Contact Email</Label>
                <Input
                  id="storeEmail"
                  type="email"
                  defaultValue="contact@darlingdetails.ro"
                  className="max-w-md"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storePhone">Contact Phone</Label>
                <Input
                  id="storePhone"
                  defaultValue="+40 123 456 789"
                  className="max-w-md"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Currency Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  defaultValue="RON"
                  className="max-w-md"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priceFormat">Price Format</Label>
                <Input
                  id="priceFormat"
                  defaultValue="###,###.## RON"
                  className="max-w-md"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end mt-6">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="min-w-[150px]"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </motion.div>
    </AdminLayout>
  );
}
