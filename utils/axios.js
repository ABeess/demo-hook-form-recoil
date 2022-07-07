import axios from 'axios';
import decode from 'jwt-decode';

const getToken = () => {
  if (typeof window !== 'undefined') {
    return (
      JSON.parse(localStorage.getItem('recoil-persist'))?.authentication
        ?.accessToken || ''
    );
  }
};

const setToken = (token) => {
  const authenLocal = JSON.parse(localStorage.getItem('recoil-persist'));
  localStorage.setItem(
    'recoil-persist',
    JSON.stringify({
      ...authenLocal,
      authentication: {
        ...authenLocal.authentication,
        accessToken: token,
      },
    })
  );
};

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  timeout: 60000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const now = new Date().getTime();
    const payload = getToken() && decode(getToken());
    if (payload && payload.exp * 1000 < now) {
      try {
        const response = await axios({
          method: 'POST',
          url: `${process.env.REACT_APP_BASE_URL}/auth/refresh-token`,
          withCredentials: true,
        });
        const newToken = response.data.accessToken;
        setToken(newToken);
      } catch (error) {
        console.log(error);
      }
    }
    config.headers = {
      Authorization: `Bearer ${getToken()}`,
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error.response) || 'Something Wrong'
);
export default axiosInstance;
