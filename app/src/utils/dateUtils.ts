import { format } from 'date-fns';

export const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return 'N/A';
  try {
    // Using PPPppp for more detail as in original component
    return format(new Date(dateString), 'PPPppp');
  } catch {
    return 'Invalid Date';
  }
};

// Add other date-related utilities here if needed 