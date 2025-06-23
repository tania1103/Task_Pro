import axios from 'axios';
import ENDPOINTS from './endpoints';

// Folosim variabila de mediu pentru API URL
const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Creăm instanța axios configurată pentru backend
const axiosInstance = axios.create({
  baseURL,
});

// Interceptor request - adaugă tokenul în header dacă există
axiosInstance.interceptors.request.use(
  config => {
    // Tokenul de acces salvat după login
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Interceptor response - încearcă refresh token la 401 Unauthorized
axiosInstance.interceptors.response.use(
  response => response, // dacă totul e ok, returnează răspunsul

  async error => {
    const originalRequest = error.config;

    // Dacă primim 401, iar cererea nu a fost retry încă
    if (
      error.response &&
      error.response.status === 401 &&
      originalRequest &&
      !originalRequest._isRetry
    ) {
      originalRequest._isRetry = true;

      try {
        // Preluăm refreshToken-ul salvat în localStorage
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          // Dacă nu există refresh token, respinge eroarea
          return Promise.reject(error);
        }

        // Cerem token nou de acces la endpoint-ul de refresh token al backend-ului
        const { data } = await axios.post(
          `${baseURL}/${ENDPOINTS.auth.refreshToken}`,
          { refreshToken }
        );

        // Salvăm noul token de acces
        localStorage.setItem(
          'accessToken',
          data.token || data.user?.tokenAccess
        );

        // Actualizăm header-ul axios cu noul token
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${
          data.token || data.user?.tokenAccess
        }`;

        // Reia cererea originală cu tokenul nou
        return axiosInstance.request(originalRequest);
      } catch (refreshError) {
        // Dacă refresh token eșuează, respinge eroarea
        return Promise.reject(refreshError);
      }
    }

    // Pentru alte erori, respinge direct
    return Promise.reject(error);
  }
);

export default axiosInstance;
