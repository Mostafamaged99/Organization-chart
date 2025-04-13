import axios from "axios";
import { BASE_URL } from "../consts/consts";

export async function getData(endpoint) {
  return await axios
    .get(`${BASE_URL}/${endpoint}`)
    .then((res) => res)
    .catch((err) => console.log(err));
}

export async function editData(endpoint, id, updatedData) {
  return await axios
    .put(`${BASE_URL}/${endpoint}/${id}`, updatedData)
    .then((res) => res)
    .catch((err) => console.log(err));
}

export async function deleteData(endpoint, id) {
  return await axios
    .delete(`${BASE_URL}/${endpoint}/${id}`)
    .then((res) => res)
    .catch((err) => console.log(err));
}

export async function postData(endpoint, newData) {
  return await axios
    .post(`${BASE_URL}/${endpoint}`, newData)
    .then((res) => res)
    .catch((err) => console.log(err));
}
