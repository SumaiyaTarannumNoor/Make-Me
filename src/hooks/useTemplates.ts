import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Template {
  id: string;
  name: string;
  description: string | null;
  experience_level: 'student' | 'fresher' | 'one_to_three' | 'three_to_five' | 'senior';
  preview_image_url: string | null;
  layout_config: {
    color?: string;
    layout?: string;
    sections?: string[];
  };
  is_active: boolean;
  created_at: string;
}

export const useTemplates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('resume_templates')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      const mappedData = (data || []).map(item => ({
        ...item,
        layout_config: (item.layout_config as { color?: string; layout?: string; sections?: string[] }) || {},
      }));
      
      setTemplates(mappedData);
    } catch (error: any) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTemplateById = (id: string) => {
    return templates.find(t => t.id === id);
  };

  const getExperienceLevelLabel = (level: string) => {
    const labels: Record<string, string> = {
      student: 'Students',
      fresher: 'Fresh Graduates',
      one_to_three: '1-3 Years Experience',
      three_to_five: '3-5 Years Experience',
      senior: 'Senior Professionals',
    };
    return labels[level] || level;
  };

  return { templates, loading, getTemplateById, getExperienceLevelLabel };
};
