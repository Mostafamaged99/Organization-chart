import axios from "axios";
import { BASE_URL } from "../consts/consts";

export async function getData(endpoint) {
  return await axios
    .get(`${BASE_URL}/${endpoint}`)
    .then((res) => res)
    .catch((err) => console.log(err));
}
