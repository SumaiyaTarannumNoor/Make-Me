import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAdminUsers, useTogglePremium, useDeleteUser } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger,
  SidebarHeader, SidebarFooter,
} from '@/components/ui/sidebar';
import { Crown, Trash2, Shield, Users, Search, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '@/assets/logo.png';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { data: users, isLoading } = useAdminUsers();
  const togglePremium = useTogglePremium();
  const deleteUser = useDeleteUser();
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredUsers = users?.filter(u =>
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalUsers = users?.length || 0;
  const activeUsers = users?.filter(u => u.is_active).length || 0;
  const premiumUsers = users?.filter(u => u.is_premium).length || 0;

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
    setDeletingId(userId);
    try { await deleteUser.mutateAsync(userId); }
    finally { setDeletingId(null); }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const formatDate = (d?: string | null) => {
    if (!d) return '—';
    return new Date(d).toLocaleString();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar collapsible="icon">
          <SidebarHeader className="border-b border-sidebar-border">
            <div className="flex items-center gap-2 px-2 py-2">
              <img src={logo} alt="MakeMe" className="w-8 h-8 rounded-full" />
              <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span className="font-display font-bold text-sm leading-tight">
                  Make<span className="text-gradient">Me</span>
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Admin
                </span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Management</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive tooltip="User list">
                      <Users className="h-4 w-4" />
                      <span>User list</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t border-sidebar-border">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleSignOut} tooltip="Logout">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm flex items-center px-4 gap-3 sticky top-0 z-40">
            <SidebarTrigger />
            <h1 className="font-display text-lg font-semibold">Admin Dashboard</h1>
          </header>

          <main className="flex-1 p-6 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Users</p>
                      <p className="text-2xl font-bold">{totalUsers}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Active Now</p>
                      <p className="text-2xl font-bold">{activeUsers}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-yellow-500/10">
                      <Crown className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Premium Users</p>
                      <p className="text-2xl font-bold">{premiumUsers}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Users Table */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <CardTitle className="text-xl">User list</CardTitle>
                  <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or email..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading users...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Registered</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Plan</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers?.map((u) => (
                          <TableRow key={u.id}>
                            <TableCell className="font-medium">{u.full_name || '—'}</TableCell>
                            <TableCell>{u.email || '—'}</TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {formatDate(u.registered_at || u.created_at)}
                            </TableCell>
                            <TableCell>
                              {u.is_active ? (
                                <Badge className="bg-green-500/10 text-green-600 border-green-500/30">
                                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" />
                                  Active
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="text-muted-foreground">
                                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 mr-1.5" />
                                  Offline
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {u.is_premium ? (
                                <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30">
                                  <Crown className="w-3 h-3 mr-1" /> Premium
                                </Badge>
                              ) : (
                                <Badge variant="secondary">Free</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                {u.user_id !== user?.id ? (
                                  <>
                                    <Button
                                      variant={u.is_premium ? 'outline' : 'hero'}
                                      size="sm"
                                      disabled={togglePremium.isPending}
                                      onClick={() => togglePremium.mutate({
                                        userId: u.user_id,
                                        isPremium: !u.is_premium,
                                      })}
                                    >
                                      <Crown className="w-3 h-3 mr-1" />
                                      {u.is_premium ? 'Remove' : 'Premium'}
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      disabled={deletingId === u.user_id}
                                      onClick={() => handleDelete(u.user_id)}
                                    >
                                      <Trash2 className="w-3 h-3 mr-1" />
                                      {deletingId === u.user_id ? '...' : 'Delete'}
                                    </Button>
                                  </>
                                ) : (
                                  <Badge variant="outline" className="text-muted-foreground">You</Badge>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                        {filteredUsers?.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                              No users found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
