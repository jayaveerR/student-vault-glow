export const isValidRollNumber = (rollNumber: string): boolean => {
  if (!rollNumber || rollNumber.length !== 2) return false;
  
  const normalized = rollNumber.toUpperCase();
  
  // Check for valid patterns: 01-99, A0-A9, B0
  if (/^[0-9]{2}$/.test(normalized)) {
    const num = parseInt(normalized);
    return num >= 1 && num <= 99;
  }
  
  if (/^A[0-9]$/.test(normalized)) {
    return true;
  }
  
  if (normalized === 'B0') {
    return true;
  }
  
  return false;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const generateRollNumberOptions = (): string[] => {
  const options: string[] = [];
  
  // Add 01-99
  for (let i = 1; i <= 99; i++) {
    options.push(i.toString().padStart(2, '0'));
  }
  
  // Add A0-A9
  for (let i = 0; i <= 9; i++) {
    options.push(`A${i}`);
  }
  
  // Add B0
  options.push('B0');
  
  return options;
};