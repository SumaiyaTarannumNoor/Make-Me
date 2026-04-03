import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAdminUsers, useTogglePremium, useDeleteUser } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  const premiumUsers = users?.filter(u => u.is_premium).length || 0;
  const freeUsers = totalUsers - premiumUsers;

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    setDeletingId(userId);
    try {
      await deleteUser.mutateAsync(userId);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="MakeMe Logo" className="w-8 h-8 rounded-full" />
            <span className="font-display font-bold text-lg">
              Make<span className="text-gradient">Me</span>
            </span>
            <Badge variant="outline" className="ml-2 border-primary/50 text-primary">
              <Shield className="w-3 h-3 mr-1" /> Admin
            </Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-6">
        <h1 className="font-display text-3xl font-bold text-foreground">Admin Dashboard</h1>

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
                  <p className="text-2xl font-bold text-foreground">{totalUsers}</p>
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
                  <p className="text-2xl font-bold text-foreground">{premiumUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Users className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Free Users</p>
                  <p className="text-2xl font-bold text-foreground">{freeUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="text-xl">All Users</CardTitle>
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
                      <TableHead>Account Type</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers?.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium">{u.full_name || '—'}</TableCell>
                        <TableCell>{u.email || '—'}</TableCell>
                        <TableCell>
                          {u.is_premium ? (
                            <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30">
                              <Crown className="w-3 h-3 mr-1" /> Premium
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Free</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(u.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {u.user_id !== user?.id && (
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
                                  {u.is_premium ? 'Remove Premium' : 'Make Premium'}
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  disabled={deletingId === u.user_id}
                                  onClick={() => handleDelete(u.user_id)}
                                >
                                  <Trash2 className="w-3 h-3 mr-1" />
                                  {deletingId === u.user_id ? 'Deleting...' : 'Delete'}
                                </Button>
                              </>
                            )}
                            {u.user_id === user?.id && (
                              <Badge variant="outline" className="text-muted-foreground">You</Badge>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredUsers?.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
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
      </div>
    </div>
  );
};

export default AdminDashboard;
