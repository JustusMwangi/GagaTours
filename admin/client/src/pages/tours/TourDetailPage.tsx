import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Plus, Trash2, Image } from 'lucide-react';
import { toast } from 'sonner';

import { usePermissions, Permissions } from '@/hooks/usePermissions';
import { PageHeader } from '@/components/shared/PageHeader';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/multi-select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  useGetTourQuery,
  useUpdateTourMutation,
  useListCategoriesQuery,
  useListDestinationsQuery,
  useListTourDatesQuery,
  useCreateTourDateMutation,
  useDeleteTourDateMutation,
  useListGalleryQuery,
  useAddGalleryItemMutation,
  useDeleteGalleryItemMutation,
} from '@/services/tours/toursApi';
import { ImageUpload } from '@/components/shared/ImageUpload';
import { formatDate, getApiErrorMessage } from '@/lib/utils';
import type { UpdateTourRequest, TourDate, TourGalleryItem } from '@/types/tour';

export default function TourDetailPage() {
  const { tourId } = useParams<{ tourId: string }>();
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const canManage = hasPermission(Permissions.TOURS_MANAGE);

  // ---- Tour data ----
  const { data: tour, isLoading: isLoadingTour } = useGetTourQuery(tourId!, { skip: !tourId });
  const [updateTour, { isLoading: isUpdating }] = useUpdateTourMutation();
  const { data: categoriesData } = useListCategoriesQuery();
  const { data: destinationsData } = useListDestinationsQuery();

  // ---- Dates ----
  const { data: tourDates } = useListTourDatesQuery(tourId!, { skip: !tourId });
  const [createTourDate, { isLoading: isCreatingDate }] = useCreateTourDateMutation();
  const [deleteTourDate, { isLoading: isDeletingDate }] = useDeleteTourDateMutation();

  // ---- Gallery ----
  const { data: galleryItems } = useListGalleryQuery(tourId!, { skip: !tourId });
  const [addGalleryItem, { isLoading: isAddingImage }] = useAddGalleryItemMutation();
  const [deleteGalleryItem, { isLoading: isDeletingImage }] = useDeleteGalleryItemMutation();

  // ---- Details form state ----
  const [detailsForm, setDetailsForm] = useState<UpdateTourRequest | null>(null);

  // Initialise form from tour data when it loads
  const form: UpdateTourRequest = detailsForm ?? {
    title: tour?.title ?? '',
    short_description: tour?.short_description ?? '',
    description: tour?.description ?? '',
    category_ids: tour?.categories?.map((c) => c.id) ?? [],
    destination_ids: tour?.destinations?.map((d) => d.id) ?? [],
    price: tour?.price ?? undefined,
    currency: tour?.currency ?? 'USD',
    duration_days: tour?.duration_days ?? undefined,
    duration_nights: tour?.duration_nights ?? undefined,
    max_group_size: tour?.max_group_size ?? undefined,
    difficulty_level: tour?.difficulty_level ?? undefined,
    included: tour?.included ?? '',
    excluded: tour?.excluded ?? '',
    itinerary: tour?.itinerary ?? '',
    status: tour?.status ?? 'draft',
    featured: tour?.featured ?? false,
    image_url: tour?.image_url ?? undefined,
    meta_title: tour?.meta_title ?? '',
    meta_description: tour?.meta_description ?? '',
    youtube_url: tour?.youtube_url ?? '',
  };

  const updateField = <K extends keyof UpdateTourRequest>(key: K, value: UpdateTourRequest[K]) => {
    setDetailsForm((prev) => ({ ...form, ...prev, [key]: value }));
  };

  const handleSaveDetails = async () => {
    if (!tourId) return;
    try {
      await updateTour({ id: tourId, data: form }).unwrap();
      toast.success('Tour updated successfully');
      setDetailsForm(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to update tour'));
    }
  };

  // ---- Date dialog ----
  const [dateDialogOpen, setDateDialogOpen] = useState(false);
  const [dateForm, setDateForm] = useState({
    start_date: '',
    end_date: '',
    price_override: '',
    max_spots: '',
    status: 'available',
  });
  const [deleteDate, setDeleteDate] = useState<TourDate | null>(null);

  const handleAddDate = async () => {
    if (!tourId || !dateForm.start_date || !dateForm.end_date) {
      toast.error('Start date and end date are required');
      return;
    }
    try {
      await createTourDate({
        tourId,
        data: {
          start_date: dateForm.start_date,
          end_date: dateForm.end_date,
          price_override: dateForm.price_override ? Number(dateForm.price_override) : undefined,
          max_spots: dateForm.max_spots ? Number(dateForm.max_spots) : undefined,
          status: dateForm.status,
        },
      }).unwrap();
      toast.success('Tour date added');
      setDateDialogOpen(false);
      setDateForm({ start_date: '', end_date: '', price_override: '', max_spots: '', status: 'available' });
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to add tour date'));
    }
  };

  const handleDeleteDate = async () => {
    if (!tourId || !deleteDate) return;
    try {
      await deleteTourDate({ tourId, dateId: deleteDate.id }).unwrap();
      toast.success('Tour date deleted');
      setDeleteDate(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to delete tour date'));
    }
  };

  // ---- Gallery dialog ----
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageForm, setImageForm] = useState({
    image_url: '',
    caption: '',
    sort_order: '0',
  });
  const [deleteImage, setDeleteImage] = useState<TourGalleryItem | null>(null);

  const handleAddImage = async () => {
    if (!tourId || !imageForm.image_url.trim()) {
      toast.error('Image URL is required');
      return;
    }
    try {
      await addGalleryItem({
        tourId,
        data: {
          image_url: imageForm.image_url,
          caption: imageForm.caption || undefined,
          sort_order: imageForm.sort_order ? Number(imageForm.sort_order) : undefined,
        },
      }).unwrap();
      toast.success('Image added to gallery');
      setImageDialogOpen(false);
      setImageForm({ image_url: '', caption: '', sort_order: '0' });
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to add image'));
    }
  };

  const handleDeleteImage = async () => {
    if (!tourId || !deleteImage) return;
    try {
      await deleteGalleryItem({ tourId, imageId: deleteImage.id }).unwrap();
      toast.success('Image removed from gallery');
      setDeleteImage(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to remove image'));
    }
  };

  // ---- Permission gate ----
  if (!hasPermission(Permissions.TOURS_VIEW)) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">You do not have permission to view this tour.</p>
      </div>
    );
  }

  if (isLoadingTour) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Tour not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/tours')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader
          title={tour.title}
          description={tour.short_description ?? undefined}
        />
        <StatusBadge status={tour.status} className="ml-auto" />
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="dates">Dates</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
        </TabsList>

        {/* ========== DETAILS TAB ========== */}
        <TabsContent value="details" className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="detail-title">Title</Label>
                <Input
                  id="detail-title"
                  value={form.title ?? ''}
                  onChange={(e) => updateField('title', e.target.value)}
                  disabled={!canManage}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="detail-short-desc">One-line summary (max 500 characters)</Label>
                <Input
                  id="detail-short-desc"
                  value={form.short_description ?? ''}
                  onChange={(e) => updateField('short_description', e.target.value)}
                  disabled={!canManage}
                  placeholder="One sentence shown on tour cards. Full details go in Description below."
                />
              </div>
              {canManage ? (
                <div className="space-y-2">
                  <Label>Featured Image</Label>
                  <ImageUpload
                    value={form.image_url}
                    onChange={(url) => updateField('image_url', url)}
                    placeholder="Upload tour image"
                  />
                </div>
              ) : form.image_url ? (
                <div className="space-y-2">
                  <Label>Featured Image</Label>
                  <img src={form.image_url} alt="Tour" className="h-32 w-48 rounded-md border object-cover" />
                </div>
              ) : null}
              <div className="space-y-2">
                <Label htmlFor="detail-desc">Description</Label>
                <Textarea
                  id="detail-desc"
                  value={form.description ?? ''}
                  onChange={(e) => updateField('description', e.target.value)}
                  disabled={!canManage}
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>

          {/* Classification */}
          <Card>
            <CardHeader>
              <CardTitle>Classification</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Categories</Label>
                <MultiSelect
                  options={(categoriesData?.categories ?? []).map((cat) => ({ value: cat.id, label: cat.name }))}
                  value={form.category_ids ?? []}
                  onChange={(vals) => updateField('category_ids', vals)}
                  placeholder="Select categories"
                  searchPlaceholder="Search categories…"
                  disabled={!canManage}
                />
              </div>
              <div className="space-y-2">
                <Label>Destinations</Label>
                <MultiSelect
                  options={(destinationsData?.destinations ?? []).map((dest) => ({ value: dest.id, label: dest.name }))}
                  value={form.destination_ids ?? []}
                  onChange={(vals) => updateField('destination_ids', vals)}
                  placeholder="Select destinations"
                  searchPlaceholder="Search destinations…"
                  disabled={!canManage}
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Duration */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Duration</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="detail-price">Price</Label>
                <Input
                  id="detail-price"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.price ?? ''}
                  onChange={(e) => updateField('price', e.target.value ? Number(e.target.value) : undefined)}
                  disabled={!canManage}
                />
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select
                  value={form.currency ?? 'USD'}
                  onValueChange={(val) => updateField('currency', val)}
                  disabled={!canManage}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="KES">KES</SelectItem>
                    <SelectItem value="TZS">TZS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="detail-days">Duration (Days)</Label>
                <Input
                  id="detail-days"
                  type="number"
                  min={1}
                  value={form.duration_days ?? ''}
                  onChange={(e) => updateField('duration_days', e.target.value ? Number(e.target.value) : undefined)}
                  disabled={!canManage}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="detail-nights">Duration (Nights)</Label>
                <Input
                  id="detail-nights"
                  type="number"
                  min={0}
                  value={form.duration_nights ?? ''}
                  onChange={(e) => updateField('duration_nights', e.target.value ? Number(e.target.value) : undefined)}
                  disabled={!canManage}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="detail-group">Max Group Size</Label>
                <Input
                  id="detail-group"
                  type="number"
                  min={1}
                  value={form.max_group_size ?? ''}
                  onChange={(e) => updateField('max_group_size', e.target.value ? Number(e.target.value) : undefined)}
                  disabled={!canManage}
                />
              </div>
              <div className="space-y-2">
                <Label>Difficulty Level</Label>
                <Select
                  value={form.difficulty_level ?? ''}
                  onValueChange={(val) => updateField('difficulty_level', val || undefined)}
                  disabled={!canManage}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="challenging">Challenging</SelectItem>
                    <SelectItem value="difficult">Difficult</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="detail-included">Included</Label>
                <Textarea
                  id="detail-included"
                  value={form.included ?? ''}
                  onChange={(e) => updateField('included', e.target.value)}
                  disabled={!canManage}
                  rows={4}
                  placeholder="What's included in the tour..."
                />
                <p className="text-xs text-muted-foreground">
                  Put each item on its own line. Each shows a green tick (✓) on the public tour page — no dashes needed.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="detail-excluded">Excluded</Label>
                <Textarea
                  id="detail-excluded"
                  value={form.excluded ?? ''}
                  onChange={(e) => updateField('excluded', e.target.value)}
                  disabled={!canManage}
                  rows={4}
                  placeholder="What's not included..."
                />
                <p className="text-xs text-muted-foreground">
                  Put each item on its own line. Each shows a red cross (✗) on the public tour page — no dashes needed.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="detail-itinerary">Itinerary</Label>
                <Textarea
                  id="detail-itinerary"
                  value={form.itinerary ?? ''}
                  onChange={(e) => updateField('itinerary', e.target.value)}
                  disabled={!canManage}
                  rows={6}
                  placeholder="Day-by-day itinerary..."
                />
                <p className="text-xs text-muted-foreground">
                  Tip: start each day with <code>Day 1:</code>, <code>Day 2:</code>… to render as a timeline on the public tour page.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="detail-youtube">YouTube Video URL</Label>
                <Input
                  id="detail-youtube"
                  type="url"
                  value={form.youtube_url ?? ''}
                  onChange={(e) => updateField('youtube_url', e.target.value)}
                  disabled={!canManage}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <p className="text-xs text-muted-foreground">
                  Optional. Paste a full YouTube watch URL; it will be embedded on the tour page.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={form.status ?? 'draft'}
                  onValueChange={(val) => updateField('status', val)}
                  disabled={!canManage}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  id="detail-featured"
                  checked={form.featured ?? false}
                  onCheckedChange={(checked) => updateField('featured', checked)}
                  disabled={!canManage}
                />
                <Label htmlFor="detail-featured">Featured Tour</Label>
              </div>
            </CardContent>
          </Card>

          {/* SEO */}
          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="detail-meta-title">Meta Title</Label>
                <Input
                  id="detail-meta-title"
                  value={form.meta_title ?? ''}
                  onChange={(e) => updateField('meta_title', e.target.value)}
                  disabled={!canManage}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="detail-meta-desc">Meta Description</Label>
                <Textarea
                  id="detail-meta-desc"
                  value={form.meta_description ?? ''}
                  onChange={(e) => updateField('meta_description', e.target.value)}
                  disabled={!canManage}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {canManage && (
            <div className="flex justify-end">
              <Button onClick={handleSaveDetails} disabled={isUpdating}>
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </TabsContent>

        {/* ========== DATES TAB ========== */}
        <TabsContent value="dates" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Tour Dates</CardTitle>
                {canManage && (
                  <Button size="sm" onClick={() => setDateDialogOpen(true)}>
                    <Plus className="h-4 w-4" />
                    Add Date
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {!tourDates || tourDates.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  No dates scheduled for this tour.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Price Override</TableHead>
                      <TableHead>Max Spots</TableHead>
                      <TableHead>Booked</TableHead>
                      <TableHead>Status</TableHead>
                      {canManage && <TableHead className="w-[50px]" />}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tourDates.map((td) => (
                      <TableRow key={td.id}>
                        <TableCell>{formatDate(td.start_date)}</TableCell>
                        <TableCell>{formatDate(td.end_date)}</TableCell>
                        <TableCell>
                          {td.price_override != null ? `$${td.price_override.toLocaleString()}` : '\u2014'}
                        </TableCell>
                        <TableCell>{td.max_spots ?? '\u2014'}</TableCell>
                        <TableCell>{td.spots_booked}</TableCell>
                        <TableCell>
                          <StatusBadge status={td.status} />
                        </TableCell>
                        {canManage && (
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => setDeleteDate(td)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                              <span className="sr-only">Delete date</span>
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Add Date Dialog */}
          <Dialog open={dateDialogOpen} onOpenChange={setDateDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Tour Date</DialogTitle>
                <DialogDescription>
                  Schedule a new date for this tour.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date-start">Start Date</Label>
                    <Input
                      id="date-start"
                      type="date"
                      value={dateForm.start_date}
                      onChange={(e) => setDateForm((p) => ({ ...p, start_date: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date-end">End Date</Label>
                    <Input
                      id="date-end"
                      type="date"
                      value={dateForm.end_date}
                      onChange={(e) => setDateForm((p) => ({ ...p, end_date: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date-price">Price Override</Label>
                    <Input
                      id="date-price"
                      type="number"
                      min={0}
                      step="0.01"
                      value={dateForm.price_override}
                      onChange={(e) => setDateForm((p) => ({ ...p, price_override: e.target.value }))}
                      placeholder="Leave blank for default"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date-spots">Max Spots</Label>
                    <Input
                      id="date-spots"
                      type="number"
                      min={1}
                      value={dateForm.max_spots}
                      onChange={(e) => setDateForm((p) => ({ ...p, max_spots: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={dateForm.status}
                    onValueChange={(val) => setDateForm((p) => ({ ...p, status: val }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="full">Full</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddDate} disabled={isCreatingDate}>
                  {isCreatingDate ? 'Adding...' : 'Add Date'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Date Confirmation */}
          <ConfirmDialog
            open={!!deleteDate}
            onOpenChange={(open) => !open && setDeleteDate(null)}
            title="Delete Tour Date"
            description={`Are you sure you want to delete the date starting ${formatDate(deleteDate?.start_date)}? This cannot be undone.`}
            confirmLabel="Delete"
            variant="destructive"
            isLoading={isDeletingDate}
            onConfirm={handleDeleteDate}
          />
        </TabsContent>

        {/* ========== GALLERY TAB ========== */}
        <TabsContent value="gallery" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Gallery</CardTitle>
                {canManage && (
                  <Button size="sm" onClick={() => setImageDialogOpen(true)}>
                    <Plus className="h-4 w-4" />
                    Add Image
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {!galleryItems || galleryItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Image className="h-12 w-12 mb-3 opacity-40" />
                  <p className="text-sm">No images in the gallery yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {galleryItems.map((item) => (
                    <div key={item.id} className="group relative rounded-lg border overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.caption ?? 'Tour image'}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-3">
                        <p className="text-sm text-muted-foreground truncate">
                          {item.caption || 'No caption'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Order: {item.sort_order}
                        </p>
                      </div>
                      {canManage && (
                        <Button
                          variant="destructive"
                          size="icon-xs"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => setDeleteImage(item)}
                        >
                          <Trash2 className="h-3 w-3" />
                          <span className="sr-only">Delete image</span>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Add Image Dialog */}
          <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Gallery Image</DialogTitle>
                <DialogDescription>
                  Add a new image to the tour gallery.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Image</Label>
                  <ImageUpload
                    value={imageForm.image_url || undefined}
                    onChange={(url) => setImageForm((p) => ({ ...p, image_url: url ?? '' }))}
                    placeholder="Upload gallery image"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="img-caption">Caption</Label>
                  <Input
                    id="img-caption"
                    value={imageForm.caption}
                    onChange={(e) => setImageForm((p) => ({ ...p, caption: e.target.value }))}
                    placeholder="Optional caption"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="img-order">Sort Order</Label>
                  <Input
                    id="img-order"
                    type="number"
                    min={0}
                    value={imageForm.sort_order}
                    onChange={(e) => setImageForm((p) => ({ ...p, sort_order: e.target.value }))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setImageDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddImage} disabled={isAddingImage}>
                  {isAddingImage ? 'Adding...' : 'Add Image'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Image Confirmation */}
          <ConfirmDialog
            open={!!deleteImage}
            onOpenChange={(open) => !open && setDeleteImage(null)}
            title="Remove Image"
            description="Are you sure you want to remove this image from the gallery?"
            confirmLabel="Remove"
            variant="destructive"
            isLoading={isDeletingImage}
            onConfirm={handleDeleteImage}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
