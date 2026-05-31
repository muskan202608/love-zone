import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  useListCities,
  getListCitiesQueryKey,
  useListStates,
  useCreateCity,
  useUpdateCity,
  useDeleteCity,
  City
} from "@workspace/api-client-react";

const PAGE_SIZE = 50;

const citySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  stateSlug: z.string().min(1, "State is required"),
  description: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export default function ManageCities() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState<string | undefined>(undefined);
  const [offset, setOffset] = useState(0);

  const { data: citiesPage, isLoading: loadingCities } = useListCities({
    search: search || undefined,
    stateSlug: stateFilter || undefined,
    limit: PAGE_SIZE,
    offset,
  });
  const { data: states } = useListStates();

  const createCity = useCreateCity();
  const updateCity = useUpdateCity();
  const deleteCity = useDeleteCity();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [cityToDelete, setCityToDelete] = useState<City | null>(null);

  const cities = citiesPage?.data ?? [];
  const total = citiesPage?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;

  const form = useForm<z.infer<typeof citySchema>>({
    resolver: zodResolver(citySchema),
    defaultValues: { name: "", slug: "", stateSlug: "", description: "", metaTitle: "", metaDescription: "" },
  });

  const handleSearch = useCallback(() => {
    setSearch(searchInput);
    setOffset(0);
  }, [searchInput]);

  const handleStateFilter = (val: string) => {
    setStateFilter(val === "all" ? undefined : val);
    setOffset(0);
  };

  const handleOpenModal = (city?: City) => {
    if (city) {
      setEditingCity(city);
      form.reset({
        name: city.name, slug: city.slug, stateSlug: city.stateSlug,
        description: city.description || "", metaTitle: city.metaTitle || "",
        metaDescription: city.metaDescription || "",
      });
    } else {
      setEditingCity(null);
      form.reset({ name: "", slug: "", stateSlug: "", description: "", metaTitle: "", metaDescription: "" });
    }
    setIsModalOpen(true);
  };

  const onSubmit = async (values: z.infer<typeof citySchema>) => {
    try {
      if (editingCity) {
        await updateCity.mutateAsync({ slug: editingCity.slug, data: values });
        toast({ title: "Success", description: "City updated successfully" });
      } else {
        await createCity.mutateAsync({ data: values });
        toast({ title: "Success", description: "City created successfully" });
      }
      queryClient.invalidateQueries({ queryKey: getListCitiesQueryKey() });
      setIsModalOpen(false);
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Failed to save city" });
    }
  };

  const handleDelete = async () => {
    if (!cityToDelete) return;
    try {
      await deleteCity.mutateAsync({ slug: cityToDelete.slug });
      queryClient.invalidateQueries({ queryKey: getListCitiesQueryKey() });
      toast({ title: "Success", description: "City deleted successfully" });
      setDeleteConfirmOpen(false);
      setCityToDelete(null);
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete city" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Cities</h1>
          <p className="text-muted-foreground mt-2">
            {total > 0 ? <><span className="font-semibold text-foreground">{total.toLocaleString()}</span> cities in database</> : "Add, edit, or remove cities."}
          </p>
        </div>
        <Button onClick={() => handleOpenModal()} className="font-bold">
          <Plus className="mr-2 h-4 w-4" /> Add City
        </Button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="flex gap-2 flex-1 min-w-[200px]">
          <Input
            placeholder="Search cities..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="max-w-xs"
          />
          <Button variant="outline" size="icon" onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <Select onValueChange={handleStateFilter} defaultValue="all">
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by state" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All States</SelectItem>
            {states?.map(s => <SelectItem key={s.id} value={s.slug}>{s.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Listings</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loadingCities ? (
              <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">Loading cities...</TableCell></TableRow>
            ) : cities.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No cities found.</TableCell></TableRow>
            ) : (
              cities.map((city) => (
                <TableRow key={city.id}>
                  <TableCell className="font-medium">{city.name}</TableCell>
                  <TableCell className="text-muted-foreground">{city.stateName}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{city.slug}</TableCell>
                  <TableCell>
                    {city.listingCount > 0
                      ? <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">{city.listingCount}</Badge>
                      : <span className="text-muted-foreground text-sm">0</span>}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenModal(city)}>
                      <Edit className="h-4 w-4 text-primary" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => { setCityToDelete(city); setDeleteConfirmOpen(true); }}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {total > PAGE_SIZE && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages} · {total.toLocaleString()} total cities
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <Button variant="outline" size="sm" disabled={offset + PAGE_SIZE >= total} onClick={() => setOffset(offset + PAGE_SIZE)}>
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingCity ? "Edit City" : "Add New City"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Name</FormLabel><FormControl><Input placeholder="e.g. Mumbai" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="slug" render={({ field }) => (
                <FormItem><FormLabel>Slug</FormLabel><FormControl><Input placeholder="e.g. mumbai" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="stateSlug" render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select a state" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {states?.map(state => <SelectItem key={state.id} value={state.slug}>{state.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Description</FormLabel><FormControl><Input placeholder="Brief description..." {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="pt-4 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createCity.isPending || updateCity.isPending}>
                  {createCity.isPending || updateCity.isPending ? "Saving..." : "Save City"}
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
            <AlertDialogDescription>This will permanently delete the city "{cityToDelete?.name}".</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
