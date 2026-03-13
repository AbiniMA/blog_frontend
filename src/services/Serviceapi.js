import apiInstance from "./apiInstance"

const handleResponse = (response) => {
  if (response && response.data !== undefined) {
    return response.data
  }
  return response
}

const GOOGLE_LOGIN_PATH =
  process.env.REACT_APP_GOOGLE_LOGIN_ENDPOINT || "user/google-login/"

export const getCategories = async () => {
  const response = await apiInstance.get("blog/categories/")
  return handleResponse(response)
}

export const loginWithGoogleCode = async (code) => {
  const response = await apiInstance.post(GOOGLE_LOGIN_PATH, { code })
  return handleResponse(response)
}

export default {
  getCategories,
  loginWithGoogleCode,
}
