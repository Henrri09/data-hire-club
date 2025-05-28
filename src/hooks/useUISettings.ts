
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import supabase from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UISettings {
  id: string;
  setting_key: string;
  image_url: string | null;
  description: string | null;
}

interface UpdateUISettingsData {
  setting_key: string;
  image_url: string;
}

export const useUISettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: uiSettings, isLoading } = useQuery({
    queryKey: ['ui-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ui_settings')
        .select('*')
        .order('setting_key');

      if (error) throw error;
      return data as UISettings[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updateData: UpdateUISettingsData) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('ui_settings')
        .upsert({
          setting_key: updateData.setting_key,
          image_url: updateData.image_url,
          updated_by: user?.id,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ui-settings'] });
      toast({
        title: "Configuração atualizada",
        description: "A imagem foi atualizada com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar a configuração.",
        variant: "destructive",
      });
      console.error("Erro ao atualizar configuração de UI:", error);
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `empty-state/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('ui-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('ui-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    },
    onError: (error) => {
      toast({
        title: "Erro no upload",
        description: "Não foi possível fazer upload da imagem.",
        variant: "destructive",
      });
      console.error("Erro no upload:", error);
    },
  });

  const getSettingByKey = (key: string) => {
    return uiSettings?.find(setting => setting.setting_key === key);
  };

  return {
    uiSettings,
    isLoading,
    updateUISettings: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    uploadImage: uploadImageMutation.mutate,
    isUploading: uploadImageMutation.isPending,
    getSettingByKey,
  };
};
