import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL || "http://13.235.80.188/questions";

export const search = async (data) => {
  try {
    const response = await axios.post(`${baseURL}/search/`, data);
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};
