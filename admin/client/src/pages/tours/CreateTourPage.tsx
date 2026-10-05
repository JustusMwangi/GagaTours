import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import { usePermissions, Permissions } from '@/hooks/usePermissions';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
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
  useCreateTourMutation,
  useListCategoriesQuery,
  useListDestinationsQuery,
  useCreateCategoryMutation,
  useCreateDestinationMutation,
} from '@/services/tours/toursApi';
import { ImageUpload } from '@/components/shared/ImageUpload';
import { getApiErrorMessage } from '@/lib/utils';
import type { CreateTourRequest } from '@/types/tour';

export default function CreateTourPage() {
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();

  const [createTour, { isLoading: isCreating }] = useCreateTourMutation();
  const { data: categoriesData } = useListCategoriesQuery();
  const { data: destinationsData } = useListDestinationsQuery();
  const [createCategory, { isLoading: isCreatingCat }] = useCreateCategoryMutation();
  const [createDestination, { isLoading: isCreatingDest }] = useCreateDestinationMutation();

  // Tour form
  const [form, setForm] = useState<CreateTourRequest>({
    title: '',
    short_description: '',
    description: '',
    category_ids: [],
    destination_ids: [],
    price: undefined,
    currency: 'USD',
    duration_days: undefined,
    duration_nights: undefined,
    max_group_size: undefined,
    difficulty_level: undefined,
    included: '',
    excluded: '',
    itinerary: '',
    meta_title: '',
    meta_description: '',
    youtube_url: '',
    status: 'draft',
    featured: false,
  });

  // Inline category dialog
  const [catOpen, setCatOpen] = useState(false);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');

  // Inline destination dialog
  const [destOpen, setDestOpen] = useState(false);
  const [destName, setDestName] = useState('');
  const [destCountry, setDestCountry] = useState('');
  const [destDesc, setDestDesc] = useState('');
  const [destImage, setDestImage] = useState('');

  const updateField = <K extends keyof CreateTourRequest>(key: K, value: CreateTourRequest[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }

    try {
      const result = await createTour(form).unwrap();
      toast.success('Tour created successfully');
      navigate(`/tours/${result.id}`);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to create tour'));
    }
  };

  const handleCreateCategory = async () => {
    if (!catName.trim()) {
      toast.error('Category name is required');
      return;
    }
    try {
      const result = await createCategory({ name: catName, description: catDesc || undefined }).unwrap();
      toast.success(`Category "${catName}" created`);
      updateField('category_ids', [...(form.category_ids ?? []), result.id]);
      setCatOpen(false);
      setCatName('');
      setCatDesc('');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to create category'));
    }
  };

  const handleCreateDestination = async () => {
    if (!destName.trim()) {
      toast.error('Destination name is required');
      return;
    }
    try {
      const result = await createDestination({
        name: destName,
        country: destCountry || undefined,
        description: destDesc || undefined,
        image_url: destImage || undefined,
      }).unwrap();
      toast.success(`Destination "${destName}" created`);
      updateField('destination_ids', [...(form.destination_ids ?? []), result.id]);
      setDestOpen(false);
      setDestName('');
      setDestCountry('');
      setDestDesc('');
      setDestImage('');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to create destination'));
    }
  };

  if (!hasPermission(Permissions.TOURS_MANAGE)) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">You do not have permission to create tours.</p>
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
          title="Create Tour"
          description="Add a new tour package"
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="e.g. Serengeti Safari Adventure"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="short_description">One-line summary (max 500 characters)</Label>
              <Input
                id="short_description"
                value={form.short_description ?? ''}
                onChange={(e) => updateField('short_description', e.target.value)}
                placeholder="One sentence shown on tour cards. Full details go in Description below."
              />
            </div>
            <div className="space-y-2">
              <Label>Featured Image</Label>
              <ImageUpload
                value={form.image_url}
                onChange={(url) => updateField('image_url', url)}
                placeholder="Upload tour image"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description ?? ''}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Full tour description..."
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
              />
              <button
                type="button"
                onClick={() => setCatOpen(true)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Can&apos;t find it? <span className="underline">Add new category</span>
              </button>
            </div>
            <div className="space-y-2">
              <Label>Destinations</Label>
              <MultiSelect
                options={(destinationsData?.destinations ?? []).map((dest) => ({ value: dest.id, label: dest.name }))}
                value={form.destination_ids ?? []}
                onChange={(vals) => updateField('destination_ids', vals)}
                placeholder="Select destinations"
                searchPlaceholder="Search destinations…"
              />
              <button
                type="button"
                onClick={() => setDestOpen(true)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Can&apos;t find it? <span className="underline">Add new destination</span>
              </button>
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
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                min={0}
                step="0.01"
                value={form.price ?? ''}
                onChange={(e) => updateField('price', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={form.currency ?? 'USD'}
                onValueChange={(val) => updateField('currency', val)}
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
              <Label htmlFor="duration_days">Duration (Days)</Label>
              <Input
                id="duration_days"
                type="number"
                min={1}
                value={form.duration_days ?? ''}
                onChange={(e) => updateField('duration_days', e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration_nights">Duration (Nights)</Label>
              <Input
                id="duration_nights"
                type="number"
                min={0}
                value={form.duration_nights ?? ''}
                onChange={(e) => updateField('duration_nights', e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_group_size">Max Group Size</Label>
              <Input
                id="max_group_size"
                type="number"
                min={1}
                value={form.max_group_size ?? ''}
                onChange={(e) => updateField('max_group_size', e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
            <div className="space-y-2">
              <Label>Difficulty Level</Label>
              <Select
                value={form.difficulty_level ?? ''}
                onValueChange={(val) => updateField('difficulty_level', val || undefined)}
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
              <Label htmlFor="included">What's Included</Label>
              <Textarea
                id="included"
                value={form.included ?? ''}
                onChange={(e) => updateField('included', e.target.value)}
                placeholder="Park fees&#10;Accommodation&#10;Meals&#10;Transport"
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                Put each item on its own line. Each shows a green tick (✓) on the public tour page — no dashes needed.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="excluded">What's Excluded</Label>
              <Textarea
                id="excluded"
                value={form.excluded ?? ''}
                onChange={(e) => updateField('excluded', e.target.value)}
                placeholder="International flights&#10;Travel insurance&#10;Tips"
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                Put each item on its own line. Each shows a red cross (✗) on the public tour page — no dashes needed.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="itinerary">Itinerary</Label>
              <Textarea
                id="itinerary"
                value={form.itinerary ?? ''}
                onChange={(e) => updateField('itinerary', e.target.value)}
                placeholder="Day 1: Arrival in Arusha...&#10;Day 2: Drive to Serengeti..."
                rows={6}
              />
              <p className="text-xs text-muted-foreground">
                Tip: start each day with <code>Day 1:</code>, <code>Day 2:</code>… to render as a timeline on the public tour page.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="youtube_url">YouTube Video URL</Label>
              <Input
                id="youtube_url"
                type="url"
                value={form.youtube_url ?? ''}
                onChange={(e) => updateField('youtube_url', e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
              />
              <p className="text-xs text-muted-foreground">
                Optional. Paste a full YouTube watch URL; it will be embedded on the tour page.
              </p>
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
              <Label htmlFor="meta_title">Meta Title</Label>
              <Input
                id="meta_title"
                value={form.meta_title ?? ''}
                onChange={(e) => updateField('meta_title', e.target.value)}
                placeholder="Page title for search engines"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meta_description">Meta Description</Label>
              <Textarea
                id="meta_description"
                value={form.meta_description ?? ''}
                onChange={(e) => updateField('meta_description', e.target.value)}
                placeholder="Brief description for search results"
                rows={3}
              />
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
                id="featured"
                checked={form.featured ?? false}
                onCheckedChange={(checked) => updateField('featured', checked)}
              />
              <Label htmlFor="featured">Featured Tour</Label>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate('/tours')}>
            Cancel
          </Button>
          <Button type="submit" disabled={isCreating}>
            {isCreating ? 'Creating...' : 'Create Tour'}
          </Button>
        </div>
      </form>

      {/* Inline Add Category Dialog */}
      <Dialog open={catOpen} onOpenChange={setCatOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Category</DialogTitle>
            <DialogDescription>Create a tour category and it will be selected automatically.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={catName} onChange={(e) => setCatName(e.target.value)} placeholder="e.g. Wildlife Safari" />
            </div>
            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Textarea value={catDesc} onChange={(e) => setCatDesc(e.target.value)} placeholder="Brief description..." rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCatOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateCategory} disabled={isCreatingCat}>
              {isCreatingCat ? 'Creating...' : 'Create Category'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Inline Add Destination Dialog */}
      <Dialog open={destOpen} onOpenChange={setDestOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Destination</DialogTitle>
            <DialogDescription>Create a destination and it will be selected automatically.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={destName} onChange={(e) => setDestName(e.target.value)} placeholder="e.g. Serengeti National Park" />
            </div>
            <div className="space-y-2">
              <Label>Country</Label>
              <Input value={destCountry} onChange={(e) => setDestCountry(e.target.value)} placeholder="e.g. Tanzania" />
            </div>
            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Textarea value={destDesc} onChange={(e) => setDestDesc(e.target.value)} placeholder="Brief description..." rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Image</Label>
              <ImageUpload
                value={destImage || undefined}
                onChange={(url) => setDestImage(url ?? '')}
                placeholder="Upload image"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDestOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateDestination} disabled={isCreatingDest}>
              {isCreatingDest ? 'Creating...' : 'Create Destination'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
