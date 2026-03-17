const formatDate = (value) => {
  if (!value) {
    return "Unknown date"
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return value
  }

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

const normalizeTags = (tags) => {
  if (!tags) {
    return []
  }
  if (Array.isArray(tags)) {
    return tags
      .map((tag) => (typeof tag === "string" ? tag.trim() : ""))
      .filter(Boolean)
  }
  return tags
    .split(",")
    .map((chunk) => chunk.trim())
    .filter(Boolean)
}

export const mapBlogToPost = (blog) => {
  if (!blog) {
    return null
  }

  const title = blog.title || blog.heading || blog.name || "Untitled article"
  const excerpt =
    blog.summary || blog.excerpt || blog.description || "No excerpt is available yet."
  const rawCategory =
    (blog.category?.name || blog.category || blog.category_name || blog.tag || blog.type) ?? ""
  const tag = typeof rawCategory === "string" && rawCategory ? rawCategory : "Community"
  const rawReadTime =
    blog.read_time ?? blog.reading_time ?? blog.read_time_minutes ?? blog.read_time_text
  const readTime =
    typeof rawReadTime === "number" ? `${rawReadTime} min read` : rawReadTime || ""
  const author =
    blog.author?.name || blog.author || blog.author_name || blog.byline || "Community"
  const date = formatDate(
    blog.published_at || blog.publish_date || blog.created_at || blog.date
  )
  const content = blog.content || blog.body || blog.details || ""
  const image = blog.image || blog.cover_image || ""
  const categoryName = blog.category_name || blog.category?.name || rawCategory || ""
  const tags = normalizeTags(blog.tags || blog.tag || "")
  const id = blog.id || blog.slug || title
  const comments = Array.isArray(blog.comments) ? blog.comments : []
  const commentsCount =
    blog.comments_count ?? blog.comments?.length ?? blog.comment_count ?? comments.length

  return {
    id,
    title,
    excerpt,
    tag,
    readTime,
    author,
    date,
    content,
    image,
    categoryName,
    tags,
    comments,
    commentsCount,
  }
}
