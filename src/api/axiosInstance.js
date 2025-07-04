import axios from 'axios';
import ENDPOINTS from './endpoints';

const baseURL =
  process.env.REACT_APP_API_URL || 'https://task-pro-backend-5kph.onrender.com';

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// 🔐 Interceptor REQUEST — Adaugă token din localStorage (dacă există) + logging pentru carduri
axiosInstance.interceptors.request.use(
  config => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Logging detaliat pentru cereri POST sau PATCH către endpoint-ul cards
    if ((config.method === 'post' || config.method === 'patch') &&
        config.url && config.url.includes('/api/cards')) {
      console.log(`${config.method.toUpperCase()} ${config.url} request:`, {
        data: config.data,
        headers: config.headers
      });
    }

    return config;
  },
  error => Promise.reject(error)
);

// Variabile pentru a gestiona refresh token în mod eficient
let isRefreshing = false;
let refreshSubscribers = [];

// Funcție pentru a executa toate callback-urile în așteptare
const onRefreshed = (newToken) => {
  refreshSubscribers.forEach(callback => callback(newToken));
  refreshSubscribers = [];
};

// Funcție pentru a adăuga noi callback-uri
const addSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

// 🔁 Interceptor RESPONSE — Reînnoiește tokenul automat la 401 + logging îmbunătățit
axiosInstance.interceptors.response.use(
  response => {
    // Log successful responses for card operations
    if (response.config.url && response.config.url.includes('/api/cards')) {
      console.log(`Response from ${response.config.url}:`, response.data);
    }
    return response;
  },
  async error => {
    const originalRequest = error.config;

    // 🔌 Fără răspuns (server picat, offline, etc.)
    if (!error.response) {
      console.error('❌ Eroare rețea sau server indisponibil:', error.message);
      return Promise.reject(error);
    }

    // Log detailed info for errors (îmbunătățit)
    if (error.response.status >= 400) {
      console.error(`${error.response.status} Error:`, {
        url: originalRequest.url,
        method: originalRequest.method,
        requestData: typeof originalRequest.data === 'string'
          ? JSON.parse(originalRequest.data)
          : originalRequest.data,
        responseData: error.response.data,
        validationErrors: error.response.data?.errors || [],
        message: error.response.data?.message || `Unknown error (${error.response.status})`
      });

      // Tratamare specială pentru erorile 404 pentru carduri
      if (error.response.status === 404 && originalRequest.url.includes('/api/cards')) {
        console.warn('⚠️ 404 la endpoint-ul de carduri - probabil nu există carduri încă');
        // Nu facem nimic special, lasăm să ajungă în handler-ul Redux
      }
    }

    const isUnauthorized =
      error.response.status === 401 &&
      !originalRequest._isRetry &&
      !originalRequest.url.includes(ENDPOINTS.auth.refreshToken);

    if (isUnauthorized) {
      // Evităm să facem refresh de mai multe ori în paralel
      if (isRefreshing) {
        // Punem requestul original în așteptare
        return new Promise((resolve) => {
          addSubscriber((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      originalRequest._isRetry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          console.warn('❌ Refresh token lipsește din localStorage');
          throw new Error('Refresh token lipsește');
        }

        console.log('🔄 Începe refresh token cu:', refreshToken.substring(0, 10) + '...');

        const { data } = await axios.post(
          `${baseURL}${ENDPOINTS.auth.refreshToken}`,
          { refreshToken },
          {
            withCredentials: true,
            // Crește timeout-ul pentru a gestiona latența serverului
            timeout: 10000
          }
        );

        const newToken = data.token;
        if (!newToken) {
          throw new Error('❌ Token nou lipsă în răspuns');
        }

        localStorage.setItem('accessToken', newToken);

        // Actualizăm tokenul pe requestul inițial și pe instanță
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${newToken}`;

        // Executăm toate requesturile în așteptare
        onRefreshed(newToken);
        isRefreshing = false;

        return axiosInstance(originalRequest); // retrimitere
      } catch (refreshError) {
        console.error('🔁 Token refresh eșuat:', refreshError.message);
        if (refreshError.response) {
          console.error('Detalii răspuns:', refreshError.response.data);
        }
        isRefreshing = false;

        // Curățăm tokenurile locale doar în caz de erori de autorizare
        // Alte erori (rețea, timeout) nu ar trebui să ducă la deconectare
        if (refreshError.response && (refreshError.response.status === 401 || refreshError.response.status === 403)) {
          console.warn('🔑 Șterg token-urile din cauza unei erori de autorizare');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');

          // Redirecționăm la login dacă este necesar
          // window.location.href = '/auth/login';
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;