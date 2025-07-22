import { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, DollarSign, Save, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getStudentRecord, saveStudentRecord } from '@/utils/storage';
import { formatCurrency } from '@/utils/validation';
import { useToast } from '@/hooks/use-toast';
import { StudentRecord } from '@/types';

interface StudentDashboardProps {
  rollNumber: string;
  onLogout: () => void;
}

export const StudentDashboard = ({ rollNumber, onLogout }: StudentDashboardProps) => {
  const [record, setRecord] = useState<StudentRecord>({
    rollNumber,
    phonePe: 0,
    cash: 0,
    lastUpdated: new Date().toISOString()
  });
  const [isEditing, setIsEditing] = useState(false);
  const [phonepeInput, setPhonepeInput] = useState('');
  const [cashInput, setCashInput] = useState('');
  const [showAmounts, setShowAmounts] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const existingRecord = getStudentRecord(rollNumber);
    if (existingRecord) {
      setRecord(existingRecord);
      setPhonepeInput(existingRecord.phonePe.toString());
      setCashInput(existingRecord.cash.toString());
    }
  }, [rollNumber]);

  const handleSave = () => {
    const phonePe = parseFloat(phonepeInput) || 0;
    const cash = parseFloat(cashInput) || 0;

    if (phonePe < 0 || cash < 0) {
      toast({
        title: "Invalid Amount",
        description: "Amounts cannot be negative",
        variant: "destructive"
      });
      return;
    }

    const updatedRecord = {
      ...record,
      phonePe,
      cash
    };

    saveStudentRecord(rollNumber, updatedRecord);
    setRecord(updatedRecord);
    setIsEditing(false);

    toast({
      title: "Success",
      description: "Your data has been saved successfully",
    });
  };

  const handleClear = (field: 'phonePe' | 'cash') => {
    if (field === 'phonePe') {
      setPhonepeInput('0');
    } else {
      setCashInput('0');
    }
  };

  const totalAmount = record.phonePe + record.cash;

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-background via-background to-background/50">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={onLogout}
            className="glass-card border-primary/30 hover:border-primary/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-cyber bg-clip-text text-transparent">
              Vault #{rollNumber}
            </h1>
            <p className="text-sm text-muted-foreground">
              Last updated: {new Date(record.lastUpdated).toLocaleString('en-IN')}
            </p>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowAmounts(!showAmounts)}
            className="glass-card border-primary/30 hover:border-primary/50"
          >
            {showAmounts ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-card border-primary/20 animate-float">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-primary">
                <CreditCard className="w-5 h-5" />
                <span>PhonePe</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {showAmounts ? formatCurrency(record.phonePe) : '₹***'}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-secondary/20 animate-float" style={{animationDelay: '0.1s'}}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-secondary">
                <DollarSign className="w-5 h-5" />
                <span>Cash</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">
                {showAmounts ? formatCurrency(record.cash) : '₹***'}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-accent/20 animate-float" style={{animationDelay: '0.2s'}}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-accent">
                <DollarSign className="w-5 h-5" />
                <span>Total</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {showAmounts ? formatCurrency(totalAmount) : '₹***'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Edit Panel */}
        <Card className="glass-card border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Manage Your Funds</span>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant={isEditing ? "destructive" : "default"}
                className={isEditing ? "" : "cyber-button"}
              >
                {isEditing ? "Cancel" : "Edit Amounts"}
              </Button>
            </CardTitle>
            <CardDescription>
              Update your PhonePe and Cash amounts
            </CardDescription>
          </CardHeader>
          
          {isEditing && (
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-primary flex items-center space-x-2">
                      <CreditCard className="w-4 h-4" />
                      <span>PhonePe Amount (₹)</span>
                    </label>
                    <div className="flex space-x-2">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={phonepeInput}
                        onChange={(e) => setPhonepeInput(e.target.value)}
                        placeholder="Enter PhonePe amount"
                        className="cyber-input"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleClear('phonePe')}
                        className="glass-card border-destructive/30 hover:border-destructive/50"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary flex items-center space-x-2">
                      <DollarSign className="w-4 h-4" />
                      <span>Cash Amount (₹)</span>
                    </label>
                    <div className="flex space-x-2">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={cashInput}
                        onChange={(e) => setCashInput(e.target.value)}
                        placeholder="Enter cash amount"
                        className="cyber-input"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleClear('cash')}
                        className="glass-card border-destructive/30 hover:border-destructive/50"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-border/50" />

              <div className="flex justify-center">
                <Button
                  onClick={handleSave}
                  className="cyber-button w-full md:w-auto"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};