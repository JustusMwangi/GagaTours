import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import { usePermissions, Permissions } from '@/hooks/usePermissions';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  useGetCustomerQuery,
  useUpdateCustomerMutation,
} from '@/services/customers/customersApi';
import type { UpdateCustomerRequest } from '@/types/customer';
import { formatDate, formatDateTime } from '@/lib/utils';

const SOURCE_OPTIONS = [
  { value: 'direct', label: 'Direct' },
  { value: 'website', label: 'Website' },
  { value: 'referral', label: 'Referral' },
  { value: 'agent', label: 'Agent' },
  { value: 'social_media', label: 'Social Media' },
];

export default function CustomerDetailPage() {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const canEdit = hasPermission(Permissions.CUSTOMERS_MANAGE);

  const { data: customer, isLoading } = useGetCustomerQuery(customerId!, { skip: !customerId });
  const [updateCustomer, { isLoading: isUpdating }] = useUpdateCustomerMutation();

  const [formOverrides, setFormOverrides] = useState<Partial<UpdateCustomerRequest> | null>(null);

  const form: UpdateCustomerRequest = formOverrides ?? {
    first_name: customer?.first_name,
    last_name: customer?.last_name,
    email: customer?.email ?? '',
    phone: customer?.phone ?? '',
    nationality: customer?.nationality ?? '',
    passport_number: customer?.passport_number ?? '',
    address: customer?.address ?? '',
    notes: customer?.notes ?? '',
    source: customer?.source,
    is_active: customer?.is_active,
  };
  const isDirty = formOverrides !== null;

  const updateField = <K extends keyof UpdateCustomerRequest>(key: K, value: UpdateCustomerRequest[K]) => {
    setFormOverrides((prev) => ({ ...form, ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!customerId) return;
    try {
      await updateCustomer({
        id: customerId,
        data: {
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email || undefined,
          phone: form.phone || undefined,
          nationality: form.nationality || undefined,
          passport_number: form.passport_number || undefined,
          address: form.address || undefined,
          notes: form.notes || undefined,
          source: form.source,
          is_active: form.is_active,
        },
      }).unwrap();
      toast.success('Customer updated successfully');
      setFormOverrides(null);
    } catch {
      toast.error('Failed to update customer');
    }
  };

  if (!hasPermission(Permissions.CUSTOMERS_VIEW)) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">You do not have permission to view this customer.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Customer not found.</p>
      </div>
    );
  }

  const fullName = `${customer.first_name} ${customer.last_name}`.trim();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/customers')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader
          title={fullName}
          description={customer.email ?? 'No email on file'}
        />
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>Created: {formatDate(customer.created_at)}</span>
        <span>Updated: {formatDateTime(customer.updated_at)}</span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Personal Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={form.first_name ?? ''}
                  onChange={(e) => updateField('first_name', e.target.value)}
                  disabled={!canEdit}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={form.last_name ?? ''}
                  onChange={(e) => updateField('last_name', e.target.value)}
                  disabled={!canEdit}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email ?? ''}
                onChange={(e) => updateField('email', e.target.value)}
                disabled={!canEdit}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={form.phone ?? ''}
                onChange={(e) => updateField('phone', e.target.value)}
                disabled={!canEdit}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality</Label>
              <Input
                id="nationality"
                value={form.nationality ?? ''}
                onChange={(e) => updateField('nationality', e.target.value)}
                disabled={!canEdit}
              />
            </div>
          </CardContent>
        </Card>

        {/* Additional Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="passport_number">Passport Number</Label>
              <Input
                id="passport_number"
                value={form.passport_number ?? ''}
                onChange={(e) => updateField('passport_number', e.target.value)}
                disabled={!canEdit}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={form.address ?? ''}
                onChange={(e) => updateField('address', e.target.value)}
                disabled={!canEdit}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={form.notes ?? ''}
                onChange={(e) => updateField('notes', e.target.value)}
                disabled={!canEdit}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Source</Label>
              <Select
                value={form.source ?? 'direct'}
                onValueChange={(val) => updateField('source', val)}
                disabled={!canEdit}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  {SOURCE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="is_active"
                checked={form.is_active ?? true}
                onCheckedChange={(checked) => updateField('is_active', checked)}
                disabled={!canEdit}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
          </CardContent>
        </Card>
      </div>

      {canEdit && (
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isUpdating || !isDirty}>
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      )}
    </div>
  );
}
