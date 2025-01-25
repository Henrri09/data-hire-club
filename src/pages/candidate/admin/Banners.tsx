import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleBannerUpload } from "@/components/community/banner/SimpleBannerUpload";
import { BannerList } from "@/components/community/admin/banner/BannerList";
import { CandidateHeader } from "@/components/candidate/Header";
import { CandidateSidebar } from "@/components/candidate/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

    const fetchBanners = async () => {
        const { data } = await supabase
            .from("community_banners")
            .select("*")
            .order("created_at", { ascending: false });

        if (data) {
            setBanners(data);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const handleAddBanner = () => {
        setIsUploadDialogOpen(true);
    };

    const desktopBanners = banners.filter(banner => banner.display === "DESKTOP");
    const mobileBanners = banners.filter(banner => banner.display === "MOBILE");

    console.log(banners);
    console.log(banners);

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col">
            <CandidateHeader />
            <div className="flex flex-1">
                {!isMobile && <CandidateSidebar />}
                <main className="flex-1 p-4 md:p-8">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-2xl font-bold">Gerenciamento de Banners</h1>
                            <div className="flex items-center gap-4">
                                <Button onClick={handleAddBanner}>
                                    Adicionar Banner
                                </Button>
                            </div>
                        </div>

                        <Tabs defaultValue="DESKTOP" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="DESKTOP">Desktop</TabsTrigger>
                                <TabsTrigger value="MOBILE">Mobile</TabsTrigger>
                            </TabsList>

                            <TabsContent value="DESKTOP" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Banners de Apresentação</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <BannerList
                                            banners={desktopBanners.filter((banner) => banner.type === "INTRODUCTION")}
                                            onUpdate={fetchBanners}
                                        />
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Banners de Aprendizado</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <BannerList
                                            banners={desktopBanners.filter((banner) => banner.type === "LEARNING")}
                                            onUpdate={fetchBanners}
                                        />
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Banners de Dúvidas</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <BannerList
                                            banners={desktopBanners.filter((banner) => banner.type === "QUESTIONS")}
                                            onUpdate={fetchBanners}
                                        />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="MOBILE" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Banners de Apresentação</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <BannerList
                                            banners={mobileBanners.filter((banner) => banner.type === "INTRODUCTION")}
                                            onUpdate={fetchBanners}
                                        />
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Banners de Aprendizado</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <BannerList
                                            banners={mobileBanners.filter((banner) => banner.type === "LEARNING")}
                                            onUpdate={fetchBanners}
                                        />
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Banners de Dúvidas</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <BannerList
                                            banners={mobileBanners.filter((banner) => banner.type === "QUESTIONS")}
                                            onUpdate={fetchBanners}
                                        />
                                    </CardContent>
                                </Card>
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