import { useState, useEffect } from "react";
import supabase from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleBannerUpload } from "@/components/community/banner/SimpleBannerUpload";
import { BannerList } from "@/components/community/admin/banner/BannerList";
import { CandidateHeader } from "@/components/candidate/Header";
import { CandidateSidebar } from "@/components/candidate/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

type BannerType = "INTRODUCTION" | "LEARNING" | "QUESTIONS";
type DisplayType = "MOBILE" | "DESKTOP";

interface Banner {
    id: string;
    title: string;
    description: string | null;
    image_url: string;
    link_url: string | null;
    is_active: boolean;
    type: BannerType;
    display: DisplayType;
    created_at: string;
    updated_at: string;
}

interface DatabaseBanner extends Omit<Banner, 'type' | 'display'> {
    type: string;
    display: string;
}

const isBannerType = (type: string): type is BannerType => {
    return ["INTRODUCTION", "LEARNING", "QUESTIONS"].includes(type);
};

const isDisplayType = (display: string): display is DisplayType => {
    return ["MOBILE", "DESKTOP"].includes(display);
};


export function BannersPage() {
    const isMobile = useIsMobile();
    const [banners, setBanners] = useState([]);
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"DESKTOP" | "MOBILE">("DESKTOP");
    const [isTabChanging, setIsTabChanging] = useState(false);

    const fetchBanners = async () => {
        setIsLoading(true);
        const { data } = await supabase
            .from("community_banners")
            .select("*")
            .order("created_at", { ascending: false });

        if (data) {
            setBanners(data);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const handleAddBanner = () => {
        setIsUploadDialogOpen(true);
    };

    const handleTabChange = (value: string) => {
        setIsTabChanging(true);
        setActiveTab(value as "DESKTOP" | "MOBILE");

        // Simula um pequeno delay para dar tempo das imagens carregarem
        setTimeout(() => {
            setIsTabChanging(false);
        }, 300);
    };

    const desktopBanners = banners.filter(banner => banner.display === "DESKTOP");
    const mobileBanners = banners.filter(banner => banner.display === "MOBILE");

    const LoadingSpinner = () => (
        <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
    );

    const BannerSection = ({ title, banners, type }: { title: string, banners: Banner[], type: BannerType }) => (
        <Card>
            <CardHeader className="pb-3 md:pb-6">
                <CardTitle className="text-lg md:text-xl">{title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                {isTabChanging ? (
                    <LoadingSpinner />
                ) : (
                    <BannerList
                        banners={banners.filter((banner) => banner.type === type)}
                        onUpdate={fetchBanners}
                    />
                )}
            </CardContent>
        </Card>
    );

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex flex-col">
                <CandidateHeader />
                <div className="flex flex-1">
                    {!isMobile && <CandidateSidebar />}
                    <main className="flex-1 p-3 md:p-8">
                        <div className="max-w-6xl mx-auto">
                            <LoadingSpinner />
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col">
            <CandidateHeader />
            <div className="flex flex-1">
                {!isMobile && <CandidateSidebar />}
                <main className="flex-1 p-3 md:p-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-3">
                            <h1 className="text-xl md:text-2xl font-bold">Gerenciamento de Banners</h1>
                            <Button
                                onClick={handleAddBanner}
                                className="w-full sm:w-auto"
                                size={isMobile ? "default" : "default"}
                            >
                                Adicionar Banner
                            </Button>
                        </div>

                        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                            <TabsList className={`grid w-full grid-cols-2 mb-4 md:mb-6 ${isMobile ? 'h-12' : ''}`}>
                                <TabsTrigger
                                    value="DESKTOP"
                                    className={isMobile ? 'text-sm' : ''}
                                >
                                    Desktop
                                </TabsTrigger>
                                <TabsTrigger
                                    value="MOBILE"
                                    className={isMobile ? 'text-sm' : ''}
                                >
                                    Mobile
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="DESKTOP" className="space-y-4 md:space-y-6">
                                <BannerSection
                                    title="Banners de Apresentação"
                                    banners={desktopBanners}
                                    type="INTRODUCTION"
                                />
                                <BannerSection
                                    title="Banners de Aprendizado"
                                    banners={desktopBanners}
                                    type="LEARNING"
                                />
                                <BannerSection
                                    title="Banners de Dúvidas"
                                    banners={desktopBanners}
                                    type="QUESTIONS"
                                />
                            </TabsContent>

                            <TabsContent value="MOBILE" className="space-y-4 md:space-y-6">
                                <BannerSection
                                    title="Banners de Apresentação"
                                    banners={mobileBanners}
                                    type="INTRODUCTION"
                                />
                                <BannerSection
                                    title="Banners de Aprendizado"
                                    banners={mobileBanners}
                                    type="LEARNING"
                                />
                                <BannerSection
                                    title="Banners de Dúvidas"
                                    banners={mobileBanners}
                                    type="QUESTIONS"
                                />
                            </TabsContent>
                        </Tabs>

                        <SimpleBannerUpload
                            open={isUploadDialogOpen}
                            onOpenChange={setIsUploadDialogOpen}
                            onSuccess={fetchBanners}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}