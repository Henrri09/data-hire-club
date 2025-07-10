import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

interface AdBanner {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  is_active: boolean;
}

export function HomeAdBanner() {
  const [banner, setBanner] = useState<AdBanner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchAdBanner();
  }, [isMobile]);

  const fetchAdBanner = async () => {
    setIsLoading(true);
    
    const { data } = await supabase
      .from("community_banners")
      .select("*")
      .eq("type", "HOME_ADS")
      .eq("display", isMobile ? "MOBILE" : "DESKTOP")
      .eq("is_active", true)
      .limit(1)
      .single();

    if (data) {
      setBanner(data);
    }
    setIsLoading(false);
  };

  const handleBannerClick = () => {
    if (banner?.link_url) {
      window.open(banner.link_url, '_blank');
    }
  };

  if (isLoading || !banner?.image_url) {
    return null;
  }

  return (
    <div className="w-full py-4">
      <div className="container px-4 md:px-8">
        <div className="flex justify-center">
          <div 
            className={`
              relative overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200
              ${isMobile 
                ? 'w-full max-w-[320px] h-[100px]' 
                : 'w-full max-w-[728px] h-[90px] md:max-w-[970px] md:h-[250px]'
              }
              ${banner.link_url ? 'cursor-pointer' : ''}
            `}
            onClick={handleBannerClick}
          >
            <img
              src={banner.image_url}
              alt={banner.title || "Advertisement"}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            
            {/* Overlay for better text visibility if title/description exists */}
            {(banner.title || banner.description) && (
              <div className="absolute inset-0 bg-black/20 flex flex-col justify-end p-3">
                {banner.title && (
                  <h3 className="text-white font-semibold text-sm md:text-base">
                    {banner.title}
                  </h3>
                )}
                {banner.description && (
                  <p className="text-white/90 text-xs md:text-sm">
                    {banner.description}
                  </p>
                )}
              </div>
            )}

            {/* "Publicidade" label */}
            <div className="absolute top-1 right-1">
              <span className="bg-black/50 text-white text-xs px-2 py-1 rounded">
                Publicidade
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}