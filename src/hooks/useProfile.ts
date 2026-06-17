import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  linkedin: string | null;
  portfolio: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const resolveAvatar = useCallback(async (path: string | null) => {
    if (!path) {
      setAvatarUrl(null);
      return;
    }
    // Legacy: if it's already a full URL, use as-is
    if (path.startsWith('http')) {
      setAvatarUrl(path);
      return;
    }
    const { data, error } = await supabase.storage
      .from('avatars')
      .createSignedUrl(path, 60 * 60 * 24 * 365);
    if (!error && data) setAvatarUrl(data.signedUrl);
    else setAvatarUrl(null);
  }, []);

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      if (error) throw error;
      setProfile(data);
      await resolveAvatar(data?.avatar_url ?? null);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }, [user, resolveAvatar]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setAvatarUrl(null);
      setLoading(false);
    }
  }, [user, fetchProfile]);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id);
      if (error) throw error;
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      toast({ title: "Profile updated", description: "Your profile has been saved." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return;
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "Image too large", description: "Please use an image under 10MB.", variant: "destructive" });
      return;
    }
    setUploadingAvatar(true);
    try {
      // Remove any existing avatars for this user
      const { data: existing } = await supabase.storage.from('avatars').list(user.id);
      if (existing && existing.length) {
        await supabase.storage
          .from('avatars')
          .remove(existing.map(f => `${user.id}/${f.name}`));
      }
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `${user.id}/avatar-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true, cacheControl: '3600', contentType: file.type });
      if (upErr) throw upErr;
      const { error: updErr } = await supabase
        .from('profiles')
        .update({ avatar_url: path })
        .eq('user_id', user.id);
      if (updErr) throw updErr;
      setProfile(prev => prev ? { ...prev, avatar_url: path } : null);
      await resolveAvatar(path);
      toast({ title: "Photo uploaded", description: "Your profile photo is saved." });
    } catch (error: any) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const deleteAvatar = async () => {
    if (!user || !profile?.avatar_url) return;
    setUploadingAvatar(true);
    try {
      if (!profile.avatar_url.startsWith('http')) {
        await supabase.storage.from('avatars').remove([profile.avatar_url]);
      }
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('user_id', user.id);
      if (error) throw error;
      setProfile(prev => prev ? { ...prev, avatar_url: null } : null);
      setAvatarUrl(null);
      toast({ title: "Photo removed" });
    } catch (error: any) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    } finally {
      setUploadingAvatar(false);
    }
  };

  return {
    profile,
    avatarUrl,
    loading,
    uploadingAvatar,
    updateProfile,
    uploadAvatar,
    deleteAvatar,
    refetchProfile: fetchProfile,
  };
};
