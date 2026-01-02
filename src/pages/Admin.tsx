import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Copy, X } from "lucide-react";

const Admin = () => {
  const [name, setName] = useState("Okta");
  const [callbackUrl, setCallbackUrl] = useState("https://login.devolutions.xyz/op/login/callback");
  const [logoutUrl, setLogoutUrl] = useState("https://login.devolutions.xyz/op/logout");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [discoveryUrl, setDiscoveryUrl] = useState("");
  const [selectedScopes, setSelectedScopes] = useState<string[]>(["openid", "offline_access", "email", "profile"]);
  const [newScope, setNewScope] = useState("");

  const handleCopy = (text: string) => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch((err) => {
        console.error('Failed to copy text:', err);
      });
    }
  };

  const handleAddScope = () => {
    if (newScope.trim() && !selectedScopes.includes(newScope.trim())) {
      setSelectedScopes([...selectedScopes, newScope.trim()]);
      setNewScope("");
    }
  };

  const handleRemoveScope = (scope: string) => {
    setSelectedScopes(selectedScopes.filter((s) => s !== scope));
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Configure Single Sign-On (SSO)</h1>
          <div className="text-2xl font-bold text-blue-600">okta</div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="default" className="w-full">
          <TabsList className="bg-transparent border-b border-border rounded-none h-auto p-0">
            <TabsTrigger 
              value="default"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-4 py-2"
            >
              Default
            </TabsTrigger>
            <TabsTrigger 
              value="advanced"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-4 py-2"
            >
              Advanced
            </TabsTrigger>
          </TabsList>

          <TabsContent value="default" className="space-y-6 mt-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="max-w-md border-green-500 focus-visible:ring-green-500"
              />
              <p className="text-sm text-muted-foreground">
                This name will only appears in your Hub SSO settings menu.
              </p>
            </div>

            {/* Callback URL */}
            <div className="space-y-2">
              <Label htmlFor="callback-url">Callback URL</Label>
              <div className="flex items-center gap-2 max-w-2xl">
                <Input
                  id="callback-url"
                  value={callbackUrl}
                  onChange={(e) => setCallbackUrl(e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopy(callbackUrl)}
                  className="shrink-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                You may need to configure the OIDC Issuer with this callback URL
              </p>
            </div>

            {/* Logout redirect URL */}
            <div className="space-y-2">
              <Label htmlFor="logout-url">Logout redirect URL</Label>
              <div className="flex items-center gap-2 max-w-2xl">
                <Input
                  id="logout-url"
                  value={logoutUrl}
                  onChange={(e) => setLogoutUrl(e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopy(logoutUrl)}
                  className="shrink-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Client ID */}
            <div className="space-y-2">
              <Label htmlFor="client-id">Client ID</Label>
              <Input
                id="client-id"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="max-w-md"
              />
            </div>

            {/* Client secret Key */}
            <div className="space-y-2">
              <Label htmlFor="client-secret">Client secret Key</Label>
              <Input
                id="client-secret"
                type="password"
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                className="max-w-md"
              />
              <p className="text-sm text-muted-foreground">
                Get your key and paste it here
              </p>
            </div>

            {/* User Scopes */}
            <div className="space-y-2">
              <Label htmlFor="user-scopes">User Scopes</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedScopes.map((scope) => (
                  <Badge
                    key={scope}
                    variant="secondary"
                    className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-1"
                  >
                    {scope}
                    <button
                      onClick={() => handleRemoveScope(scope)}
                      className="ml-2 hover:text-blue-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-2 max-w-md">
                <Input
                  id="user-scopes"
                  placeholder="Add scope"
                  value={newScope}
                  onChange={(e) => setNewScope(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddScope();
                    }
                  }}
                />
              </div>
            </div>

            {/* Discovery URL */}
            <div className="space-y-2">
              <Label htmlFor="discovery-url">Discovery URL</Label>
              <div className="flex items-center gap-2 max-w-2xl">
                <Input
                  id="discovery-url"
                  value={discoveryUrl}
                  onChange={(e) => setDiscoveryUrl(e.target.value)}
                  placeholder="Enter discovery URL"
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  /.well-known/openid-configuration
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Enter the URL of the Discovery document of the OpenID Connect provider you want to connect with.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="mt-6">
            <p className="text-muted-foreground">Advanced settings coming soon...</p>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button variant="outline">Cancel</Button>
          <Button className="bg-blue-600 hover:bg-blue-700">Test Configuration</Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Admin;

