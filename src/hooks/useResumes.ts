import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Resume {
  id: string;
  user_id: string;
  template_id: string | null;
  title: string;
  personal_info: Record<string, any>;
  summary: string | null;
  experience: Record<string, any>[];
  education: Record<string, any>[];
  skills: Record<string, any>[];
  projects: Record<string, any>[];
  certifications: Record<string, any>[];
  pdf_url: string | null;
  is_complete: boolean;
  created_at: string;
  updated_at: string;
}

export const useResumes = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchResumes();
    } else {
      setResumes([]);
      setLoading(false);
    }
  }, [user]);

  const fetchResumes = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      const mappedData = (data || []).map(item => ({
        ...item,
        personal_info: (item.personal_info as Record<string, any>) || {},
        experience: (item.experience as Record<string, any>[]) || [],
        education: (item.education as Record<string, any>[]) || [],
        skills: (item.skills as Record<string, any>[]) || [],
        projects: (item.projects as Record<string, any>[]) || [],
        certifications: (item.certifications as Record<string, any>[]) || [],
      }));
      
      setResumes(mappedData);
    } catch (error: any) {
      console.error('Error fetching resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  const createResume = async (templateId?: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('resumes')
        .insert({
          user_id: user.id,
          template_id: templateId || null,
          title: 'Untitled Resume',
        })
        .select()
        .single();

      if (error) throw error;

      const mappedData = {
        ...data,
        personal_info: (data.personal_info as Record<string, any>) || {},
        experience: (data.experience as Record<string, any>[]) || [],
        education: (data.education as Record<string, any>[]) || [],
        skills: (data.skills as Record<string, any>[]) || [],
        projects: (data.projects as Record<string, any>[]) || [],
        certifications: (data.certifications as Record<string, any>[]) || [],
      };

      setResumes(prev => [mappedData, ...prev]);
      toast({
        title: "Resume created",
        description: "Start building your resume!",
      });
      return mappedData;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const updateResume = async (id: string, updates: Partial<Resume>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('resumes')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setResumes(prev =>
        prev.map(r => (r.id === id ? { ...r, ...updates } : r))
      );
    } catch (error: any) {
      toast({
        title: "Error saving",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteResume = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setResumes(prev => prev.filter(r => r.id !== id));
      toast({
        title: "Resume deleted",
        description: "Your resume has been removed.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return { resumes, loading, createResume, updateResume, deleteResume, refetchResumes: fetchResumes };
};
