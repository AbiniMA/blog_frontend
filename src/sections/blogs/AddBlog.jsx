import React, { useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  createBlog,
  generateBlogDescription,
  getBlogDetail,
  getCategories,
  getCurrentUser,
  updateBlog,
} from "../../services/Serviceapi"

const resolveCategoryId = (blog) => {
  if (!blog?.category) {
    return ""
  }

  if (typeof blog.category === "object") {
    return blog.category?.id || ""
  }

  return blog.category
}

const AddBlog = () => {
  const location = useLocation()
  const editQueryId = useMemo(
    () => new URLSearchParams(location.search).get("edit") || "",
    [location.search]
  )

  const [formValues, setFormValues] = useState({
    title: "",
    category: "",
    content: "",
    image: null,
    describe: "",
  })
  const [existingImage, setExistingImage] = useState("")
  const [categories, setCategories] = useState([])
  const [user, setUser] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [status, setStatus] = useState({ message: "", type: "" })
  const [isFetchingBlog, setIsFetchingBlog] = useState(false)
  const [blogLoadError, setBlogLoadError] = useState("")
  const [editingBlogId, setEditingBlogId] = useState("")

  const isEditMode = Boolean(editingBlogId)

  useEffect(() => {
    let mounted = true

    getCategories()
      .then((data) => {
        if (!mounted) return
        const safeCategories = Array.isArray(data) ? data : []
        setCategories(safeCategories)
      })
      .catch((err) => {
        console.error("Unable to fetch categories", err)
      })

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (categories.length && !formValues.category) {
      setFormValues((prev) => ({
        ...prev,
        category: categories[0].id,
      }))
    }
  }, [categories, formValues.category])

  useEffect(() => {
    let mounted = true

    getCurrentUser()
      .then((data) => {
        if (!mounted) return
        setUser(data)
      })
      .catch((err) => {
        console.error("Unable to fetch user", err)
      })

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (!editQueryId) {
      setEditingBlogId("")
      setBlogLoadError("")
      setExistingImage("")
      return
    }

    let active = true
    setIsFetchingBlog(true)
    setBlogLoadError("")
    setStatus({ message: "", type: "" })

    getBlogDetail(editQueryId)
      .then((data) => {
        if (!active) return

        setEditingBlogId(data?.id || editQueryId)
        setExistingImage(data?.image || "")

        setFormValues({
          title: data?.title || "",
          category: resolveCategoryId(data),
          content: data?.content || "",
          image: null,
          describe: "",
        })
      })
      .catch((err) => {
        console.error("Unable to load blog for editing", err)
        if (active) {
          setBlogLoadError("Unable to load that blog. Try refreshing or create a new one.")
          setEditingBlogId("")
          setExistingImage("")
        }
      })
      .finally(() => {
        if (active) {
          setIsFetchingBlog(false)
        }
      })

    return () => {
      active = false
    }
  }, [editQueryId])

  const handleChange = (field) => (event) => {
    const value =
      field === "image" ? event.target.files?.[0] || null : event.target.value

    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleGenerateContent = async () => {
    if (!formValues.describe.trim()) {
      setStatus({
        message: "Describe what you'd like the AI to cover before generating.",
        type: "error",
      })
      return
    }

    setIsGenerating(true)
    setStatus({ message: "", type: "" })

    try {
      const payload = {
        title: formValues.describe.trim(),
      }

      const result = await generateBlogDescription(payload)
      const generatedContent = result?.content || result?.description || ""

      if (generatedContent) {
        setFormValues((prev) => ({
          ...prev,
          content: generatedContent,
        }))
        setStatus({
          message: "AI-generated content inserted into the editor.",
          type: "success",
        })
      } else {
        setStatus({
          message: "We didn't receive content from the AI service.",
          type: "error",
        })
      }
    } catch (err) {
      console.error("Generate content failed", err)
      setStatus({
        message: "Failed to generate blog content right now.",
        type: "error",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const navigate = useNavigate()
  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!user?.id) {
      setStatus({
        message: "You need to be signed in to add a blog.",
        type: "error",
      })
      return
    }

    if (!formValues.title.trim() || !formValues.content.trim()) {
      setStatus({
        message: "Provide both a title and content before submitting.",
        type: "error",
      })
      return
    }

    if (!formValues.category) {
      setStatus({
        message: "Select a category before publishing.",
        type: "error",
      })
      return
    }

    const payload = new FormData()
    payload.append("user", user.id)
    payload.append("category", formValues.category)
    payload.append("title", formValues.title)
    payload.append("content", formValues.content)

    if (formValues.image) {
      payload.append("image", formValues.image)
    }

    setIsSubmitting(true)
    setStatus({ message: "", type: "" })

    try {
      if (isEditMode) {
        const updated = await updateBlog(editingBlogId, payload)
        const resolvedCategory = resolveCategoryId(updated) || formValues.category

        setFormValues((prev) => ({
          ...prev,
          title: updated?.title || prev.title,
          content: updated?.content || prev.content,
          category: resolvedCategory,
          image: null,
        }))

        setExistingImage(updated?.image || existingImage)

        setStatus({
          message: "Blog updated successfully.",
          type: "success",
        })
        navigate("/dashboard")
      } else {
        const created = await createBlog(payload)

        setFormValues({
          title: "",
          category: categories[0]?.id || "",
          content: "",
          image: null,
          describe: "",
        })

        setExistingImage(created?.image || "")

        setStatus({
          message: "Blog posted successfully.",
          type: "success",
        })
      }
    } catch (err) {
      console.error("Blog submission failed", err)
      setStatus({
        message: "Unable to publish the blog right now.",
        type: "error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const helperText = useMemo(() => {
    if (status.type === "error") return status.message
    if (status.type === "success") return status.message
    if (!user) return "Fetching your profile..."

    return isEditMode
      ? `Editing as ${user.name || user.email}`
      : `Publishing as ${user.name || user.email}`
  }, [status, user, isEditMode])

  const previewImage = useMemo(() => {
    if (!formValues.image) return ""
    return URL.createObjectURL(formValues.image)
  }, [formValues.image])

  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage)
      }
    }
  }, [previewImage])

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto w-full max-w-4xl space-y-8 rounded-3xl border border-slate-200 bg-white px-6 py-10 shadow-xl">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">
            {isEditMode ? "Edit blog" : "Create a new blog"}
          </h1>

          <p className="text-sm leading-relaxed text-slate-500">
            {isEditMode
              ? "Adjust fields, refresh the AI content, and save your updates."
              : "Fill out the details, pick a category, include optional media, and hit publish."}
          </p>

          {isFetchingBlog && (
            <p className="text-xs text-slate-500">Loading blog for editing...</p>
          )}

          {blogLoadError && (
            <p className="text-xs text-red-500">{blogLoadError}</p>
          )}
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="blog-title" className="text-sm font-semibold text-slate-600">
              Title
            </label>
            <input
              id="blog-title"
              value={formValues.title}
              onChange={handleChange("title")}
              placeholder="Give your blog a catchy title"
              className="mt-2 block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label htmlFor="blog-describe" className="text-sm font-semibold text-slate-600">
              Describe
            </label>
            <input
              id="blog-describe"
              value={formValues.describe}
              onChange={handleChange("describe")}
              placeholder="Tell the AI what topics, tone, or examples to include"
              className="mt-2 block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
            <p className="mt-1 text-xs text-slate-500">
              This text is sent to the AI generator (instead of the title) when you hit Generate outline.
            </p>
          </div>

          <div>
            <label htmlFor="blog-category" className="text-sm font-semibold text-slate-600">
              Category
            </label>
            <div className="mt-2 flex">
              <select
                id="blog-category"
                value={formValues.category}
                onChange={handleChange("category")}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="blog-content" className="text-sm font-semibold text-slate-600">
                Content
              </label>
              <button
                type="button"
                onClick={handleGenerateContent}
                disabled={isGenerating}
                className="rounded-full border border-slate-200 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 shadow-sm transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isGenerating ? "Generating..." : "Generate outline"}
              </button>
            </div>

            <textarea
              id="blog-content"
              value={formValues.content}
              onChange={handleChange("content")}
              rows={8}
              placeholder="Outline your insights, add examples, and share your perspective."
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-700 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label htmlFor="blog-image" className="text-sm font-semibold text-slate-600">
              Feature image (optional)
            </label>

            <input
              id="blog-image"
              type="file"
              accept="image/*"
              onChange={handleChange("image")}
              className="mt-2 w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-blue-600 focus:outline-none"
            />

            {formValues.image && previewImage && (
              <div className="mt-4">
                <p className="mb-2 text-xs text-slate-500">New image selected:</p>
                <img
                  src={previewImage}
                  alt="New selected preview"
                  className="h-48 w-full rounded-2xl border border-slate-200 object-cover"
                />
              </div>
            )}

            {!formValues.image && existingImage && (
              <div className="mt-4">
                <p className="mb-2 text-xs text-slate-500">Current image:</p>
                <img
                  src={existingImage}
                  alt="Current blog"
                  className="h-48 w-full rounded-2xl border border-slate-200 object-cover"
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">{helperText}</p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? isEditMode
                  ? "Saving..."
                  : "Publishing..."
                : isEditMode
                ? "Save changes"
                : "Publish blog"}
            </button>
          </div>
        </form>

        {status.message && (
          <p
            className={`rounded-2xl border px-4 py-3 text-sm ${
              status.type === "error"
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            {status.message}
          </p>
        )}
      </div>
    </div>
  )
}

export default AddBlog
