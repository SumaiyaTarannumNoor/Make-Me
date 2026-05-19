import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export const useIsAdmin = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['isAdmin', user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin');
      return (data && data.length > 0) || false;
    },
    enabled: !!user,
  });
};

export interface AdminProfile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  is_premium: boolean;
  created_at: string;
  registered_at?: string;
  last_sign_in_at?: string | null;
  is_active?: boolean;
}

export const useAdminUsers = () => {
  return useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('admin-list-users');
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return (data?.users ?? []) as AdminProfile[];
    },
    refetchInterval: 30000,
  });
};

export const useTogglePremium = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ userId, isPremium }: { userId: string; isPremium: boolean }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ is_premium: isPremium } as any)
        .eq('user_id', userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      toast({ title: 'Updated', description: 'User premium status updated.' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await supabase.functions.invoke('admin-delete-user', {
        body: { user_id: userId },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      toast({ title: 'Deleted', description: 'User account has been deleted.' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};
