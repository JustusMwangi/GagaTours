import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';

import { usePermissions, Permissions } from '@/hooks/usePermissions';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TableRow, TableCell } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
} from '@/components/ui/table';

import {
  useGetQuotationQuery,
  useUpdateQuotationMutation,
  useUpdateQuotationStatusMutation,
  useConvertToInvoiceMutation,
} from '@/services/quotations/quotationsApi';
import { formatDate } from '@/lib/utils';
import type { QuotationItemType, QuotationItemRequest } from '@/types/quotation';

const ITEM_TYPE_OPTIONS: { value: QuotationItemType; label: string }[] = [
  { value: 'service', label: 'Service' },
  { value: 'accommodation', label: 'Accommodation' },
  { value: 'transport', label: 'Transport' },
  { value: 'activity', label: 'Activity' },
  { value: 'other', label: 'Other' },
];

interface AddItemFormState {
  description: string;
  item_type: QuotationItemType;
  quantity: string;
  unit_price: string;
  total_price: string;
  sort_order: string;
}

const initialAddItemForm: AddItemFormState = {
  description: '',
  item_type: 'service',
  quantity: '1',
  unit_price: '0',
  total_price: '0',
  sort_order: '0',
};

export default function QuotationDetailPage() {
  const { quotationId } = useParams<{ quotationId: string }>();
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();

  const { data: quotation, isLoading } = useGetQuotationQuery(quotationId!, {
    skip: !quotationId,
  });

  const [updateQuotation, { isLoading: isUpdating }] = useUpdateQuotationMutation();
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateQuotationStatusMutation();
  const [convertToInvoice, { isLoading: isConverting }] = useConvertToInvoiceMutation();

  // Editable notes / terms
  const [notes, setNotes] = useState<string | null>(null);
  const [terms, setTerms] = useState<string | null>(null);

  // Add item dialog
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [itemForm, setItemForm] = useState<AddItemFormState>(initialAddItemForm);

  // Delete item confirm
  const [deleteItemIndex, setDeleteItemIndex] = useState<number | null>(null);

  // Status confirm dialog
  const [statusConfirm, setStatusConfirm] = useState<{
    title: string;
    description: string;
    action: () => Promise<void>;
  } | null>(null);

  const canManage = hasPermission(Permissions.QUOTATIONS_MANAGE);

  const effectiveNotes = notes ?? quotation?.notes ?? '';
  const effectiveTerms = terms ?? quotation?.terms ?? '';

  const formatAmount = (amount: number) => {
    if (!quotation) return String(amount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: quotation.currency || 'USD',
    }).format(amount);
  };

  // ── Notes / Terms save ──────────────────────────────────────────────

  const handleSaveNotes = async () => {
    if (!quotationId) return;
    try {
      await updateQuotation({
        id: quotationId,
        data: { notes: effectiveNotes || undefined },
      }).unwrap();
      toast.success('Notes saved');
      setNotes(null);
    } catch {
      toast.error('Failed to save notes');
    }
  };

  const handleSaveTerms = async () => {
    if (!quotationId) return;
    try {
      await updateQuotation({
        id: quotationId,
        data: { terms: effectiveTerms || undefined },
      }).unwrap();
      toast.success('Terms saved');
      setTerms(null);
    } catch {
      toast.error('Failed to save terms');
    }
  };

  // ── Line items ──────────────────────────────────────────────────────

  const handleAddItem = async () => {
    if (!quotationId || !quotation) return;
    if (!itemForm.description.trim()) {
      toast.error('Description is required');
      return;
    }

    const newItem: QuotationItemRequest = {
      description: itemForm.description,
      item_type: itemForm.item_type,
      quantity: parseFloat(itemForm.quantity) || 1,
      unit_price: parseFloat(itemForm.unit_price) || 0,
      total_price: parseFloat(itemForm.total_price) || 0,
      sort_order: parseInt(itemForm.sort_order) || 0,
    };

    // Build full items array: existing + new
    const existingItems: QuotationItemRequest[] = quotation.items.map((item) => ({
      description: item.description,
      item_type: item.item_type,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price,
      sort_order: item.sort_order,
    }));

    try {
      await updateQuotation({
        id: quotationId,
        data: { items: [...existingItems, newItem] },
      }).unwrap();
      toast.success('Item added');
      setAddItemOpen(false);
      setItemForm(initialAddItemForm);
    } catch {
      toast.error('Failed to add item');
    }
  };

  const handleDeleteItem = async () => {
    if (!quotationId || !quotation || deleteItemIndex === null) return;

    const updatedItems: QuotationItemRequest[] = quotation.items
      .filter((_, idx) => idx !== deleteItemIndex)
      .map((item) => ({
        description: item.description,
        item_type: item.item_type,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
        sort_order: item.sort_order,
      }));

    try {
      await updateQuotation({
        id: quotationId,
        data: { items: updatedItems },
      }).unwrap();
      toast.success('Item removed');
      setDeleteItemIndex(null);
    } catch {
      toast.error('Failed to remove item');
    }
  };

  // ── Status actions ──────────────────────────────────────────────────

  const handleStatusChange = (newStatus: string, title: string, description: string) => {
    setStatusConfirm({
      title,
      description,
      action: async () => {
        if (!quotationId) return;
        try {
          await updateStatus({ id: quotationId, status: newStatus }).unwrap();
          toast.success(`Quotation status updated to ${newStatus}`);
          setStatusConfirm(null);
        } catch {
          toast.error('Failed to update status');
        }
      },
    });
  };

  const handleConvertToInvoice = () => {
    setStatusConfirm({
      title: 'Convert to Invoice',
      description:
        'This will create an invoice from this quotation and mark the quotation as converted. This action cannot be undone.',
      action: async () => {
        if (!quotationId) return;
        try {
          await convertToInvoice(quotationId).unwrap();
          toast.success('Quotation converted to invoice');
          setStatusConfirm(null);
        } catch {
          toast.error('Failed to convert to invoice');
        }
      },
    });
  };

  // ── Permission guard ────────────────────────────────────────────────

  if (!hasPermission(Permissions.QUOTATIONS_VIEW)) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">You do not have permission to view quotations.</p>
      </div>
    );
  }

  // ── Loading ─────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!quotation) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Quotation not found.</p>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/quotations')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader
          title={quotation.reference}
          description={`Created ${formatDate(quotation.created_at)}`}
        />
        <StatusBadge status={quotation.status} className="ml-2" />
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="items">Line Items</TabsTrigger>
          {canManage && <TabsTrigger value="actions">Actions</TabsTrigger>}
        </TabsList>

        {/* ── Details Tab ──────────────────────────────────────────── */}
        <TabsContent value="details" className="space-y-6">
          {/* Quotation Info */}
          <Card>
            <CardHeader>
              <CardTitle>Quotation Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Reference</dt>
                  <dd className="mt-1 text-sm">{quotation.reference}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                  <dd className="mt-1">
                    <StatusBadge status={quotation.status} />
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Valid Until</dt>
                  <dd className="mt-1 text-sm">{formatDate(quotation.valid_until)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Subtotal</dt>
                  <dd className="mt-1 text-sm">{formatAmount(quotation.subtotal)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Tax</dt>
                  <dd className="mt-1 text-sm">{formatAmount(quotation.tax_amount)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Discount</dt>
                  <dd className="mt-1 text-sm">{formatAmount(quotation.discount_amount)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Total</dt>
                  <dd className="mt-1 text-sm font-semibold">{formatAmount(quotation.total_amount)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Currency</dt>
                  <dd className="mt-1 text-sm">{quotation.currency}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Related Links */}
          <Card>
            <CardHeader>
              <CardTitle>Related Records</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Customer</dt>
                  <dd className="mt-1 text-sm">
                    {quotation.customer ? (
                      <Link
                        to={`/customers/${quotation.customer.id}`}
                        className="text-primary hover:underline"
                      >
                        {quotation.customer.first_name} {quotation.customer.last_name}
                      </Link>
                    ) : (
                      '\u2014'
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Booking</dt>
                  <dd className="mt-1 text-sm">
                    {quotation.booking ? (
                      <Link
                        to={`/bookings/${quotation.booking.id}`}
                        className="text-primary hover:underline"
                      >
                        {quotation.booking.reference}
                      </Link>
                    ) : (
                      '\u2014'
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Tour</dt>
                  <dd className="mt-1 text-sm">
                    {quotation.tour ? (
                      <Link
                        to={`/tours/${quotation.tour.id}`}
                        className="text-primary hover:underline"
                      >
                        {quotation.tour.title}
                      </Link>
                    ) : (
                      '\u2014'
                    )}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Notes & Terms */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  value={effectiveNotes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Internal notes..."
                  rows={4}
                  disabled={!canManage}
                />
                {canManage && notes !== null && (
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      onClick={handleSaveNotes}
                      disabled={isUpdating}
                    >
                      {isUpdating ? 'Saving...' : 'Save Notes'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  value={effectiveTerms}
                  onChange={(e) => setTerms(e.target.value)}
                  placeholder="Terms and conditions..."
                  rows={4}
                  disabled={!canManage}
                />
                {canManage && terms !== null && (
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      onClick={handleSaveTerms}
                      disabled={isUpdating}
                    >
                      {isUpdating ? 'Saving...' : 'Save Terms'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Line Items Tab ───────────────────────────────────────── */}
        <TabsContent value="items" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Line Items</h3>
            {canManage && (
              <Button size="sm" onClick={() => setAddItemOpen(true)}>
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
            )}
          </div>

          {quotation.items.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No line items yet.</p>
                {canManage && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Click "Add Item" to get started.
                  </p>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="font-medium text-xs uppercase tracking-wider text-muted-foreground">
                      Description
                    </TableHead>
                    <TableHead className="font-medium text-xs uppercase tracking-wider text-muted-foreground">
                      Type
                    </TableHead>
                    <TableHead className="font-medium text-xs uppercase tracking-wider text-muted-foreground text-right">
                      Qty
                    </TableHead>
                    <TableHead className="font-medium text-xs uppercase tracking-wider text-muted-foreground text-right">
                      Unit Price
                    </TableHead>
                    <TableHead className="font-medium text-xs uppercase tracking-wider text-muted-foreground text-right">
                      Total
                    </TableHead>
                    <TableHead className="font-medium text-xs uppercase tracking-wider text-muted-foreground text-right">
                      Order
                    </TableHead>
                    {canManage && (
                      <TableHead className="font-medium text-xs uppercase tracking-wider text-muted-foreground w-[50px]" />
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotation.items.map((item, idx) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.description}</TableCell>
                      <TableCell className="capitalize">{item.item_type}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">{formatAmount(item.unit_price)}</TableCell>
                      <TableCell className="text-right">{formatAmount(item.total_price)}</TableCell>
                      <TableCell className="text-right">{item.sort_order}</TableCell>
                      {canManage && (
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => setDeleteItemIndex(idx)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Delete item</span>
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* ── Actions Tab ──────────────────────────────────────────── */}
        {canManage && (
          <TabsContent value="actions">
            <Card>
              <CardHeader>
                <CardTitle>Status Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {quotation.status === 'draft' && (
                  <Button
                    onClick={() =>
                      handleStatusChange(
                        'sent',
                        'Send Quotation',
                        'This will mark the quotation as sent. The customer should be notified separately.',
                      )
                    }
                    disabled={isUpdatingStatus}
                  >
                    <Send className="h-4 w-4" />
                    Send Quotation
                  </Button>
                )}

                {quotation.status === 'sent' && (
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={() =>
                        handleStatusChange(
                          'approved',
                          'Approve Quotation',
                          'Mark this quotation as approved by the customer.',
                        )
                      }
                      disabled={isUpdatingStatus}
                    >
                      <CheckCircle className="h-4 w-4" />
                      Mark Approved
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() =>
                        handleStatusChange(
                          'rejected',
                          'Reject Quotation',
                          'Mark this quotation as rejected by the customer.',
                        )
                      }
                      disabled={isUpdatingStatus}
                    >
                      <XCircle className="h-4 w-4" />
                      Mark Rejected
                    </Button>
                  </div>
                )}

                {quotation.status === 'approved' && (
                  <div className="flex flex-wrap gap-3">
                    <Button onClick={handleConvertToInvoice} disabled={isConverting}>
                      <FileText className="h-4 w-4" />
                      {isConverting ? 'Converting...' : 'Convert to Invoice'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        handleStatusChange(
                          'expired',
                          'Mark Expired',
                          'Mark this quotation as expired. This indicates the offer is no longer valid.',
                        )
                      }
                      disabled={isUpdatingStatus}
                    >
                      <Clock className="h-4 w-4" />
                      Mark Expired
                    </Button>
                  </div>
                )}

                {['rejected', 'expired', 'converted'].includes(quotation.status) && (
                  <p className="text-sm text-muted-foreground">
                    No further actions available for a {quotation.status} quotation.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Add Item Dialog */}
      <Dialog open={addItemOpen} onOpenChange={setAddItemOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Line Item</DialogTitle>
            <DialogDescription>Add a new item to this quotation.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="item-description">Description *</Label>
              <Input
                id="item-description"
                placeholder="Item description"
                value={itemForm.description}
                onChange={(e) =>
                  setItemForm((prev) => ({ ...prev, description: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={itemForm.item_type}
                onValueChange={(val) =>
                  setItemForm((prev) => ({ ...prev, item_type: val as QuotationItemType }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {ITEM_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="item-quantity">Quantity</Label>
                <Input
                  id="item-quantity"
                  type="number"
                  min="1"
                  step="1"
                  value={itemForm.quantity}
                  onChange={(e) =>
                    setItemForm((prev) => ({ ...prev, quantity: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="item-unit-price">Unit Price</Label>
                <Input
                  id="item-unit-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={itemForm.unit_price}
                  onChange={(e) =>
                    setItemForm((prev) => ({ ...prev, unit_price: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="item-total-price">Total Price</Label>
                <Input
                  id="item-total-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={itemForm.total_price}
                  onChange={(e) =>
                    setItemForm((prev) => ({ ...prev, total_price: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="item-sort-order">Sort Order</Label>
                <Input
                  id="item-sort-order"
                  type="number"
                  min="0"
                  step="1"
                  value={itemForm.sort_order}
                  onChange={(e) =>
                    setItemForm((prev) => ({ ...prev, sort_order: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setAddItemOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddItem} disabled={isUpdating}>
              {isUpdating ? 'Adding...' : 'Add Item'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Item Confirmation */}
      <ConfirmDialog
        open={deleteItemIndex !== null}
        onOpenChange={(open) => !open && setDeleteItemIndex(null)}
        title="Remove Line Item"
        description={
          deleteItemIndex !== null && quotation.items[deleteItemIndex]
            ? `Are you sure you want to remove "${quotation.items[deleteItemIndex].description}"?`
            : 'Are you sure you want to remove this item?'
        }
        confirmLabel="Remove"
        variant="destructive"
        isLoading={isUpdating}
        onConfirm={handleDeleteItem}
      />

      {/* Status Action Confirmation */}
      <ConfirmDialog
        open={!!statusConfirm}
        onOpenChange={(open) => !open && setStatusConfirm(null)}
        title={statusConfirm?.title ?? ''}
        description={statusConfirm?.description ?? ''}
        confirmLabel="Confirm"
        variant="default"
        isLoading={isUpdatingStatus || isConverting}
        onConfirm={() => statusConfirm?.action()}
      />
    </div>
  );
}
