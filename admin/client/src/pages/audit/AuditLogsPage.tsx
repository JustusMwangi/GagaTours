import { useState } from 'react';
import { Download, FileText, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TableRow, TableCell } from '@/components/ui/table';
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
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { SearchInput } from '@/components/shared/SearchInput';
import { EmptyState } from '@/components/shared/EmptyState';
import { usePermissions, Permissions } from '@/hooks/usePermissions';
import { formatDateTime, cn } from '@/lib/utils';

import {
  useGetAuditLogsQuery,
  useLazyExportAuditLogsQuery,
} from '@/services/audit/auditApi';
import type { AuditLog } from '@/types/audit';

const ACTION_COLORS: Record<string, string> = {
  create: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
  update: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
  delete: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
  login: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
};

const ACTION_OPTIONS = [
  { value: 'all', label: 'All Actions' },
  { value: 'create', label: 'Create' },
  { value: 'update', label: 'Update' },
  { value: 'delete', label: 'Delete' },
  { value: 'login', label: 'Login' },
  { value: 'logout', label: 'Logout' },
  { value: 'export', label: 'Export' },
];

const RESOURCE_TYPE_OPTIONS = [
  { value: 'all', label: 'All Resources' },
  { value: 'user', label: 'User' },
  { value: 'tenant', label: 'Tenant' },
  { value: 'payment', label: 'Payment' },
  { value: 'role', label: 'Role' },
  { value: 'notification', label: 'Notification' },
  { value: 'setting', label: 'Setting' },
];

const TABLE_COLUMNS = [
  { key: 'timestamp', header: 'Timestamp', className: 'w-[180px]' },
  { key: 'user', header: 'User' },
  { key: 'action', header: 'Action', className: 'w-[120px]' },
  { key: 'resource_type', header: 'Resource', className: 'w-[120px]' },
  { key: 'description', header: 'Description' },
];

function ActionBadge({ action }: { action: string }) {
  const colorClass = ACTION_COLORS[action.toLowerCase()] ?? '';
  return (
    <Badge
      variant="outline"
      className={cn('capitalize', colorClass)}
    >
      {action}
    </Badge>
  );
}

export default function AuditLogsPage() {
  const { hasPermission } = usePermissions();
  const canExport = hasPermission(Permissions.AUDIT_EXPORT);

  // Filters
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState('all');
  const [resourceTypeFilter, setResourceTypeFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [search, setSearch] = useState('');

  // Detail dialog
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  // Export dialog
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('csv');

  const queryParams = {
    page,
    per_page: 20,
    ...(actionFilter !== 'all' ? { action: actionFilter } : {}),
    ...(resourceTypeFilter !== 'all' ? { resource_type: resourceTypeFilter } : {}),
    ...(startDate ? { start_date: startDate } : {}),
    ...(endDate ? { end_date: endDate } : {}),
    ...(search ? { resource_id: search } : {}),
  };

  const { data, isLoading, isFetching } = useGetAuditLogsQuery(queryParams);
  const [triggerExport, { isFetching: isExporting }] = useLazyExportAuditLogsQuery();

  const handleExport = async () => {
    try {
      const exportParams = {
        format: exportFormat,
        ...(actionFilter !== 'all' ? { action: actionFilter } : {}),
        ...(resourceTypeFilter !== 'all' ? { resource_type: resourceTypeFilter } : {}),
        ...(startDate ? { start_date: startDate } : {}),
        ...(endDate ? { end_date: endDate } : {}),
      };

      const url = await triggerExport(exportParams).unwrap();
      const link = document.createElement('a');
      link.href = url as string;
      link.download = `audit-logs.${exportFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url as string);

      setExportDialogOpen(false);
      toast.success('Audit logs exported successfully');
    } catch {
      toast.error('Failed to export audit logs');
    }
  };

  if (!hasPermission(Permissions.AUDIT_VIEW)) {
    return (
      <div className="space-y-6">
        <PageHeader title="Audit Logs" />
        <EmptyState
          icon={ShieldCheck}
          title="Access denied"
          description="You do not have permission to view audit logs."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs"
        action={
          canExport ? (
            <Button variant="outline" onClick={() => setExportDialogOpen(true)}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          ) : undefined
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3">
        <Select value={actionFilter} onValueChange={(v) => { setActionFilter(v); setPage(1); }}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ACTION_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={resourceTypeFilter} onValueChange={(v) => { setResourceTypeFilter(v); setPage(1); }}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {RESOURCE_TYPE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <div>
            <Label htmlFor="start-date" className="sr-only">Start date</Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
              placeholder="Start date"
              className="w-[150px]"
            />
          </div>
          <span className="text-muted-foreground text-sm">to</span>
          <div>
            <Label htmlFor="end-date" className="sr-only">End date</Label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
              placeholder="End date"
              className="w-[150px]"
            />
          </div>
        </div>

        <SearchInput
          value={search}
          onChange={(v) => { setSearch(v); setPage(1); }}
          placeholder="Search by resource ID..."
          className="w-[220px]"
        />
      </div>

      {/* Data Table */}
      <DataTable<AuditLog>
        columns={TABLE_COLUMNS}
        data={data?.logs}
        isLoading={isLoading}
        isFetching={isFetching}
        emptyMessage="No audit logs found"
        emptyDescription="Adjust your filters or check back later."
        page={data?.page}
        totalPages={data?.pages}
        onPageChange={setPage}
        renderRow={(log) => (
          <TableRow
            key={log.id}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => setSelectedLog(log)}
          >
            <TableCell className="text-sm">
              {formatDateTime(log.created_at)}
            </TableCell>
            <TableCell className="text-sm">
              {log.user_name || log.user_email || 'System'}
            </TableCell>
            <TableCell>
              <ActionBadge action={log.action} />
            </TableCell>
            <TableCell className="text-sm capitalize">
              {log.resource_type}
            </TableCell>
            <TableCell className="text-sm text-muted-foreground max-w-[300px] truncate">
              {log.description || '\u2014'}
            </TableCell>
          </TableRow>
        )}
      />

      {/* Detail Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Audit Log Detail</DialogTitle>
            <DialogDescription>
              Full details for this audit event.
            </DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Action</p>
                  <div className="mt-1">
                    <ActionBadge action={selectedLog.action} />
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground">Resource Type</p>
                  <p className="font-medium capitalize mt-1">{selectedLog.resource_type}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Resource ID</p>
                  <p className="font-mono text-xs mt-1">{selectedLog.resource_id || '\u2014'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Timestamp</p>
                  <p className="mt-1">{formatDateTime(selectedLog.created_at)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">User</p>
                  <p className="mt-1">{selectedLog.user_name || selectedLog.user_email || 'System'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">IP Address</p>
                  <p className="font-mono text-xs mt-1">{selectedLog.ip_address || '\u2014'}</p>
                </div>
              </div>

              {selectedLog.description && (
                <div className="text-sm">
                  <p className="text-muted-foreground">Description</p>
                  <p className="mt-1">{selectedLog.description}</p>
                </div>
              )}

              {selectedLog.user_agent && (
                <div className="text-sm">
                  <p className="text-muted-foreground">User Agent</p>
                  <p className="text-xs text-muted-foreground mt-1 break-all">
                    {selectedLog.user_agent}
                  </p>
                </div>
              )}

              {selectedLog.old_values && (
                <div className="text-sm">
                  <p className="text-muted-foreground mb-1">Old Values</p>
                  <pre className="bg-muted rounded-md p-3 text-xs overflow-x-auto">
                    {JSON.stringify(selectedLog.old_values, null, 2)}
                  </pre>
                </div>
              )}

              {selectedLog.new_values && (
                <div className="text-sm">
                  <p className="text-muted-foreground mb-1">New Values</p>
                  <pre className="bg-muted rounded-md p-3 text-xs overflow-x-auto">
                    {JSON.stringify(selectedLog.new_values, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Export Audit Logs</DialogTitle>
            <DialogDescription>
              Choose a format to export the current filtered audit logs.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <Label htmlFor="export-format">Format</Label>
            <Select value={exportFormat} onValueChange={(v) => setExportFormat(v as 'json' | 'csv')}>
              <SelectTrigger id="export-format" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setExportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={isExporting}>
              <FileText className="mr-2 h-4 w-4" />
              {isExporting ? 'Exporting...' : 'Export'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
