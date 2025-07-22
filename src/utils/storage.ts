import { StudentRecord, StudentVaultData } from '@/types';

const STORAGE_KEY = 'student-vault-data';

export const getStorageData = (): StudentVaultData => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { students: {} };
  } catch {
    return { students: {} };
  }
};

export const saveStorageData = (data: StudentVaultData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save data:', error);
  }
};

export const getStudentRecord = (rollNumber: string): StudentRecord | null => {
  const data = getStorageData();
  return data.students[rollNumber] || null;
};

export const saveStudentRecord = (rollNumber: string, record: Partial<StudentRecord>): void => {
  const data = getStorageData();
  const existing = data.students[rollNumber] || {
    rollNumber,
    phonePe: 0,
    cash: 0,
    lastUpdated: new Date().toISOString()
  };
  
  data.students[rollNumber] = {
    ...existing,
    ...record,
    lastUpdated: new Date().toISOString()
  };
  
  saveStorageData(data);
};

export const deleteStudentRecord = (rollNumber: string): void => {
  const data = getStorageData();
  delete data.students[rollNumber];
  saveStorageData(data);
};

export const getAllStudents = (): StudentRecord[] => {
  const data = getStorageData();
  return Object.values(data.students);
};

export const clearStudentField = (rollNumber: string, field: 'phonePe' | 'cash'): void => {
  const data = getStorageData();
  if (data.students[rollNumber]) {
    data.students[rollNumber][field] = 0;
    data.students[rollNumber].lastUpdated = new Date().toISOString();
    saveStorageData(data);
  }
};