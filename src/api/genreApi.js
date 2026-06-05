import axiosInstance from './axiosInstance';

export const getGenres = () => axiosInstance.get('/genres');
export const createGenre = (name) => axiosInstance.post('/admin/genres', { name });
export const updateGenre = (id, name) => axiosInstance.put(`/admin/genres/${id}`, { name });
export const deleteGenre = (id) => axiosInstance.delete(`/admin/genres/${id}`);
