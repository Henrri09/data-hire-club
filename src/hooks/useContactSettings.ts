
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import supabase from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ContactSettings } from '@/types/contact.types';

export function useContactSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: contactSettings, isLoading } = useQuery({
    queryKey: ['contact-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_settings')
        .select('*')
        .maybeSingle();

      if (error) throw error;
      return data as ContactSettings | null;
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (settings: { email: string; phone: string; location: string }) => {
      if (contactSettings?.id) {
        // Update existing record
        const { data, error } = await supabase
          .from('contact_settings')
          .update(settings)
          .eq('id', contactSettings.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Create new record if none exists
        const { data, error } = await supabase
          .from('contact_settings')
          .insert(settings)
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-settings'] });
      toast({
        title: 'Sucesso',
        description: 'Configurações de contato atualizadas com sucesso',
      });
    },
    onError: (error: any) => {
      console.error('Error updating contact settings:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível atualizar as configurações',
      });
    }
  });

  return {
    contactSettings,
    isLoading,
    updateContactSettings: updateMutation.mutate,
    isUpdating: updateMutation.isPending
  };
}
