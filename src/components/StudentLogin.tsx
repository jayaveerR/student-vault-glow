import { useState } from 'react';
import { LogIn, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { isValidRollNumber } from '@/utils/validation';
import { useToast } from '@/hooks/use-toast';
interface StudentLoginProps {
  onLogin: (rollNumber: string) => void;
}
export const StudentLogin = ({
  onLogin
}: StudentLoginProps) => {
  const [rollNumber, setRollNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {
    toast
  } = useToast();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollNumber) {
      toast({
        title: "Missing Information",
        description: "Please enter your roll number digits",
        variant: "destructive"
      });
      return;
    }
    const normalizedRollNumber = rollNumber.toUpperCase();
    if (!isValidRollNumber(normalizedRollNumber)) {
      toast({
        title: "Invalid Roll Number",
        description: "Please enter valid last 2 digits (01-99, A0-A9, or B0)",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);

    // Simulate loading for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    onLogin(normalizedRollNumber);
    setIsLoading(false);
  };
  return <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-background/50">
      <div className="w-full max-w-md space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-cyber bg-clip-text text-transparent animate-float">MIC Students</h1>
            <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-accent animate-pulse" />
          </div>
          <p className="text-lg text-muted-foreground">
            Enter your roll number digits to access your vault
          </p>
        </div>

        {/* Login Card */}
        <Card className="glass-card border-primary/20 animate-slide-in">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl text-primary">Student Roll Number</CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter the last 2 digits of your roll number
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="rollNumber" className="text-sm font-medium text-foreground">Roll Number </label>
                <Input id="rollNumber" type="text" maxLength={2} value={rollNumber} onChange={e => setRollNumber(e.target.value.toUpperCase())} placeholder="01, A5, B0..." className="cyber-input text-center text-lg font-mono tracking-widest" disabled={isLoading} />
                <p className="text-xs text-muted-foreground text-center">
                  Valid formats: 01-99, A0-A9, B0
                </p>
              </div>

              <Button type="submit" className="w-full cyber-button" disabled={isLoading}>
                {isLoading ? <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    <span>Accessing Vault...</span>
                  </div> : <div className="flex items-center space-x-2">
                    <LogIn className="w-4 h-4" />
                    <span>Enter Vault</span>
                  </div>}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="glass-card border-secondary/20">
          <CardContent className="pt-6">
            <div className="text-center text-sm text-muted-foreground space-y-2">
              <p>💳 Manage your PhonePe & Cash amounts</p>
              <p>🔒 Secure & private access</p>
              <p>📊 Real-time updates
@jayaveer</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};