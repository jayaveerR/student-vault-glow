import { useState } from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StudentLogin } from '@/components/StudentLogin';
import { StudentDashboard } from '@/components/StudentDashboard';
import { AdminDashboard } from '@/components/AdminDashboard';
import { ThemeToggle } from '@/components/ThemeToggle';

type ViewMode = 'login' | 'student' | 'admin';

const Index = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('login');
  const [currentStudent, setCurrentStudent] = useState<string>('');

  const handleStudentLogin = (rollNumber: string) => {
    setCurrentStudent(rollNumber);
    setViewMode('student');
  };

  const handleLogout = () => {
    setCurrentStudent('');
    setViewMode('login');
  };

  const handleAdminAccess = () => {
    setViewMode('admin');
  };

  return (
    <div className="relative min-h-screen">
      {/* Theme Toggle - Fixed position */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Admin Access Button - Only show on login screen */}
      {viewMode === 'login' && (
        <div className="fixed top-4 left-4 z-50">
          <Button
            variant="outline"
            size="icon"
            onClick={handleAdminAccess}
            className="glass-card border-accent/30 hover:border-accent/50 transition-all duration-300"
            title="Admin Dashboard"
          >
            <Settings className="h-4 w-4 text-accent" />
          </Button>
        </div>
      )}

      {/* Main Content */}
      {viewMode === 'login' && (
        <StudentLogin onLogin={handleStudentLogin} />
      )}

      {viewMode === 'student' && (
        <StudentDashboard rollNumber={currentStudent} onLogout={handleLogout} />
      )}

      {viewMode === 'admin' && (
        <AdminDashboard onBack={handleLogout} />
      )}
    </div>
  );
};

export default Index;
