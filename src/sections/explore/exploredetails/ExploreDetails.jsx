import React, { useEffect, useRef, useState } from "react"
import { useLocation, useParams } from "react-router-dom"
import { getBlogDetail, postComment, getCurrentUser } from "../../../services/Serviceapi"

const formatDate = (value) => {
  if (!value) return ""
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

const timeAgo = (value) => {
  if (!value) return ""
  const now = new Date()
  const date = new Date(value)
  const seconds = Math.floor((now - date) / 1000)

  if (seconds < 60) return "Just now"

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`

  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`

  return formatDate(value)
}

  const TOAST_DURATION = 2800


const ExploreDetails = () => {
  const location = useLocation()
  const cachedPost = location.state?.cachedPost
  const params = useParams()
  const postId = params?.id ?? cachedPost?.id

  const [post, setPost] = useState(cachedPost ?? null)
  const [isLoadingDetail, setIsLoadingDetail] = useState(!cachedPost)
  const [detailError, setDetailError] = useState("")
  const [commentText, setCommentText] = useState("")
  const [isPostingComment, setIsPostingComment] = useState(false)
  const [commentError, setCommentError] = useState("")

  const timerRef = useRef(null)

    useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current)
      }
    }
  }, [])

  const fetchBlogDetail = async () => {
    if (!postId) return

    try {
      setIsLoadingDetail(true)
      setDetailError("")

      const data = await getBlogDetail(postId)
      setPost(data.data || data)
      const user = await getCurrentUser();
      console.log("Logged in user:", user);
    } catch (err) {
      console.error("Failed to load blog detail", err)
      setDetailError("We couldn't load this story right now.")
    } finally {
      setIsLoadingDetail(false)
    }
  }

  useEffect(() => {
    fetchBlogDetail()
  }, [postId])
  const [toast, setToast] = useState("")

  const showToast = (message) => {
    setToast(message)
    if (timerRef.current) {
      window.clearTimeout(timerRef.current)
    }
    timerRef.current = window.setTimeout(() => setToast(""), TOAST_DURATION)
  }
  const handlePostComment = async () => {
    if (!commentText.trim()) return

    const user = JSON.parse(localStorage.getItem("user"))

    if (!user) {
      showToast("Log in first to explore posts.")
      return
    }


    try {
      setIsPostingComment(true)
      setCommentError("")

      await postComment(postId, {
        blog: Number(postId),
        user: user?.id,   // 🔥 important
        content: commentText,
      })

      setCommentText("")
      fetchBlogDetail()
    } catch (err) {
      console.error("Failed to post comment", err)
      setCommentError("Unable to post comment right now.")
    } finally {
      setIsPostingComment(false)
    }
  }

  const [shareMessage, setShareMessage] = useState("")
  const handleShare = async () => {
    const shareUrl = window.location.href

    const shareData = {
      title: post?.title || "Check out this blog post",
      text: post?.content
        ? `${post.content.slice(0, 120)}...`
        : "Read this blog post",
      url: shareUrl,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
        return
      }

      await navigator.clipboard.writeText(shareUrl)
      setShareMessage("Link copied!")
      setTimeout(() => setShareMessage(""), 2000)
    } catch (err) {
      console.error("Share failed", err)
      setShareMessage("Unable to share right now.")
      setTimeout(() => setShareMessage(""), 2000)
    }
  }
  return (
    <div className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-10">
          {post && (
            <div className="space-y-3">
              <span className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {post.category_name ?? "Community"}
              </span>
              <h1 className="text-4xl font-bold text-slate-900">{post.title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-md text-slate-500">
                <span>{post.user_name || "Community"}</span>
                <span>·</span>
                <span>{formatDate(post.created_at)}</span>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="rounded-[28px] border border-slate-200 bg-gradient-to-b from-slate-100 via-white to-slate-200 p-1 shadow-[0_25px_80px_rgba(15,23,42,0.12)]">
          {post?.image ? (
            <img
              src={post.image}
              alt={post.title}
              className="h-56 w-full rounded-[28px] object-cover"
              loading="lazy"
            />
          ) : (
            <div className="h-56 w-full rounded-[28px] bg-white" />
          )}
        </div>

        {isLoadingDetail && (
          <p className="mt-4 text-sm text-slate-500">
            Refreshing the latest version of this story...
          </p>
        )}

        {detailError && (
          <p className="mt-4 text-sm text-red-500">{detailError}</p>
        )}

        {post?.content && (
          <p className="mt-6 whitespace-pre-line text-[20px] leading-relaxed text-slate-600">
            {post.content}
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-slate-100 pt-6 text-sm text-slate-500">
          <span className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-md font-bold text-slate-500">
              💬
            </span>
            <span className="text-lg font-semibold">            {post?.comments_count || 0}
            </span>
          </span>

          <button
            onClick={handleShare}
            className="rounded-full  bg-blue-500  border border-slate-200 px-3 py-1 text-md font-semibold text-white transition hover:border-slate-400"
          >
            Share
          </button>
        </div>

        <div className="mt-10 rounded-[20px] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
          <h4 className="text-xl  font-semibold text-slate-900">Comments</h4>
          <p className="text-md text-slate-500">Share your thoughts…</p>

          <textarea
            rows={3}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 focus:border-slate-400 focus:outline-none"
            placeholder="Tell us what you found interesting."
          />

          {commentError && (
            <p className="mt-3 text-sm text-red-500">{commentError}</p>
          )}

          <button
            onClick={handlePostComment}
            disabled={isPostingComment || !commentText.trim()}
            className="mt-4 rounded-2xl bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPostingComment ? "Posting..." : "Post Comment"}
          </button>

          <div className="mt-8 border-t border-slate-200 pt-6">
            {post?.comments?.length > 0 ? (
              <div className="space-y-6">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-600">
                      {comment.user_name?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                    <div className="flex-1">
                      <h5 className="text-lg font-semibold text-slate-900">
                        {comment.user_name}
                      </h5>

                      <p className="text-sm text-slate-500">
                        {timeAgo(comment.created_at)}
                      </p>

                      <p className="mt-3 text-[15px] leading-relaxed text-slate-700">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No comments yet.</p>
            )}
          </div>
        </div>
      </section>
        {toast && (
        <div className="pointer-events-none fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-slate-900/60">
          {toast}
        </div>
      )}
    </div>
  )
}

export default ExploreDetails