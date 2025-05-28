
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUISettings } from '@/hooks/useUISettings';
import { Image, Upload, Eye } from 'lucide-react';
import { CandidateHeader } from '@/components/candidate/Header';
import { CandidateSidebar } from '@/components/candidate/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

const UISettings = () => {
  const { uiSettings, updateUISettings, uploadImage, isUpdating, isUploading, getSettingByKey } = useUISettings();
  const isMobile = useIsMobile();
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const emptyJobsSetting = getSettingByKey('empty_jobs_image');

  useEffect(() => {
    if (emptyJobsSetting?.image_url) {
      setPreviewUrl(emptyJobsSetting.image_url);
    }
  }, [emptyJobsSetting]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem.');
        return;
      }

      // Validar tamanho (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB.');
        return;
      }

      setSelectedFile(file);
      
      // Criar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadAndSave = async () => {
    if (!selectedFile) return;

    try {
      uploadImage(selectedFile, {
        onSuccess: (imageUrl) => {
          updateUISettings({
            setting_key: 'empty_jobs_image',
            image_url: imageUrl
          });
          setSelectedFile(null);
        }
      });
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc]">
      <CandidateHeader />
      
      <div className="flex flex-1">
        {!isMobile && <CandidateSidebar />}
        
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="w-5 h-5" />
                  Configurações de Interface
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Gerencie as imagens e elementos visuais da plataforma
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">
                      Imagem do Estado Vazio (Nenhuma vaga encontrada)
                    </Label>
                    <p className="text-xs text-gray-500 mb-3">
                      Esta imagem será exibida quando não houver vagas disponíveis
                    </p>
                  </div>

                  {/* Preview da imagem atual/selecionada */}
                  {previewUrl && (
                    <div className="space-y-2">
                      <Label className="text-sm text-gray-600 flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        Preview
                      </Label>
                      <div className="border-2 border-dashed border-gray-200 rounded-lg p-4">
                        <img 
                          src={previewUrl} 
                          alt="Preview da imagem" 
                          className="w-full max-w-xs mx-auto rounded-lg shadow-sm"
                        />
                      </div>
                    </div>
                  )}

                  {/* Input de arquivo */}
                  <div className="space-y-2">
                    <Label htmlFor="image-upload" className="text-sm font-medium">
                      Selecionar nova imagem
                    </Label>
                    <div className="flex items-center gap-2">
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('image-upload')?.click()}
                        className="flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Escolher arquivo
                      </Button>
                      {selectedFile && (
                        <span className="text-sm text-gray-600">
                          {selectedFile.name}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 5MB
                    </p>
                  </div>

                  {/* Botão de salvar */}
                  <Button 
                    onClick={handleUploadAndSave}
                    disabled={!selectedFile || isUploading || isUpdating}
                    className="w-full"
                  >
                    {isUploading ? 'Fazendo upload...' : isUpdating ? 'Salvando...' : 'Salvar imagem'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UISettings;
