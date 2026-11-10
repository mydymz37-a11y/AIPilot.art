/**
 * CSV Parsing and Export Utilities
 */

export interface CSVRow {
  [key: string]: string | number;
}

/**
 * Convert an array of objects to a CSV string
 */
export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  columnMap?: { key: keyof T; label: string }[]
): string {
  if (!data || data.length === 0) return '';

  const columns = columnMap || (Object.keys(data[0]).map((k) => ({ key: k as keyof T, label: k })));
  const headerLine = columns.map((col) => `"${String(col.label).replace(/"/g, '""')}"`).join(',');

  const rows = data.map((item) => {
    return columns
      .map((col) => {
        const val = item[col.key];
        if (val === null || val === undefined) return '""';
        return `"${String(val).replace(/"/g, '""')}"`;
      })
      .join(',');
  });

  return [headerLine, ...rows].join('\n');
}

/**
 * Parse CSV text into an array of object records
 * Handles quotes, commas inside quotes, and line breaks safely
 */
export function parseCSV(csvText: string): Record<string, string>[] {
  const clean = csvText.trim();
  if (!clean) return [];

  const lines = clean.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  // Parse header
  const parseLine = (line: string): string[] => {
    const values: string[] = [];
    let current = '';
    let insideQuote = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (insideQuote && line[i + 1] === '"') {
          current += '"';
          i++; // skip escaped quote
        } else {
          insideQuote = !insideQuote;
        }
      } else if (char === ',' && !insideQuote) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    return values.map((v) => v.replace(/^"|"$/g, '').trim());
  };

  const headers = parseLine(lines[0]);
  const records: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rowValues = parseLine(lines[i]);
    if (rowValues.length === 0 || (rowValues.length === 1 && !rowValues[0])) continue;

    const rowObj: Record<string, string> = {};
    headers.forEach((h, index) => {
      rowObj[h] = rowValues[index] ?? '';
    });
    records.push(rowObj);
  }

  return records;
}

/**
 * Triggers browser download for generated CSV
 */
export function downloadCSV(csvContent: string, fileName: string): void {
  if (typeof window === 'undefined') return;
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName.endsWith('.csv') ? fileName : `${fileName}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
