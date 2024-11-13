import axios from "axios";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function handleGetTankCategory() {
  try {
    const response = await axios.get(`${apiUrl}/v1/tankcategory`);
    return response;
  } catch (error) {
    console.log(error);
  }
}

export async function handleGetCategory(type : number) {
  try {
    const response = await axios.get(`${apiUrl}/v1/category`,{params: {categoryType: type}});
    return response;
  } catch (error) {
    console.log(error);
  }
}
