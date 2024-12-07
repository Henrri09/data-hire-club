import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { CommunityBanner } from "@/components/community/CommunityBanner"
import { AdminPanel } from "@/components/community/AdminPanel"

export default function Questions() {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single()
        
        setIsAdmin(profile?.is_admin || false)
      }
    }

    checkAdminStatus()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <CommunityBanner />
      {isAdmin && (
        <div className="mt-8">
          <AdminPanel />
        </div>
      )}
    </div>
  )
}