import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Map, Plus, Edit, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  useListStates, 
  getListStatesQueryKey,
  useCreateState, 
  useUpdateState, 
  useDeleteState,
  State
} from "@workspace/api-client-react";

const stateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export default function ManageStates() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: states, isLoading } = useListStates();
  
  const createState = useCreateState();
  const updateState = useUpdateState();
  const deleteState = useDeleteState();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingState, setEditingState] = useState<State | null>(null);
  
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [stateToDelete, setStateToDelete] = useState<State | null>(null);

  const form = useForm<z.infer<typeof stateSchema>>({
    resolver: zodResolver(stateSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      metaTitle: "",
      metaDescription: "",
    },
  });

  const handleOpenModal = (state?: State) => {
    if (state) {
      setEditingState(state);
      form.reset({
        name: state.name,
        slug: state.slug,
        description: state.description || "",
        metaTitle: state.metaTitle || "",
        metaDescription: state.metaDescription || "",
      });
    } else {
      setEditingState(null);
      form.reset({
        name: "",
        slug: "",
        description: "",
        metaTitle: "",
        metaDescription: "",
      });
    }
    setIsModalOpen(true);
  };

  const onSubmit = async (values: z.infer<typeof stateSchema>) => {
    try {
      if (editingState) {
        await updateState.mutateAsync({ 
          slug: editingState.slug, 
          data: values 
        });
        toast({ title: "Success", description: "State updated successfully" });
      } else {
        await createState.mutateAsync({ data: values });
        toast({ title: "Success", description: "State created successfully" });
      }
      queryClient.invalidateQueries({ queryKey: getListStatesQueryKey() });
      setIsModalOpen(false);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to save state" });
    }
  };

  const handleDelete = async () => {
    if (!stateToDelete) return;
    try {
      await deleteState.mutateAsync({ slug: stateToDelete.slug });
      queryClient.invalidateQueries({ queryKey: getListStatesQueryKey() });
      toast({ title: "Success", description: "State deleted successfully" });
      setDeleteConfirmOpen(false);
      setStateToDelete(null);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete state" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage States</h1>
          <p className="text-muted-foreground mt-2">Add, edit, or remove states from the directory.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="font-bold">
          <Plus className="mr-2 h-4 w-4" /> Add State
        </Button>
      </div>

      <div className="border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Listings</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">Loading states...</TableCell>
              </TableRow>
            ) : states?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">No states found.</TableCell>
              </TableRow>
            ) : (
              states?.map((state) => (
                <TableRow key={state.id}>
                  <TableCell className="font-medium">{state.name}</TableCell>
                  <TableCell>{state.slug}</TableCell>
                  <TableCell>{state.listingCount}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenModal(state)}>
                      <Edit className="h-4 w-4 text-primary" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => {
                        setStateToDelete(state);
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingState ? "Edit State" : "Add New State"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Maharashtra" {...field} />
                    </FormControl>
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
                    <FormControl>
                      <Input placeholder="e.g. maharashtra" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Brief description..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-4 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createState.isPending || updateState.isPending}>
                  {createState.isPending || updateState.isPending ? "Saving..." : "Save State"}
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
              This will permanently delete the state "{stateToDelete?.name}".
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