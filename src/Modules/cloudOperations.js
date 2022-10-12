import axios from "axios";
export async function uploadImage(serverurl, file) {
  const formData = new FormData();
  formData.append("dropbox", file);
  const response = await axios.post(serverurl, formData);
  return response;
}
export async function getImage(serverurl) {
  const response = await axios.get(serverurl);
  return response;
}

export async function OCROperation(serverurl, file) {
  const formData = new FormData();
  formData.append("dropbox", file);
  const response = await axios.post(serverurl, formData);
  return response;
}
