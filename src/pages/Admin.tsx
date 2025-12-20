import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Users, 
  Image, 
  Settings, 
  CreditCard, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Edit3, 
  Save,
  X,
  RefreshCw,
  Shield
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  credits: number;
  created_at: string;
  updated_at: string;
  email: string | null;
}

interface Transformation {
  id: string;
  user_id: string | null;
  original_image_url: string;
  transformed_image_url: string | null;
  prompt_used: string | null;
  status: string;
  error_message: string | null;
  scenario_id: string | null;
  created_at: string;
  user_email: string | null;
  user_display_name: string | null;
}

interface Scenario {
  id: string;
  era: string;
  title: string;
  description: string;
  prompt_template: string;
  icon: string;
  gradient: string;
  accent: string;
  is_active: boolean;
  created_at: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [transformations, setTransformations] = useState<Transformation[]>([]);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [editingCredits, setEditingCredits] = useState<{ [key: string]: number }>({});
  const [editingScenario, setEditingScenario] = useState<Scenario | null>(null);
  const [newScenario, setNewScenario] = useState<Partial<Scenario>>({
    era: "",
    title: "",
    description: "",
    prompt_template: "",
    icon: "star",
    gradient: "from-amber-500/20 to-amber-900/20",
    accent: "text-amber-400",
    is_active: true,
  });
  const [showNewScenarioDialog, setShowNewScenarioDialog] = useState(false);

  useEffect(() => {
    checkAdminAndLoadData();
  }, []);

  const checkAdminAndLoadData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast.error("Please log in first");
      navigate("/");
      return;
    }

    // Check if user is admin using the has_role function
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (roleError || !roleData) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/");
      return;
    }

    setIsAdmin(true);
    await loadAllData();
    setLoading(false);
  };

  const loadAllData = async () => {
    await Promise.all([
      loadUsers(),
      loadTransformations(),
      loadScenarios(),
    ]);
  };

  const loadUsers = async () => {
    const { data, error } = await supabase.rpc('admin_get_all_profiles');
    if (error) {
      console.error('Error loading users:', error);
      toast.error("Failed to load users");
      return;
    }
    setUsers(data || []);
  };

  const loadTransformations = async () => {
    const { data, error } = await supabase.rpc('admin_get_all_transformations');
    if (error) {
      console.error('Error loading transformations:', error);
      toast.error("Failed to load transformations");
      return;
    }
    setTransformations(data || []);
  };

  const loadScenarios = async () => {
    const { data, error } = await supabase
      .from('scenarios')
      .select('*')
      .order('era', { ascending: true });
    
    if (error) {
      console.error('Error loading scenarios:', error);
      toast.error("Failed to load scenarios");
      return;
    }
    setScenarios(data || []);
  };

  const updateCredits = async (userId: string, newCredits: number) => {
    const { data, error } = await supabase.rpc('admin_update_credits', {
      _user_id: userId,
      _credits: newCredits,
    });

    if (error) {
      console.error('Error updating credits:', error);
      toast.error("Failed to update credits");
      return;
    }

    toast.success("Credits updated successfully!");
    setEditingCredits({});
    await loadUsers();
  };

  const updateScenario = async () => {
    if (!editingScenario) return;

    const { error } = await supabase
      .from('scenarios')
      .update({
        era: editingScenario.era,
        title: editingScenario.title,
        description: editingScenario.description,
        prompt_template: editingScenario.prompt_template,
        icon: editingScenario.icon,
        gradient: editingScenario.gradient,
        accent: editingScenario.accent,
        is_active: editingScenario.is_active,
      })
      .eq('id', editingScenario.id);

    if (error) {
      console.error('Error updating scenario:', error);
      toast.error("Failed to update scenario");
      return;
    }

    toast.success("Scenario updated!");
    setEditingScenario(null);
    await loadScenarios();
  };

  const createScenario = async () => {
    const { error } = await supabase
      .from('scenarios')
      .insert({
        era: newScenario.era || "",
        title: newScenario.title || "",
        description: newScenario.description || "",
        prompt_template: newScenario.prompt_template || "",
        icon: newScenario.icon || "star",
        gradient: newScenario.gradient || "from-amber-500/20 to-amber-900/20",
        accent: newScenario.accent || "text-amber-400",
        is_active: newScenario.is_active ?? true,
      });

    if (error) {
      console.error('Error creating scenario:', error);
      toast.error("Failed to create scenario");
      return;
    }

    toast.success("Scenario created!");
    setShowNewScenarioDialog(false);
    setNewScenario({
      era: "",
      title: "",
      description: "",
      prompt_template: "",
      icon: "star",
      gradient: "from-amber-500/20 to-amber-900/20",
      accent: "text-amber-400",
      is_active: true,
    });
    await loadScenarios();
  };

  const deleteScenario = async (id: string) => {
    if (!confirm("Are you sure you want to delete this scenario?")) return;

    const { error } = await supabase
      .from('scenarios')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting scenario:', error);
      toast.error("Failed to delete scenario");
      return;
    }

    toast.success("Scenario deleted!");
    await loadScenarios();
  };

  const toggleScenarioActive = async (id: string, isActive: boolean) => {
    const { error } = await supabase
      .from('scenarios')
      .update({ is_active: !isActive })
      .eq('id', id);

    if (error) {
      console.error('Error toggling scenario:', error);
      toast.error("Failed to update scenario");
      return;
    }

    toast.success(`Scenario ${!isActive ? 'activated' : 'deactivated'}!`);
    await loadScenarios();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 rounded-full border-2 border-muted border-t-primary"
        />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-heavy border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display text-2xl tracking-wide">ADMIN PANEL</h1>
                <p className="text-xs text-muted-foreground">Rewind Control Center</p>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadAllData}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3 bg-muted/50">
            <TabsTrigger value="users" className="gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="transformations" className="gap-2">
              <Image className="w-4 h-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="scenarios" className="gap-2">
              <Settings className="w-4 h-4" />
              Scenes
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <div className="card-premium p-6">
              <h2 className="text-xl font-display tracking-wide mb-4">
                ALL USERS ({users.length})
              </h2>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Credits</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                              {user.display_name?.[0]?.toUpperCase() || "?"}
                            </div>
                            <span className="font-medium">
                              {user.display_name || "No name"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.email || "N/A"}
                        </TableCell>
                        <TableCell>
                          {editingCredits[user.user_id] !== undefined ? (
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                value={editingCredits[user.user_id]}
                                onChange={(e) => setEditingCredits({
                                  ...editingCredits,
                                  [user.user_id]: parseInt(e.target.value) || 0,
                                })}
                                className="w-24 h-8"
                              />
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => updateCredits(user.user_id, editingCredits[user.user_id])}
                              >
                                <Save className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  const newEditing = { ...editingCredits };
                                  delete newEditing[user.user_id];
                                  setEditingCredits(newEditing);
                                }}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-primary font-bold">{user.credits}</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setEditingCredits({
                                  ...editingCredits,
                                  [user.user_id]: user.credits,
                                })}
                              >
                                <CreditCard className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingCredits({
                              ...editingCredits,
                              [user.user_id]: user.credits + 10,
                            })}
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            10 Credits
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          {/* Transformations Tab */}
          <TabsContent value="transformations" className="space-y-4">
            <div className="card-premium p-6">
              <h2 className="text-xl font-display tracking-wide mb-4">
                TRANSFORMATION HISTORY ({transformations.length})
              </h2>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Original</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transformations.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell>
                          {t.original_image_url && (
                            <img
                              src={t.original_image_url}
                              alt="Original"
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          {t.transformed_image_url ? (
                            <img
                              src={t.transformed_image_url}
                              alt="Transformed"
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <span className="text-muted-foreground text-xs">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">
                              {t.user_display_name || "Anonymous"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {t.user_email || "Guest"}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            t.status === 'completed' 
                              ? 'bg-neon-green/20 text-neon-green' 
                              : t.status === 'failed' 
                              ? 'bg-destructive/20 text-destructive'
                              : 'bg-primary/20 text-primary'
                          }`}>
                            {t.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(t.created_at).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          {/* Scenarios Tab */}
          <TabsContent value="scenarios" className="space-y-4">
            <div className="card-premium p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-display tracking-wide">
                  SCENARIOS ({scenarios.length})
                </h2>
                <Dialog open={showNewScenarioDialog} onOpenChange={setShowNewScenarioDialog}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="w-4 h-4" />
                      New Scene
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="font-display text-2xl">
                        CREATE NEW SCENARIO
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Era</label>
                          <Input
                            value={newScenario.era || ""}
                            onChange={(e) => setNewScenario({ ...newScenario, era: e.target.value })}
                            placeholder="e.g., 1970s"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Title</label>
                          <Input
                            value={newScenario.title || ""}
                            onChange={(e) => setNewScenario({ ...newScenario, title: e.target.value })}
                            placeholder="Scene title"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Description</label>
                        <Textarea
                          value={newScenario.description || ""}
                          onChange={(e) => setNewScenario({ ...newScenario, description: e.target.value })}
                          placeholder="Brief description"
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Prompt Template</label>
                        <Textarea
                          value={newScenario.prompt_template || ""}
                          onChange={(e) => setNewScenario({ ...newScenario, prompt_template: e.target.value })}
                          placeholder="Full prompt for AI generation..."
                          rows={6}
                        />
                      </div>
                      <Button onClick={createScenario} className="w-full">
                        Create Scenario
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4">
                {scenarios.map((scenario) => (
                  <motion.div
                    key={scenario.id}
                    className={`p-4 rounded-2xl border ${
                      scenario.is_active 
                        ? 'border-border bg-card' 
                        : 'border-destructive/30 bg-destructive/5'
                    }`}
                    layout
                  >
                    {editingScenario?.id === scenario.id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            value={editingScenario.era}
                            onChange={(e) => setEditingScenario({ 
                              ...editingScenario, 
                              era: e.target.value 
                            })}
                            placeholder="Era"
                          />
                          <Input
                            value={editingScenario.title}
                            onChange={(e) => setEditingScenario({ 
                              ...editingScenario, 
                              title: e.target.value 
                            })}
                            placeholder="Title"
                          />
                        </div>
                        <Textarea
                          value={editingScenario.description}
                          onChange={(e) => setEditingScenario({ 
                            ...editingScenario, 
                            description: e.target.value 
                          })}
                          placeholder="Description"
                          rows={2}
                        />
                        <Textarea
                          value={editingScenario.prompt_template}
                          onChange={(e) => setEditingScenario({ 
                            ...editingScenario, 
                            prompt_template: e.target.value 
                          })}
                          placeholder="Prompt Template"
                          rows={6}
                        />
                        <div className="flex gap-2">
                          <Button onClick={updateScenario} className="gap-2">
                            <Save className="w-4 h-4" />
                            Save
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setEditingScenario(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="era-tag text-xs">{scenario.era}</span>
                            {!scenario.is_active && (
                              <span className="px-2 py-0.5 rounded-full text-xs bg-destructive/20 text-destructive">
                                Inactive
                              </span>
                            )}
                          </div>
                          <h3 className="font-display text-xl">{scenario.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {scenario.description}
                          </p>
                          <p className="text-xs text-muted-foreground/60 mt-2 line-clamp-2">
                            {scenario.prompt_template.substring(0, 150)}...
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingScenario(scenario)}
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleScenarioActive(scenario.id, scenario.is_active)}
                          >
                            {scenario.is_active ? "Disable" : "Enable"}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => deleteScenario(scenario.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
