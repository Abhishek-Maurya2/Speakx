import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL;

export const search = async (data) => {
  try {
    const response = await axios.post(`${baseURL}/search/`, data);
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};
