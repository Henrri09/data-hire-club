import { Upload } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import supabase from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type BannerType = "INTRODUCTION" | "LEARNING" | "QUESTIONS"

interface UploadImageProps {
    type: BannerType
}

export function UploadImage({ type }: UploadImageProps) {
    const [isUploadingBanner, setIsUploadingBanner] = useState(false)

    const { toast } = useToast()

    const handleBannerUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        try {
            setIsUploadingBanner(true)

            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("Usuário não autenticado")

            // Upload to Storage
            const fileExt = file.name.split('.').pop()
            const fileName = `${crypto.randomUUID()}.${fileExt}`

            const { error: uploadError } = await supabase.storage
                .from('banners')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase
                .storage
                .from('banners')
                .getPublicUrl(fileName)

            // Desativar banners anteriores
            await supabase
                .from('community_banners')
                .update({ is_active: false })
                .eq('is_active', true)
                .eq('type', type)

            // Criar novo banner
            const { error: insertError } = await supabase
                .from('community_banners')
                .insert([{
                    image_url: publicUrl,
                    is_active: true,
                    created_by: user.id,
                    type: type
                }])

            if (insertError) throw insertError

            toast({
                title: "Banner atualizado",
                description: "O banner foi atualizado com sucesso!"
            })

        } catch (error) {
            console.error('Error uploading banner:', error)
            toast({
                title: "Erro ao fazer upload",
                description: "Ocorreu um erro ao fazer upload do banner.",
                variant: "destructive",
            })
        } finally {
            setIsUploadingBanner(false)
        }
    }

    return (<div className="relative">
        <Button
            variant="outline"
            className="w-full h-24 relative bg-background"
            disabled={isUploadingBanner}
        >
            <Upload className="h-6 w-6 text-muted-foreground absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            <input
                type="file"
                onChange={handleBannerUpload}
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                disabled={isUploadingBanner}
            />
        </Button>
        {isUploadingBanner && (
            <p className="text-sm text-muted-foreground mt-2 text-center">
                Fazendo upload...
            </p>
        )}
    </div>)
}