import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { deleteBlog, getDashboardStats } from "../../services/Serviceapi"
import { useNavigate } from "react-router-dom"

const Dashboard = () => {
    const navigate = useNavigate()
    const [stats, setStats] = useState({
        total_blogs: 0,
        total_comments: 0,
        user: null,
        blogs: [],
    })
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const [deleteError, setDeleteError] = useState("")
    const [deletingId, setDeletingId] = useState(null)
    const users = JSON.parse(localStorage.getItem("user")) || {}
    const isMounted = useRef(true)

    const fetchStats = useCallback(async () => {
        if (!isMounted.current) return
        setIsLoading(true)
        setError("")
        try {
            const response = await getDashboardStats()
            if (!isMounted.current) return
            setStats({
                total_blogs: response?.total_blogs || 0,
                total_comments: response?.total_comments || 0,
                user: response?.user || null,
                blogs: response?.blogs || [],
            })
        } catch (err) {
            console.error("Dashboard stats error:", err)
            if (isMounted.current) {
                setError("Unable to load dashboard stats right now.")
            }
        } finally {
            if (isMounted.current) {
                setIsLoading(false)
            }
        }
    }, [])

    useEffect(() => {
        isMounted.current = true
        fetchStats()
        return () => {
            isMounted.current = false
        }
    }, [fetchStats])

    const handleDelete = async (blogId) => {
        if (!blogId) return

        const confirmed = window.confirm("Delete this blog? This action cannot be undone.")
        if (!confirmed) return

        setDeletingId(blogId)
        setDeleteError("")
        try {
            await deleteBlog(blogId)
            await fetchStats()
        } catch (err) {
            console.error("Failed to delete blog", err)
            setDeleteError("Unable to delete that blog right now.")
        } finally {
            setDeletingId(null)
        }
    }

    const latestBlog = useMemo(() => {
        if (!stats?.blogs?.length) return null
        return stats.blogs[0]
    }, [stats])

    const formattedLatestDate = useMemo(() => {
        if (!latestBlog?.created_at) return ""
        return new Date(latestBlog.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }, [latestBlog])

    return (
        <div className="min-h-screen bg-slate-50 ">
            <section className="border-b border-slate-200  pb-8">
                <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 pt-10 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
                        <p className="mt-2 text-base text-slate-600">Manage your posts and profile</p>
                    </div>

                    <div className="flex gap-3">
                        <button onClick={() => navigate("/add-blog")} className="rounded-full border border-blue-500 bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600">
                            + New Post
                        </button>
                        {/* <button className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300">
              Settings
            </button> */}
                    </div>
                </div>
            </section>
            <div className="">



                <section className="mx-auto max-w-6xl space-y-6 px-6 py-10 " >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_25px_60px_rgba(15,23,42,0.08)]">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                    Posts Published
                                </p>
                                <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                                    P
                                </span>
                            </div>
                            <p className="mt-4 text-3xl font-bold text-slate-900">{stats.total_blogs}</p>
                            <p className="mt-1 text-md text-slate-500">All-time total</p>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_25px_60px_rgba(15,23,42,0.08)]">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                    Comments
                                </p>
                                <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                                    C
                                </span>
                            </div>
                            <p className="mt-4 text-3xl font-bold text-slate-900">{stats.total_comments}</p>
                            <p className="mt-1 text-md text-slate-500">On your posts</p>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_25px_60px_rgba(15,23,42,0.08)]">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                    Profile
                                </p>
                                <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                                    U
                                </span>
                            </div>
                            <img
                                src={users.picture}
                                alt="profile"
                                className="w-8 h-8 rounded-full mt-4"
                            />
                            <p className="mt-1 text-md text-slate-500">{users.name || ""}</p>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_25px_60px_rgba(15,23,42,0.08)]">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                    Latest Post
                                </p>
                                <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                                    L
                                </span>
                            </div>
                            <p className="mt-4 text-xl font-bold text-slate-900">
                                {latestBlog?.title || "No post yet"}
                            </p>
                            <p className="mt-1 text-md text-slate-500">
                                {formattedLatestDate || "No recent activity"}
                            </p>
                        </div>
                    </div>

                    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_15px_35px_rgba(15,23,42,0.08)]">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                            <div>
                                <h2 className="text-xl font-semibold text-slate-900">Your Blogs</h2>
                                <p className="text-sm text-slate-500">
                                    {isLoading
                                        ? "Fetching your posts..."
                                        : error
                                            ? error
                                            : `You have ${stats.total_blogs} blogs on file.`}
                                </p>
                            </div>
                        </div>
                        {deleteError && (
                            <p className="mt-3 text-sm text-red-600">{deleteError}</p>
                        )}

                        <div className="mt-6 space-y-4">
                            {isLoading && (
                                <p className="text-sm text-slate-500">Loading blogs...</p>
                            )}

                            {!isLoading && !error && stats.blogs.length === 0 && (
                                <p className="text-sm text-slate-500">No posts available yet.</p>
                            )}

                            {!isLoading &&
                                !error &&
                                stats.blogs.map((blog) => (
                                    <article
                                        key={blog.id}
                                        className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 shadow-inner"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <p className="text-lg font-semibold text-slate-900">
                                                    {blog.title}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {new Date(blog.created_at).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric",
                                                    })}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => navigate(`/add-blog?edit=${blog.id}`)}
                                                    className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                    aria-label="Edit blog"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                        className="h-4 w-4"
                                                    >
                                                        <path d="M4 13.5V16h2.5l8.47-8.47-2.5-2.5L4 13.5zm3 1.5H4v-1.5l7.06-7.06 1.5 1.5L7 15z" />
                                                        <path
                                                            d="M17.71 6.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                                                        />
                                                    </svg>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(blog.id)}
                                                    disabled={deletingId === blog.id}
                                                    className="flex h-9 w-9 items-center justify-center rounded-full border border-transparent bg-white text-red-500 transition hover:border-red-200 hover:bg-red-50 disabled:cursor-progress disabled:text-red-300"
                                                    aria-label="Delete blog"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                        className="h-4 w-4"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M6 7a1 1 0 011-1h6a1 1 0 011 1v9a2 2 0 01-2 2H7a2 2 0 01-2-2V7zm2.5-3a1 1 0 011-1h1a1 1 0 011 1H14a1 1 0 110 2H6a1 1 0 010-2h2.5z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        <p className="mt-3 text-md text-slate-600">
                                            {blog.content?.slice(0, 100)}...
                                        </p>
                                    </article>
                                ))}

                            {!isLoading && error && (
                                <p className="text-sm text-red-500">{error}</p>
                            )}
                        </div>
                    </section>
                </section>
            </div>
        </div>
    )
}

export default Dashboard
