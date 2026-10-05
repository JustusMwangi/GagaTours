import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { ArrowLeft, Plus, Check, Send, AlertTriangle, Ban, DollarSign } from 'lucide-react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  useGetInvoiceQuery,
  useUpdateInvoiceStatusMutation,
  useListPaymentsQuery,
  useRecordPaymentMutation,
  useConfirmPaymentMutation,
} from '@/services/invoices/invoicesApi';
import { formatDate } from '@/lib/utils';
import type { InvoiceStatus, PaymentMethod, RecordPaymentRequest } from '@/types/invoice';

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'cash', label: 'Cash' },
  { value: 'mpesa', label: 'M-Pesa' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'other', label: 'Other' },
];

function formatAmount(amount: number | undefined | null, currency?: string): string {
  if (amount == null) return '—';
  const curr = currency ?? 'USD';
  return `${curr} ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

interface PaymentFormState {
  amount: string;
  payment_method: PaymentMethod;
  payment_date: string;
  reference_number: string;
  notes: string;
}

const initialPaymentForm: PaymentFormState = {
  amount: '',
  payment_method: 'bank_transfer',
  payment_date: new Date().toISOString().split('T')[0],
  reference_number: '',
  notes: '',
};

export default function InvoiceDetailPage() {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();

  const { data: invoice, isLoading } = useGetInvoiceQuery(invoiceId!, { skip: !invoiceId });
  const { data: payments, isLoading: isLoadingPayments } = useListPaymentsQuery(invoiceId!, {
    skip: !invoiceId,
  });

  const [updateInvoiceStatus, { isLoading: isUpdatingStatus }] = useUpdateInvoiceStatusMutation();
  const [recordPayment, { isLoading: isRecording }] = useRecordPaymentMutation();
  const [confirmPayment, { isLoading: isConfirming }] = useConfirmPaymentMutation();

  const canManage = hasPermission(Permissions.INVOICES_MANAGE);

  // Payment dialog
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState<PaymentFormState>(initialPaymentForm);

  // Status action confirm dialog
  const [statusAction, setStatusAction] = useState<{
    status: InvoiceStatus;
    label: string;
  } | null>(null);

  // Confirm payment dialog
  const [confirmPaymentId, setConfirmPaymentId] = useState<string | null>(null);

  const handleRecordPayment = async () => {
    if (!invoiceId || !paymentForm.amount) {
      toast.error('Amount is required');
      return;
    }
    try {
      const data: RecordPaymentRequest = {
        amount: Number(paymentForm.amount),
        payment_method: paymentForm.payment_method,
        payment_date: paymentForm.payment_date,
        reference_number: paymentForm.reference_number || undefined,
        notes: paymentForm.notes || undefined,
      };
      await recordPayment({ id: invoiceId, data }).unwrap();
      toast.success('Payment recorded successfully');
      setPaymentOpen(false);
      setPaymentForm(initialPaymentForm);
    } catch {
      toast.error('Failed to record payment');
    }
  };

  const handleStatusChange = async () => {
    if (!invoiceId || !statusAction) return;
    try {
      await updateInvoiceStatus({ id: invoiceId, status: statusAction.status }).unwrap();
      toast.success(`Invoice marked as ${statusAction.label.toLowerCase()}`);
      setStatusAction(null);
    } catch {
      toast.error('Failed to update invoice status');
    }
  };

  const handleConfirmPayment = async () => {
    if (!confirmPaymentId) return;
    try {
      await confirmPayment(confirmPaymentId).unwrap();
      toast.success('Payment confirmed successfully');
      setConfirmPaymentId(null);
    } catch {
      toast.error('Failed to confirm payment');
    }
  };

  const updatePaymentField = (field: keyof PaymentFormState, value: string) => {
    setPaymentForm((prev) => ({ ...prev, [field]: value }));
  };

  if (!hasPermission(Permissions.INVOICES_VIEW)) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">You do not have permission to view this invoice.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Invoice not found.</p>
      </div>
    );
  }

  // Calculate payment totals
  const confirmedPayments = (payments ?? invoice.payments ?? []).filter(
    (p) => p.status === 'confirmed'
  );
  const totalPaid = confirmedPayments.reduce((sum, p) => sum + p.amount, 0);
  const remaining = invoice.total_amount - totalPaid;
  const allPayments = payments ?? invoice.payments ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/invoices')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader
          title={`Invoice ${invoice.invoice_number}`}
          description={
            invoice.customer
              ? `${invoice.customer.first_name} ${invoice.customer.last_name}`
              : 'No customer linked'
          }
        />
        <div className="ml-auto">
          <StatusBadge status={invoice.status} />
        </div>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          {canManage && <TabsTrigger value="actions">Actions</TabsTrigger>}
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Invoice Info */}
            <Card>
              <CardHeader>
                <CardTitle>Invoice Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Invoice Number</span>
                    <p className="font-medium">{invoice.invoice_number}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status</span>
                    <p className="mt-0.5">
                      <StatusBadge status={invoice.status} />
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Issued Date</span>
                    <p className="font-medium">{formatDate(invoice.issued_date)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Due Date</span>
                    <p className="font-medium">{formatDate(invoice.due_date)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Paid Date</span>
                    <p className="font-medium">{formatDate(invoice.paid_date)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Currency</span>
                    <p className="font-medium">{invoice.currency}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Amounts Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Amount Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatAmount(invoice.subtotal, invoice.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">{formatAmount(invoice.tax_amount, invoice.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="font-medium">
                      {invoice.discount_amount > 0 ? '-' : ''}
                      {formatAmount(invoice.discount_amount, invoice.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-3">
                    <span className="font-semibold">Total</span>
                    <span className="font-semibold">
                      {formatAmount(invoice.total_amount, invoice.currency)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Links & References */}
            <Card>
              <CardHeader>
                <CardTitle>References</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Customer</span>
                  <p className="font-medium">
                    {invoice.customer ? (
                      <Link
                        to={`/customers/${invoice.customer.id}`}
                        className="text-primary hover:underline"
                      >
                        {invoice.customer.first_name} {invoice.customer.last_name}
                      </Link>
                    ) : (
                      '—'
                    )}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Booking</span>
                  <p className="font-medium">
                    {invoice.booking ? (
                      <Link
                        to={`/bookings/${invoice.booking.id}`}
                        className="text-primary hover:underline"
                      >
                        {invoice.booking.reference}
                      </Link>
                    ) : (
                      '—'
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Notes & Terms */}
            <Card>
              <CardHeader>
                <CardTitle>Notes & Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Notes</span>
                  <p className="font-medium whitespace-pre-wrap">{invoice.notes ?? '—'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Terms</span>
                  <p className="font-medium whitespace-pre-wrap">{invoice.terms ?? '—'}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-6">
          {/* Financial Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground">Total Amount</div>
                <div className="text-2xl font-bold">
                  {formatAmount(invoice.total_amount, invoice.currency)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground">Paid So Far</div>
                <div className="text-2xl font-bold text-green-600">
                  {formatAmount(totalPaid, invoice.currency)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground">Remaining</div>
                <div className="text-2xl font-bold text-orange-600">
                  {formatAmount(remaining, invoice.currency)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payments Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Payment History</CardTitle>
                {canManage && (
                  <Button size="sm" onClick={() => setPaymentOpen(true)}>
                    <Plus className="h-4 w-4" />
                    Record Payment
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingPayments ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : allPayments.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  No payments recorded yet.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Status</TableHead>
                      {canManage && <TableHead className="w-[100px]">Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">
                          {formatAmount(payment.amount, invoice.currency)}
                        </TableCell>
                        <TableCell className="capitalize">
                          {payment.payment_method.replace(/_/g, ' ')}
                        </TableCell>
                        <TableCell>{formatDate(payment.payment_date)}</TableCell>
                        <TableCell>{payment.reference_number ?? '—'}</TableCell>
                        <TableCell>
                          <StatusBadge status={payment.status} />
                        </TableCell>
                        {canManage && (
                          <TableCell>
                            {payment.status === 'pending' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setConfirmPaymentId(payment.id)}
                              >
                                <Check className="h-4 w-4" />
                                Confirm
                              </Button>
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Actions Tab */}
        {canManage && (
          <TabsContent value="actions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Update the invoice status based on its current state. Current status:{' '}
                  <StatusBadge status={invoice.status} />
                </p>
                <div className="flex flex-wrap gap-3">
                  {invoice.status === 'draft' && (
                    <Button
                      onClick={() =>
                        setStatusAction({ status: 'sent', label: 'Sent' })
                      }
                    >
                      <Send className="h-4 w-4" />
                      Send Invoice
                    </Button>
                  )}

                  {(invoice.status === 'sent' || invoice.status === 'partially_paid') && (
                    <>
                      <Button
                        onClick={() =>
                          setStatusAction({ status: 'paid', label: 'Paid' })
                        }
                      >
                        <DollarSign className="h-4 w-4" />
                        Mark Paid
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() =>
                          setStatusAction({ status: 'overdue', label: 'Overdue' })
                        }
                      >
                        <AlertTriangle className="h-4 w-4" />
                        Mark Overdue
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() =>
                          setStatusAction({ status: 'cancelled', label: 'Cancelled' })
                        }
                      >
                        <Ban className="h-4 w-4" />
                        Cancel
                      </Button>
                    </>
                  )}

                  {invoice.status === 'overdue' && (
                    <>
                      <Button
                        onClick={() =>
                          setStatusAction({ status: 'paid', label: 'Paid' })
                        }
                      >
                        <DollarSign className="h-4 w-4" />
                        Mark Paid
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() =>
                          setStatusAction({ status: 'cancelled', label: 'Cancelled' })
                        }
                      >
                        <Ban className="h-4 w-4" />
                        Cancel
                      </Button>
                    </>
                  )}

                  {(invoice.status === 'paid' || invoice.status === 'cancelled') && (
                    <p className="text-sm text-muted-foreground">
                      No further actions available for this invoice status.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Record Payment Dialog */}
      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              Record a payment against invoice {invoice.invoice_number}. Remaining balance:{' '}
              {formatAmount(remaining, invoice.currency)}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="payment_amount">Amount *</Label>
              <Input
                id="payment_amount"
                type="number"
                min="0.01"
                step="0.01"
                value={paymentForm.amount}
                onChange={(e) => updatePaymentField('amount', e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select
                value={paymentForm.payment_method}
                onValueChange={(val) =>
                  updatePaymentField('payment_method', val)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment_date">Payment Date *</Label>
              <Input
                id="payment_date"
                type="date"
                value={paymentForm.payment_date}
                onChange={(e) => updatePaymentField('payment_date', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reference_number">Reference Number</Label>
              <Input
                id="reference_number"
                value={paymentForm.reference_number}
                onChange={(e) => updatePaymentField('reference_number', e.target.value)}
                placeholder="Transaction reference"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment_notes">Notes</Label>
              <Textarea
                id="payment_notes"
                value={paymentForm.notes}
                onChange={(e) => updatePaymentField('notes', e.target.value)}
                rows={2}
                placeholder="Payment notes..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRecordPayment} disabled={isRecording}>
              {isRecording ? 'Recording...' : 'Record Payment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Change Confirmation */}
      <ConfirmDialog
        open={!!statusAction}
        onOpenChange={(open) => !open && setStatusAction(null)}
        title={`Mark Invoice as ${statusAction?.label ?? ''}`}
        description={`Are you sure you want to mark invoice ${invoice.invoice_number} as ${statusAction?.label.toLowerCase() ?? ''}?`}
        confirmLabel={statusAction?.label ?? 'Confirm'}
        variant={statusAction?.status === 'cancelled' ? 'destructive' : 'default'}
        isLoading={isUpdatingStatus}
        onConfirm={handleStatusChange}
      />

      {/* Confirm Payment Dialog */}
      <ConfirmDialog
        open={!!confirmPaymentId}
        onOpenChange={(open) => !open && setConfirmPaymentId(null)}
        title="Confirm Payment"
        description="Are you sure you want to confirm this payment? This action cannot be undone."
        confirmLabel="Confirm Payment"
        variant="default"
        isLoading={isConfirming}
        onConfirm={handleConfirmPayment}
      />
    </div>
  );
}
