import React, { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getCategories } from "../../services/Serviceapi"

const posts = [
  {
    title: "The Future of AI in Content Creation",
    excerpt: "Explore how AI is transforming the way we create and consume content in the digital age.",
    tag: "AI-Generated",
    readTime: "5 min read",
    author: "Sarah Chen",
    date: "Mar 11, 2026",
  },
  {
    title: "Machine Learning Trends for 2026",
    excerpt: "A comprehensive look at the latest trends in machine learning and their impact on industries.",
    tag: "AI-Assisted",
    readTime: "8 min read",
    author: "Alex Kumar",
    date: "Mar 10, 2026",
  },
  {
    title: "Building Better AI Products",
    excerpt: "Best practices for developing AI products that users actually want to use.",
    tag: "Human-Written",
    readTime: "6 min read",
    author: "Emma Johnson",
    date: "Mar 9, 2026",
  },
  {
    title: "Designing Trustworthy AI",
    excerpt: "How teams can design AI experiences that inspire confidence and clarity.",
    tag: "Community Picks",
    readTime: "7 min read",
    author: "Leo Park",
    date: "Mar 8, 2026",
  },
]

const defaultCategories = ["All Posts"]

const PostExplore = () => {
  const navigate = useNavigate()
  const handleCardClick = (post) => {
    navigate("/explore/details", { state: { post } })
  }

  const [category, setCategory] = useState("All Posts")
  const [categories, setCategories] = useState(defaultCategories)
  useEffect(() => {
    let mounted = true
    getCategories()
      .then((data) => {
        if (!mounted) return
        const names =
          Array.isArray(data) && data.length
            ? data.map((category) => category.name || category.title || category.label)
            : []
        if (names.length) {
          setCategories(["All Posts", ...names])
        }
      })
      .catch((err) => {
        console.error("Failed to load categories", err)
      })
    return () => {
      mounted = false
    }
  }, [])

  const filteredPosts = useMemo(() => {
    if (category === "All Posts") {
      return posts
    }
    return posts.filter((post) => post.tag === category)
  }, [category])
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
          <div className="flex-1 min-w-[220px]">
            <label className="sr-only" htmlFor="search-posts">
              Search posts
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 12.65z"
                  />
                </svg>
              </span>
              <input
                id="search-posts"
                type="search"
                placeholder="Search posts..."
                className="w-full rounded-full border border-slate-200 bg-white px-10 py-3 text-sm text-slate-600 shadow-sm focus:border-blue-400 focus:outline-none"
              />
            </div>
          </div>
          <div className="relative min-w-[200px]">
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full rounded-full border border-slate-200 bg-white px-5 py-2 pr-10 text-sm font-semibold text-slate-600 shadow-sm transition focus:border-blue-400 focus:outline-none"
            >
              {categories.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <article
              key={post.title}
              role="button"
              tabIndex={0}
              onClick={() => handleCardClick(post)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault()
                  handleCardClick(post)
                }
              }}
              className="cursor-pointer flex flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_25px_60px_rgba(15,23,42,0.08)] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              <div className="h-40 w-full bg-gradient-to-b from-slate-100 via-white to-slate-200" />
              <div className="flex flex-1 flex-col gap-4 px-6 py-6">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700">
                    {post.tag}
                  </span>
                  <span>{post.readTime}</span>
                </div>
                <h2 className="text-lg font-semibold text-slate-900">{post.title}</h2>
                <p className="text-sm leading-relaxed text-slate-500">{post.excerpt}</p>
                <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                  <div className="flex items-center gap-3">
                    <span className="h-9 w-9 rounded-full bg-slate-100" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{post.author}</p>
                      <p className="text-[11px] text-slate-400">{post.date}</p>
                    </div>
                  </div>
                  <button className="text-[11px] font-semibold text-blue-600">Read</button>
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
