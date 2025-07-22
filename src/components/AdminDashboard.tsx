import { useState, useEffect } from 'react';
import { Download, Edit, Trash2, Plus, ArrowLeft, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getAllStudents, saveStudentRecord, deleteStudentRecord, clearStudentField } from '@/utils/storage';
import { formatCurrency, isValidRollNumber } from '@/utils/validation';
import { exportToExcel, exportToCSV } from '@/utils/export';
import { useToast } from '@/hooks/use-toast';
import { StudentRecord } from '@/types';
interface AdminDashboardProps {
  onBack: () => void;
}
export const AdminDashboard = ({
  onBack
}: AdminDashboardProps) => {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [editingStudent, setEditingStudent] = useState<StudentRecord | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [newRollNumber, setNewRollNumber] = useState('');
  const [newPhonePe, setNewPhonePe] = useState('');
  const [newCash, setNewCash] = useState('');
  const [showAmounts, setShowAmounts] = useState(true);
  const {
    toast
  } = useToast();
  const loadStudents = () => {
    setStudents(getAllStudents().sort((a, b) => a.rollNumber.localeCompare(b.rollNumber)));
  };
  useEffect(() => {
    loadStudents();
  }, []);
  const handleEdit = (student: StudentRecord) => {
    setEditingStudent(student);
    setNewRollNumber(student.rollNumber);
    setNewPhonePe(student.phonePe.toString());
    setNewCash(student.cash.toString());
    setShowDialog(true);
  };
  const handleAdd = () => {
    setEditingStudent(null);
    setNewRollNumber('');
    setNewPhonePe('0');
    setNewCash('0');
    setShowDialog(true);
  };
  const handleSave = () => {
    const normalizedRollNumber = newRollNumber.toUpperCase();
    if (!isValidRollNumber(normalizedRollNumber)) {
      toast({
        title: "Invalid Roll Number",
        description: "Please enter valid last 2 digits (01-99, A0-A9, or B0)",
        variant: "destructive"
      });
      return;
    }
    const phonePe = parseFloat(newPhonePe) || 0;
    const cash = parseFloat(newCash) || 0;
    if (phonePe < 0 || cash < 0) {
      toast({
        title: "Invalid Amount",
        description: "Amounts cannot be negative",
        variant: "destructive"
      });
      return;
    }
    saveStudentRecord(normalizedRollNumber, {
      rollNumber: normalizedRollNumber,
      phonePe,
      cash
    });
    loadStudents();
    setShowDialog(false);
    toast({
      title: "Success",
      description: editingStudent ? "Student record updated" : "Student record created"
    });
  };
  const handleDelete = (rollNumber: string) => {
    deleteStudentRecord(rollNumber);
    loadStudents();
    toast({
      title: "Success",
      description: "Student record deleted"
    });
  };
  const handleClearField = (rollNumber: string, field: 'phonePe' | 'cash') => {
    clearStudentField(rollNumber, field);
    loadStudents();
    toast({
      title: "Success",
      description: `${field === 'phonePe' ? 'PhonePe' : 'Cash'} amount cleared`
    });
  };
  const totalPhonePe = students.reduce((sum, student) => sum + student.phonePe, 0);
  const totalCash = students.reduce((sum, student) => sum + student.cash, 0);
  const grandTotal = totalPhonePe + totalCash;
  return <div className="min-h-screen p-4 bg-gradient-to-br from-background via-background to-background/50">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={onBack} className="glass-card border-primary/30 hover:border-primary/50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-cyber bg-clip-text text-transparent">User Dashbord</h1>
              <p className="text-sm text-muted-foreground">
                Manage all student records
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={() => setShowAmounts(!showAmounts)} className="glass-card border-primary/30 hover:border-primary/50">
              {showAmounts ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button variant="outline" onClick={loadStudents} className="glass-card border-primary/30 hover:border-primary/50">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="glass-card border-primary/20">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-primary">{students.length}</div>
              <p className="text-sm text-muted-foreground">Total Students</p>
            </CardContent>
          </Card>
          <Card className="glass-card border-primary/20">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-primary">
                {showAmounts ? formatCurrency(totalPhonePe) : '₹***'}
              </div>
              <p className="text-sm text-muted-foreground">Total PhonePe</p>
            </CardContent>
          </Card>
          <Card className="glass-card border-secondary/20">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-secondary">
                {showAmounts ? formatCurrency(totalCash) : '₹***'}
              </div>
              <p className="text-sm text-muted-foreground">Total Cash</p>
            </CardContent>
          </Card>
          <Card className="glass-card border-accent/20">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-accent">
                {showAmounts ? formatCurrency(grandTotal) : '₹***'}
              </div>
              <p className="text-sm text-muted-foreground">Grand Total</p>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4">
          <Button onClick={handleAdd} className="cyber-button">
            <Plus className="w-4 h-4 mr-2" />
            Add Student
          </Button>
          <Button variant="outline" onClick={() => exportToExcel(students)} className="glass-card border-primary/30 hover:border-primary/50">
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
          <Button variant="outline" onClick={() => exportToCSV(students)} className="glass-card border-secondary/30 hover:border-secondary/50">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Students Table */}
        <Card className="glass-card border-primary/20">
          <CardHeader>
            <CardTitle>Student Records</CardTitle>
            <CardDescription>
              All student vault data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead>Roll Number</TableHead>
                    <TableHead>PhonePe</TableHead>
                    <TableHead>Cash</TableHead>
                    <TableHead>Total</TableHead>
                    
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.length === 0 ? <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No student records found
                      </TableCell>
                    </TableRow> : students.map(student => <TableRow key={student.rollNumber} className="border-border/50">
                        <TableCell className="font-mono font-bold text-primary">
                          {student.rollNumber}
                        </TableCell>
                        <TableCell className="text-primary">
                          {showAmounts ? formatCurrency(student.phonePe) : '₹***'}
                        </TableCell>
                        <TableCell className="text-secondary">
                          {showAmounts ? formatCurrency(student.cash) : '₹***'}
                        </TableCell>
                        <TableCell className="font-bold text-accent">
                          {showAmounts ? formatCurrency(student.phonePe + student.cash) : '₹***'}
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(student)} className="glass-card border-primary/30 hover:border-primary/50">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDelete(student.rollNumber)} className="glass-card border-destructive/30 hover:border-destructive/50">
                              <Trash2 className="w-3 h-3 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Add/Edit Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="glass-card border-primary/20">
            <DialogHeader>
              <DialogTitle>
                {editingStudent ? 'Edit Student' : 'Add New Student'}
              </DialogTitle>
              <DialogDescription>
                {editingStudent ? 'Update student information' : 'Add a new student to the vault'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Roll Number (Last 2 digits)</label>
                <Input value={newRollNumber} onChange={e => setNewRollNumber(e.target.value.toUpperCase())} placeholder="01, A5, B0..." maxLength={2} className="cyber-input font-mono text-center" disabled={!!editingStudent} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary">PhonePe Amount (₹)</label>
                  <Input type="number" min="0" step="0.01" value={newPhonePe} onChange={e => setNewPhonePe(e.target.value)} className="cyber-input" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary">Cash Amount (₹)</label>
                  <Input type="number" min="0" step="0.01" value={newCash} onChange={e => setNewCash(e.target.value)} className="cyber-input" />
                </div>
              </div>
              <div className="flex space-x-4">
                <Button onClick={handleSave} className="cyber-button flex-1">
                  {editingStudent ? 'Update' : 'Add'} Student
                </Button>
                <Button variant="outline" onClick={() => setShowDialog(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>;
};