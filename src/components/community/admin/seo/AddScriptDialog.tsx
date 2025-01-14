import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AddScriptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddScriptDialog({ open, onOpenChange, onSuccess }: AddScriptDialogProps) {
  const { toast } = useToast();
  const form = useForm({
    defaultValues: {
      name: "",
      script_type: "",
      tracking_id: "",
    },
  });

  const onSubmit = async (values: any) => {
    const { error } = await supabase
      .from("external_scripts")
      .insert([{ ...values, is_active: true }]);

    if (error) {
      toast({
        title: "Erro ao criar script",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Script criado com sucesso",
      });
      form.reset();
      onSuccess();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Script SEO</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: Google Analytics Principal" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="script_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de script" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="GA">Google Analytics 4</SelectItem>
                      <SelectItem value="GTM">Google Tag Manager</SelectItem>
                      <SelectItem value="META_PIXEL">Meta Pixel</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tracking_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID de Rastreamento</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: G-XXXXXXXXXX ou GTM-XXXXXXX" />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">Criar Script</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}