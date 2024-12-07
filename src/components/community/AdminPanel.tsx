import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { PlusCircle } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Banner {
  id: string
  title: string
  description?: string
  image_url?: string
  link_url?: string
  is_active: boolean
}

interface Rule {
  id: string
  content: string
  is_active: boolean
}

interface ExternalLink {
  id: string
  title: string
  url: string
  description?: string
  is_active: boolean
  order_index: number
}

export function AdminPanel() {
  const { toast } = useToast()
  const [banners, setBanners] = useState<Banner[]>([])
  const [rules, setRules] = useState<Rule[]>([])
  const [links, setLinks] = useState<ExternalLink[]>([])
  const [isAddingBanner, setIsAddingBanner] = useState(false)
  const [isAddingRule, setIsAddingRule] = useState(false)
  const [isAddingLink, setIsAddingLink] = useState(false)

  const bannerForm = useForm({
    defaultValues: {
      title: "",
      description: "",
      image_url: "",
      link_url: "",
    },
  })

  const ruleForm = useForm({
    defaultValues: {
      content: "",
    },
  })

  const linkForm = useForm({
    defaultValues: {
      title: "",
      url: "",
      description: "",
      order_index: 0,
    },
  })

  const fetchData = async () => {
    const { data: bannersData } = await supabase
      .from("community_banners")
      .select("*")
      .order("created_at", { ascending: false })
    
    const { data: rulesData } = await supabase
      .from("community_pinned_rules")
      .select("*")
      .order("created_at", { ascending: false })
    
    const { data: linksData } = await supabase
      .from("community_external_links")
      .select("*")
      .order("order_index", { ascending: true })

    if (bannersData) setBanners(bannersData)
    if (rulesData) setRules(rulesData)
    if (linksData) setLinks(linksData)
  }

  const onSubmitBanner = async (values: any) => {
    const { error } = await supabase
      .from("community_banners")
      .insert([{ ...values, is_active: true }])

    if (error) {
      toast({
        title: "Erro ao criar banner",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Banner criado com sucesso",
      })
      setIsAddingBanner(false)
      bannerForm.reset()
      fetchData()
    }
  }

  const onSubmitRule = async (values: any) => {
    const { error } = await supabase
      .from("community_pinned_rules")
      .insert([{ ...values, is_active: true }])

    if (error) {
      toast({
        title: "Erro ao criar regra",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Regra criada com sucesso",
      })
      setIsAddingRule(false)
      ruleForm.reset()
      fetchData()
    }
  }

  const onSubmitLink = async (values: any) => {
    const { error } = await supabase
      .from("community_external_links")
      .insert([{ ...values, is_active: true }])

    if (error) {
      toast({
        title: "Erro ao criar link",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Link criado com sucesso",
      })
      setIsAddingLink(false)
      linkForm.reset()
      fetchData()
    }
  }

  const toggleBannerStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("community_banners")
      .update({ is_active: !currentStatus })
      .eq("id", id)

    if (error) {
      toast({
        title: "Erro ao atualizar banner",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Banner atualizado com sucesso",
      })
      fetchData()
    }
  }

  const toggleRuleStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("community_pinned_rules")
      .update({ is_active: !currentStatus })
      .eq("id", id)

    if (error) {
      toast({
        title: "Erro ao atualizar regra",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Regra atualizada com sucesso",
      })
      fetchData()
    }
  }

  const toggleLinkStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("community_external_links")
      .update({ is_active: !currentStatus })
      .eq("id", id)

    if (error) {
      toast({
        title: "Erro ao atualizar link",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Link atualizado com sucesso",
      })
      fetchData()
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Banners</h2>
          <Dialog open={isAddingBanner} onOpenChange={setIsAddingBanner}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="w-4 h-4 mr-2" />
                Novo Banner
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Banner</DialogTitle>
                <DialogDescription>
                  Adicione um novo banner para exibir na comunidade
                </DialogDescription>
              </DialogHeader>
              <Form {...bannerForm}>
                <form onSubmit={bannerForm.handleSubmit(onSubmitBanner)} className="space-y-4">
                  <FormField
                    control={bannerForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={bannerForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={bannerForm.control}
                    name="image_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL da Imagem</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={bannerForm.control}
                    name="link_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL do Link</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Criar Banner</Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {banners.map((banner) => (
              <TableRow key={banner.id}>
                <TableCell>{banner.title}</TableCell>
                <TableCell>{banner.is_active ? "Ativo" : "Inativo"}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    onClick={() => toggleBannerStatus(banner.id, banner.is_active)}
                  >
                    {banner.is_active ? "Desativar" : "Ativar"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Regras</h2>
          <Dialog open={isAddingRule} onOpenChange={setIsAddingRule}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="w-4 h-4 mr-2" />
                Nova Regra
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Regra</DialogTitle>
                <DialogDescription>
                  Adicione uma nova regra para a comunidade
                </DialogDescription>
              </DialogHeader>
              <Form {...ruleForm}>
                <form onSubmit={ruleForm.handleSubmit(onSubmitRule)} className="space-y-4">
                  <FormField
                    control={ruleForm.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Conteúdo</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Criar Regra</Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Conteúdo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules.map((rule) => (
              <TableRow key={rule.id}>
                <TableCell>{rule.content}</TableCell>
                <TableCell>{rule.is_active ? "Ativo" : "Inativo"}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    onClick={() => toggleRuleStatus(rule.id, rule.is_active)}
                  >
                    {rule.is_active ? "Desativar" : "Ativar"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Links Externos</h2>
          <Dialog open={isAddingLink} onOpenChange={setIsAddingLink}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="w-4 h-4 mr-2" />
                Novo Link
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Link</DialogTitle>
                <DialogDescription>
                  Adicione um novo link externo para a comunidade
                </DialogDescription>
              </DialogHeader>
              <Form {...linkForm}>
                <form onSubmit={linkForm.handleSubmit(onSubmitLink)} className="space-y-4">
                  <FormField
                    control={linkForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={linkForm.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={linkForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={linkForm.control}
                    name="order_index"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ordem</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Criar Link</Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Ordem</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {links.map((link) => (
              <TableRow key={link.id}>
                <TableCell>{link.title}</TableCell>
                <TableCell>{link.url}</TableCell>
                <TableCell>{link.order_index}</TableCell>
                <TableCell>{link.is_active ? "Ativo" : "Inativo"}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    onClick={() => toggleLinkStatus(link.id, link.is_active)}
                  >
                    {link.is_active ? "Desativar" : "Ativar"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}