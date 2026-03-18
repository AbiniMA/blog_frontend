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

export const getBlogs = async (catId, searchText) => {
  const response = await apiInstance.get(`/blog/blogs/?category=${catId}&search=${searchText}`)
  return handleResponse(response)
}

export const getBlogDetail = async (id) => {
  if (!id) {
    throw new Error("Blog ID is required for detail requests")
  }
  const response = await apiInstance.get(`blog/blogs/${id}/`)
  return handleResponse(response)
}

export const getDashboardStats = async () => {
  const response = await apiInstance.get("blog/dashboard/stats/")
  return handleResponse(response)
}



export const generateBlogDescription = async (payload) => {
  const response = await apiInstance.post("generate-blog/generate-description/", payload)
  return handleResponse(response)
}

export const deleteBlog = async (id) => {
  const response = await apiInstance.delete(`blog/blogs/${id}/`)
  return handleResponse(response)
}

export const createBlog = async (payload) => {
  const response = await apiInstance.post("blog/blogs/", payload, {
    withCredentials: true, // keep this if using session auth
  })
  return handleResponse(response)
}

export const updateBlog = async (id, payload) => {
  const response = await apiInstance.put(`blog/blogs/${id}/`, payload, {
    withCredentials: true,
  })
  return handleResponse(response)
}

export const loginWithGoogleCode = async (code) => {
  const response = await apiInstance.post(GOOGLE_LOGIN_PATH, { code },{ withCredentials: true })
  return handleResponse(response)
}

export const postComment = async (blogId, payload) => {
  const response = await apiInstance.post(`/blog/blogs/${blogId}/comments/`, payload, { withCredentials: true })
  return handleResponse(response)

}

export const getCurrentUser = async () => {
  const response = await apiInstance.get("/user/user/")
  return handleResponse(response)
}
export default {
  getCategories,
  getBlogs,
  getBlogDetail,
  loginWithGoogleCode,
  postComment,
  getCurrentUser,
  createBlog,
  generateBlogDescription,
  deleteBlog,
  updateBlog,
  getDashboardStats,
}
