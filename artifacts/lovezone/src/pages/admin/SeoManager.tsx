import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  useListSeoPages, 
  getListSeoPagesQueryKey,
  useCreateSeoPage, 
  useUpdateSeoPage, 
  useDeleteSeoPage,
  SeoPage
} from "@workspace/api-client-react";

const seoPageSchema = z.object({
  keyword: z.string().min(1, "Keyword is required"),
  slug: z.string().min(1, "Slug is required"),
  seoTitle: z.string().min(1, "SEO Title is required"),
  metaDescription: z.string().min(1, "Meta Description is required"),
  h1Heading: z.string().min(1, "H1 Heading is required"),
  content: z.string().min(1, "Content is required"),
  faq: z.string().optional(),
  isActive: z.boolean().default(true),
});

export default function SeoManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: pages, isLoading } = useListSeoPages();
  
  const createPage = useCreateSeoPage();
  const updatePage = useUpdateSeoPage();
  const deletePage = useDeleteSeoPage();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<SeoPage | null>(null);
  
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<SeoPage | null>(null);

  const form = useForm<z.infer<typeof seoPageSchema>>({
    resolver: zodResolver(seoPageSchema),
    defaultValues: {
      keyword: "",
      slug: "",
      seoTitle: "",
      metaDescription: "",
      h1Heading: "",
      content: "",
      faq: "",
      isActive: true,
    },
  });

  const handleOpenModal = (page?: SeoPage) => {
    if (page) {
      setEditingPage(page);
      form.reset({
        keyword: page.keyword,
        slug: page.slug,
        seoTitle: page.seoTitle,
        metaDescription: page.metaDescription,
        h1Heading: page.h1Heading,
        content: page.content,
        faq: page.faq || "",
        isActive: page.isActive ?? true,
      });
    } else {
      setEditingPage(null);
      form.reset({
        keyword: "",
        slug: "",
        seoTitle: "",
        metaDescription: "",
        h1Heading: "",
        content: "",
        faq: "",
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const extractError = (error: unknown): string => {
    if (error && typeof error === "object") {
      const e = error as { data?: { error?: string }; message?: string };
      if (e.data?.error) return e.data.error;
      if (e.message) return e.message;
    }
    return "Failed to save SEO page. Please try again.";
  };

  const onSubmit = async (values: z.infer<typeof seoPageSchema>) => {
    try {
      if (editingPage) {
        await updatePage.mutateAsync({ 
          slug: editingPage.slug, 
          data: values 
        });
        toast({ title: "Success", description: "SEO Page updated successfully" });
      } else {
        await createPage.mutateAsync({ data: values });
        toast({ title: "Success", description: "SEO Page created successfully" });
      }
      queryClient.invalidateQueries({ queryKey: getListSeoPagesQueryKey() });
      setIsModalOpen(false);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: extractError(error) });
    }
  };

  const handleDelete = async () => {
    if (!pageToDelete) return;
    try {
      await deletePage.mutateAsync({ slug: pageToDelete.slug });
      queryClient.invalidateQueries({ queryKey: getListSeoPagesQueryKey() });
      toast({ title: "Success", description: "SEO Page deleted successfully" });
      setDeleteConfirmOpen(false);
      setPageToDelete(null);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete SEO Page" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SEO Manager</h1>
          <p className="text-muted-foreground mt-2">Manage dynamic landing pages for specific keywords.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="font-bold">
          <Plus className="mr-2 h-4 w-4" /> Add Page
        </Button>
      </div>

      <div className="border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Keyword</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>H1 Heading</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">Loading pages...</TableCell>
              </TableRow>
            ) : pages?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No SEO pages found.</TableCell>
              </TableRow>
            ) : (
              pages?.map((page) => (
                <TableRow key={page.id}>
                  <TableCell className="font-medium">{page.keyword}</TableCell>
                  <TableCell>{page.slug}</TableCell>
                  <TableCell className="truncate max-w-[200px]">{page.h1Heading}</TableCell>
                  <TableCell>
                    {page.isActive ? 
                      <Badge variant="outline" className="bg-[#25D366]/10 text-[#25D366] border-[#25D366]/20">Active</Badge> : 
                      <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">Inactive</Badge>
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenModal(page)}>
                      <Edit className="h-4 w-4 text-primary" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => {
                        setPageToDelete(page);
                        setDeleteConfirmOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPage ? "Edit SEO Page" : "Add New SEO Page"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="keyword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Keyword</FormLabel>
                      <FormControl><Input placeholder="e.g. Male Escort Mumbai" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl><Input placeholder="e.g. male-escort-mumbai" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="seoTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SEO Title</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="metaDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Description</FormLabel>
                    <FormControl><Textarea {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="h1Heading"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>H1 Heading</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Page Content</FormLabel>
                    <FormControl><Textarea className="min-h-[150px]" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="faq"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>FAQ JSON (Optional)</FormLabel>
                    <FormControl><Textarea placeholder='[{"q": "Question?", "a": "Answer."}]' {...field} /></FormControl>
                    <p className="text-xs text-muted-foreground">Must be a valid JSON array of {"{q,a}"} pairs.</p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createPage.isPending || updatePage.isPending}>
                  {createPage.isPending || updatePage.isPending ? "Saving..." : "Save Page"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the SEO Page for "{pageToDelete?.keyword}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}