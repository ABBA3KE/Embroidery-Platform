// // import axios from 'axios';

// // const api = axios.create({
// //   baseURL: '/api',
// //   withCredentials: true,
// //   headers: {
// //     'Content-Type': 'application/json',
// //   },
// // });

// const api = axios.create({
//   baseURL: '/api',
//   withCredentials: true,
// });
// // Attach the bearer token (kept as a fallback alongside the httpOnly cookie)
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // Normalize error messages so components can just read err.message
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const message =
//       error.response?.data?.message || error.message || 'Something went wrong. Please try again.';
//     return Promise.reject(new Error(message));
//   }
// );

// export default api;

import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);

export default api;
