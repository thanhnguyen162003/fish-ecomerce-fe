import axios from "axios";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default async function handleGetTankCategory() {
  try {
    const response = await axios.get(`${apiUrl}/v1/tankcategory`);
    return response;
  } catch (error) {
    console.log(error);
  }
}
