export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === undefined || amount === null) {
    return '-';
  }

  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `${currency} ${amount.toFixed(2)}`;
  }
};

export const formatDate = (date) => {
  if (!date) return '-';
  
  try {
    return new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return date.toString();
  }
};

export const formatPercentage = (value, decimals = 1) => {
  if (value === undefined || value === null) {
    return '-';
  }

  try {
    return `${value.toFixed(decimals)}%`;
  } catch (error) {
    console.error('Error formatting percentage:', error);
    return `${value}%`;
  }
};

export const formatNumber = (number, decimals = 0) => {
  if (number === undefined || number === null) {
    return '-';
  }

  try {
    return new Intl.NumberFormat(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(number);
  } catch (error) {
    console.error('Error formatting number:', error);
    return number.toString();
  }
};

export const truncateText = (text, maxLength = 30) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export const getMonthName = (monthNumber) => {
  if (!monthNumber || monthNumber < 1 || monthNumber > 12) {
    console.error('Invalid month number:', monthNumber);
    return '';
  }

  try {
    // Create a date object with any day of the specified month
    const date = new Date(2000, monthNumber - 1, 1);
    // Get the month name using the browser's locale
    return date.toLocaleString(undefined, { month: 'short' });
  } catch (error) {
    console.error('Error getting month name:', error);
    return '';
  }
};
