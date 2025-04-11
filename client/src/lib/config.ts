// API კონფიგურაცია

// ბექენდის მისამართი გარემოს მიხედვით
// ბექენდი ყოველთვის ლოკალურად გაეშვება
export const API_BASE_URL = 'http://localhost:3000';

// API მოთხოვნების კონფიგურაცია
export const API_CONFIG = {
  // CORS credentials-ის ჩართვა
  credentials: 'include' as const,
  headers: {
    'Content-Type': 'application/json',
  },
};

// API მოთხოვნის შექმნის ფუნქცია
export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    ...API_CONFIG,
    ...options,
    headers: {
      ...API_CONFIG.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}