import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Users, Plus, Edit, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  useListListings, 
  getListListingsQueryKey,
  useListStates,
  useListCities,
  useCreateListing, 
  useUpdateListing, 
  useDeleteListing,
  Listing
} from "@workspace/api-client-react";

const listingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  age: z.coerce.number().optional(),
  description: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  stateSlug: z.string().min(1, "State is required"),
  citySlug: z.string().min(1, "City is required"),
  services: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

export default function ManageListings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: listingsPage, isLoading: loadingListings } = useListListings({ limit: 100 });
  const { data: states } = useListStates();
  const { data: allCities } = useListCities();
  
  const createListing = useCreateListing();
  const updateListing = useUpdateListing();
  const deleteListing = useDeleteListing();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState<Listing | null>(null);

  const form = useForm<z.infer<typeof listingSchema>>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      name: "",
      slug: "",
      age: 20,
      description: "",
      phone: "",
      whatsapp: "",
      imageUrl: "",
      stateSlug: "",
      citySlug: "",
      services: "",
      height: "",
      weight: "",
      isActive: true,
      isFeatured: false,
    },
  });

  const selectedStateSlug = form.watch("stateSlug");
  const availableCities = allCities?.filter(c => c.stateSlug === selectedStateSlug) || [];

  const handleOpenModal = (listing?: Listing) => {
    if (listing) {
      setEditingListing(listing);
      form.reset({
        name: listing.name,
        slug: listing.slug,
        age: listing.age || 20,
        description: listing.description || "",
        phone: listing.phone || "",
        whatsapp: listing.whatsapp || "",
        imageUrl: listing.imageUrl || "",
        stateSlug: listing.stateSlug,
        citySlug: listing.citySlug,
        services: listing.services || "",
        height: listing.height || "",
        weight: listing.weight || "",
        isActive: listing.isActive,
        isFeatured: listing.isFeatured,
      });
    } else {
      setEditingListing(null);
      form.reset({
        name: "",
        slug: "",
        age: 20,
        description: "",
        phone: "",
        whatsapp: "",
        imageUrl: "",
        stateSlug: "",
        citySlug: "",
        services: "",
        height: "",
        weight: "",
        isActive: true,
        isFeatured: false,
      });
    }
    setIsModalOpen(true);
  };

  const onSubmit = async (values: z.infer<typeof listingSchema>) => {
    try {
      if (editingListing) {
        await updateListing.mutateAsync({ 
          id: editingListing.id, 
          data: values 
        });
        toast({ title: "Success", description: "Listing updated successfully" });
      } else {
        await createListing.mutateAsync({ data: values });
        toast({ title: "Success", description: "Listing created successfully" });
      }
      queryClient.invalidateQueries({ queryKey: getListListingsQueryKey() });
      setIsModalOpen(false);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to save listing" });
    }
  };

  const handleDelete = async () => {
    if (!listingToDelete) return;
    try {
      await deleteListing.mutateAsync({ id: listingToDelete.id });
      queryClient.invalidateQueries({ queryKey: getListListingsQueryKey() });
      toast({ title: "Success", description: "Listing deleted successfully" });
      setDeleteConfirmOpen(false);
      setListingToDelete(null);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete listing" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Listings</h1>
          <p className="text-muted-foreground mt-2">Add, edit, or remove escort profiles.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="font-bold">
          <Plus className="mr-2 h-4 w-4" /> Add Profile
        </Button>
      </div>

      <div className="border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loadingListings ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">Loading profiles...</TableCell>
              </TableRow>
            ) : listingsPage?.data?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No profiles found.</TableCell>
              </TableRow>
            ) : (
              listingsPage?.data?.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell className="font-medium">{listing.name}</TableCell>
                  <TableCell>{listing.cityName}, {listing.stateName}</TableCell>
                  <TableCell>
                    {listing.isActive ? 
                      <Badge variant="outline" className="bg-[#25D366]/10 text-[#25D366] border-[#25D366]/20">Active</Badge> : 
                      <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">Inactive</Badge>
                    }
                  </TableCell>
                  <TableCell>
                    {listing.isFeatured ? 
                      <Badge className="bg-primary/20 text-primary border-primary/20">Yes</Badge> : 
                      <span className="text-muted-foreground">-</span>
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenModal(listing)}>
                      <Edit className="h-4 w-4 text-primary" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => {
                        setListingToDelete(listing);
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
            <DialogTitle>{editingListing ? "Edit Profile" : "Add New Profile"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
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
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stateSlug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select a state" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {states?.map(state => (
                            <SelectItem key={state.id} value={state.slug}>{state.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="citySlug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value} disabled={!selectedStateSlug}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select a city" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableCities.map(city => (
                            <SelectItem key={city.id} value={city.slug}>{city.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Override Phone</FormLabel>
                      <FormControl><Input placeholder="Optional..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="whatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Override WhatsApp</FormLabel>
                      <FormControl><Input placeholder="Optional..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="services"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Services (comma separated)</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-6 border-t pt-4">
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Active</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Featured</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createListing.isPending || updateListing.isPending}>
                  {createListing.isPending || updateListing.isPending ? "Saving..." : "Save Profile"}
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
              This will permanently delete the profile for "{listingToDelete?.name}".
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