import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getBlogs, getCategories } from "../../services/Serviceapi"

const PostExplore = () => {
  const navigate = useNavigate()

  const [posts, setPosts] = useState([])
  const [isLoadingPosts, setIsLoadingPosts] = useState(true)
  const [postError, setPostError] = useState("")
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const handleCardClick = (post) => {
    navigate(`/explore/details/${post.id}`)
  }

  const fetchPosts = async (selectedCategory = category, currentSearch = searchTerm) => {
    try {
      setIsLoadingPosts(true)
      const data = await getBlogs(selectedCategory, currentSearch)
      setPosts(Array.isArray(data) ? data : [])
      setPostError("")
    } catch (err) {
      console.error("Failed to load blog posts", err)
      setPostError("We couldn't fetch the latest posts right now.")
    } finally {
      setIsLoadingPosts(false)
    }
  }

  useEffect(() => {
    getCategories()
      .then((data) => {
        setCategories(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        console.error("Failed to load categories", err)
      })
  }, [])

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchPosts(category, searchTerm)
    }, 300)

    return () => clearTimeout(delay)
  }, [category, searchTerm])

  const showEmptyMessage = !isLoadingPosts && posts.length === 0

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-[#eef1f7]">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <h1 className="text-4xl font-bold text-slate-900">Explore Posts</h1>
          <p className="mt-2 text-base text-slate-600">
            Discover the latest AI-generated and AI-assisted content curated by the community.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1">
            <label className="sr-only" htmlFor="post-search">
              Search posts
            </label>
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 12.65z"
                />
              </svg>
            </span>
            <input
              id="post-search"
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search posts..."
              className="w-full rounded-full border border-slate-200 bg-white px-10 py-3 text-sm text-slate-600 shadow-sm focus:border-blue-400 focus:outline-none"
            />
          </div>

          <div className="relative min-w-[200px]">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-full border border-slate-200 bg-white px-5 py-2 pr-10 text-sm font-semibold text-slate-600 shadow-sm transition focus:border-blue-400 focus:outline-none"
            >
              <option value="All Posts">All Posts</option>

              {categories.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {postError && <p className="mt-6 text-sm text-red-500">{postError}</p>}

        {isLoadingPosts && (
          <p className="mt-6 text-sm text-slate-500">Loading the latest posts...</p>
        )}

        {showEmptyMessage && (
          <p className="mt-6 text-sm text-slate-500">
            No posts match those filters—try another category or search term.
          </p>
        )}

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.id}
              role="button"
              tabIndex={0}
              onClick={() => handleCardClick(post)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault()
                  handleCardClick(post)
                }
              }}
              className="flex cursor-pointer flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_25px_60px_rgba(15,23,42,0.08)]"
            >
              <img
                src={post.image}
                alt={post.title}
                className="h-40 w-full object-cover"
              />

              <div className="flex flex-1 flex-col gap-4 px-6 py-6">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700">
                    {post.category_name}
                  </span>
                </div>

                <h2 className="text-lg font-semibold text-slate-900">{post.title}</h2>

                <p className="text-sm leading-relaxed text-slate-500">
                  {post.content?.slice(0, 100)}...
                </p>

                <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{post.user_name}</p>
                    <p className="text-[11px] text-slate-400">
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button className="text-[11px] font-semibold text-blue-600">
                    Read
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default PostExplore