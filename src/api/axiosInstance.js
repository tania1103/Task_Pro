import axios from 'axios';
import ENDPOINTS from './endpoints';

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL,
});

// Interceptor REQUEST: adaugă tokenul de acces din localStorage
axiosInstance.interceptors.request.use(
  config => {
    const persistAuth = localStorage.getItem('persist:auth');
    let accessToken = null;

    if (persistAuth) {
      try {
        const parsed = JSON.parse(persistAuth);
        accessToken = parsed.tokenAccess?.replace(/"/g, '') || null;
      } catch (err) {
        console.error('Eroare la parsarea tokenului din localStorage', err);
      }
    }

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  error => Promise.reject(error)
);

// Interceptor RESPONSE: reînnoiește tokenul dacă expiră (401)
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    if (
      error.response?.status === 401 &&
      error.config &&
      !error.config._isRetry
    ) {
      error.config._isRetry = true;

      try {
        const persistAuth = localStorage.getItem('persist:auth');
        let refreshToken = null;

        if (persistAuth) {
          const parsed = JSON.parse(persistAuth);
          refreshToken = parsed.refreshToken?.replace(/"/g, '') || null;
        }

        if (!refreshToken) throw new Error('Refresh token lipsește.');

        // Trimite request de refresh
        const { data } = await axios.post(
          `${baseURL}/${ENDPOINTS.auth.refreshToken}`,
          {
            refreshToken,
          }
        );

        const newAccessToken = data.user.tokenAccess;

        // Update în localStorage
        const updatedAuth = {
          ...JSON.parse(persistAuth),
          tokenAccess: `"${newAccessToken}"`,
        };
        localStorage.setItem('persist:auth', JSON.stringify(updatedAuth));

        // Retry request original cu token nou
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance.request(error.config);
      } catch (err) {
        console.error('Token refresh eșuat:', err);
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
