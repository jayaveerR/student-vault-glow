import * as XLSX from 'xlsx';
import { StudentRecord } from '@/types';

export const exportToExcel = (students: StudentRecord[], filename: string = 'student-vault-data') => {
  const exportData = students.map(student => ({
    'Roll Number (Last 2 digits)': student.rollNumber,
    'PhonePe Amount (₹)': student.phonePe,
    'Cash Amount (₹)': student.cash,
    'Total Amount (₹)': student.phonePe + student.cash,
    'Last Updated': new Date(student.lastUpdated).toLocaleString('en-IN')
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  
  // Auto-size columns
  const colWidths = [
    { wch: 25 }, // Roll Number
    { wch: 18 }, // PhonePe Amount
    { wch: 18 }, // Cash Amount
    { wch: 18 }, // Total Amount
    { wch: 20 }  // Last Updated
  ];
  worksheet['!cols'] = colWidths;
  
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Student Data');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export const exportToCSV = (students: StudentRecord[], filename: string = 'student-vault-data') => {
  const exportData = students.map(student => ({
    'Roll Number (Last 2 digits)': student.rollNumber,
    'PhonePe Amount (₹)': student.phonePe,
    'Cash Amount (₹)': student.cash,
    'Total Amount (₹)': student.phonePe + student.cash,
    'Last Updated': new Date(student.lastUpdated).toLocaleString('en-IN')
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};