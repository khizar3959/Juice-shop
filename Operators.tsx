import React, { useState } from 'react';
import { DataTable } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { MoreHorizontal, Edit, Trash2, FileText, Upload } from 'lucide-react';
import { differenceInDays, parseISO } from 'date-fns';

type OperatorStatus = 'Active' | 'Leave' | 'Inactive';

interface Operator {
  id: string;
  name: string;
  phone: string;
  emiratesId: string;
  licenseNumber: string;
  licenseExpiry: string;
  salary: string;
  assignedVehicle: string;
  status: OperatorStatus;
}

const initialOperators: Operator[] = [
  { id: '1', name: 'Ahmed Khan', phone: '+971 50 123 4567', emiratesId: '784-1234-5678901-1', licenseNumber: 'DXB-98765', licenseExpiry: '2026-05-12', salary: 'AED 3,500', assignedVehicle: 'Bobcat S450', status: 'Active' },
  { id: '2', name: 'Muhammad Ali', phone: '+971 55 987 6543', emiratesId: '784-9876-5432109-2', licenseNumber: 'DXB-12345', licenseExpiry: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], salary: 'AED 4,000', assignedVehicle: 'Excavator 320', status: 'Active' },
  { id: '3', name: 'Sajid Mehmood', phone: '+971 52 456 7890', emiratesId: '784-4567-8901234-3', licenseNumber: 'DXB-54321', licenseExpiry: '2023-10-01', salary: 'AED 3,200', assignedVehicle: 'None', status: 'Leave' },
];

export default function Operators() {
  const [operators, setOperators] = useState<Operator[]>(initialOperators);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleDelete = (id: string) => {
    setOperators(operators.filter(op => op.id !== id));
  };

  const handleAddOperator = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newOperator: Operator = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      emiratesId: formData.get('emiratesId') as string,
      licenseNumber: formData.get('licenseNumber') as string,
      licenseExpiry: formData.get('licenseExpiry') as string,
      salary: formData.get('salary') as string,
      assignedVehicle: 'None',
      status: 'Active',
    };
    setOperators([...operators, newOperator]);
    setIsAddModalOpen(false);
  };

  // Helper to determine expiry status
  const getExpiryStatus = (dateStr: string) => {
    const days = differenceInDays(parseISO(dateStr), new Date());
    if (days < 0) return { label: 'Expired', variant: 'danger' as const };
    if (days <= 7) return { label: 'Expiring Soon', variant: 'warning' as const };
    return { label: 'Valid', variant: 'success' as const };
  };

  const columns = [
    { header: 'Name', accessorKey: 'name' as keyof Operator, cell: (row: Operator) => <span className="font-medium text-slate-900 dark:text-white">{row.name}</span> },
    { header: 'Phone', accessorKey: 'phone' as keyof Operator },
    { 
      header: 'License Expiry', 
      cell: (row: Operator) => {
        const status = getExpiryStatus(row.licenseExpiry);
        return (
          <div className="flex flex-col gap-1">
            <span className="text-sm">{row.licenseExpiry}</span>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
        );
      }
    },
    { header: 'Assigned Vehicle', accessorKey: 'assignedVehicle' as keyof Operator, cell: (row: Operator) => <span className="text-slate-500 dark:text-slate-400">{row.assignedVehicle}</span> },
    { 
      header: 'Status', 
      cell: (row: Operator) => (
        <Badge variant={row.status === 'Active' ? 'success' : row.status === 'Leave' ? 'warning' : 'default'}>
          {row.status}
        </Badge>
      )
    },
    {
      header: 'Actions',
      cell: (row: Operator) => (
        <div className="flex items-center gap-2">
          <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-md transition-colors" title="View Documents">
            <FileText className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-md transition-colors" title="Edit">
            <Edit className="w-4 h-4" />
          </button>
          <button 
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors" 
            title="Delete"
            onClick={() => handleDelete(row.id)}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Operators</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage all equipment operators and their documents.</p>
        </div>
      </div>

      <DataTable 
        data={operators} 
        columns={columns} 
        searchPlaceholder="Search operators by name or ID..."
        onAddClick={() => setIsAddModalOpen(true)}
        addLabel="Add Operator"
      />

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Operator"
      >
        <form className="space-y-4" onSubmit={handleAddOperator}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
              <input type="text" name="name" required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" placeholder="e.g. Ahmed Khan" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number</label>
              <input type="tel" name="phone" required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" placeholder="+971 50 000 0000" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Emirates ID</label>
              <input type="text" name="emiratesId" required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" placeholder="784-0000-0000000-0" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">License Number</label>
              <input type="text" name="licenseNumber" required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" placeholder="License Number" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">License Expiry Date</label>
              <input type="date" name="licenseExpiry" required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Salary (AED)</label>
              <input type="text" name="salary" required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" placeholder="3,500" />
            </div>
          </div>
          
          <div className="space-y-1.5 pt-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Upload Documents</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-700 border-dashed rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-slate-400" />
                <div className="flex text-sm text-slate-600 dark:text-slate-400 justify-center">
                  <span className="relative cursor-pointer bg-transparent rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none">
                    Upload a file
                  </span>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-slate-500">PNG, JPG, PDF up to 10MB</p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800 mt-6">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Operator</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
