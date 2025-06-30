import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: string | number): string {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(numericPrice);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function calculateCartTotal(items: any[]): number {
  return items.reduce((total, item) => {
    const price = typeof item.product?.price === 'string' 
      ? parseFloat(item.product.price) 
      : item.product?.price || 0;
    return total + (price * item.quantity);
  }, 0);
}

export function generateOrderId(): string {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

export function validateFile(file: File, allowedTypes: string[], maxSize: number): string | null {
  const fileName = file.name.toLowerCase();
  const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
  
  if (!allowedTypes.some(type => fileName.endsWith(type.toLowerCase()))) {
    return `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`;
  }
  
  if (file.size > maxSize) {
    const maxSizeMB = maxSize / (1024 * 1024);
    return `File size too large. Maximum size: ${maxSizeMB}MB`;
  }
  
  return null;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
