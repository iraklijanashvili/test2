// API კონფიგურაცია

// ბექენდის მისამართი გარემოს მიხედვით
// ლოკალური გარემოსთვის გამოიყენეთ localhost
// დაჰოსტილი ფრონტენდისთვის გამოიყენეთ დაჰოსტილი ბექენდის მისამართი
// ან ლოკალური IP მისამართი დეველოპმენტისთვის
export const API_BASE_URL = (() => {
  // ლოკალური გარემო
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:5000';
  }
  
  // დაჰოსტილი გარემო - beamish-fox-7ea396.netlify.app
  if (window.location.hostname.includes('netlify.app')) {
    // დაჰოსტილი ბექენდის მისამართი Render.com-ზე
    // როდესაც ბექენდი დაჰოსტილი იქნება, ჩაანაცვლეთ ეს URL დაჰოსტილი ბექენდის რეალური მისამართით
    return 'https://universal-toolkit-server.onrender.com'; // დაჰოსტილი ბექენდის URL
  }
  
  // სხვა გარემოებისთვის
  return 'http://94.137.168.147:5000';
})();

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