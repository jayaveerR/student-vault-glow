export interface StudentRecord {
  rollNumber: string; // Last 2 digits (01-B0)
  phonePe: number;
  cash: number;
  lastUpdated: string;
}

export interface StudentVaultData {
  students: Record<string, StudentRecord>;
}