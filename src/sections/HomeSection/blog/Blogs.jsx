import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBlogs } from '../../../services/Serviceapi'

const Blogs = () => {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      const data = await getBlogs('', '') // no filter
      // ✅ take only first 3 posts
      setPosts(data.slice(0, 3))
    } catch (error) {
      console.error('Error fetching blogs:', error)
    }
  }

  const handleCardClick = () => {
    navigate('/explore')
  }

  const renderInitials = (name = '') =>
    name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()

  return (
    <section id="featured-posts" className="bg-white py-16">
      <div className="mx-auto w-[80%] px-6">
        <div className="space-y-3 max-w-2xl">
          <h2 className="text-4xl font-bold text-slate-900">Featured Posts</h2>
          <p className="text-lg text-slate-600">
            The best AI-generated and AI-assisted content from our community
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.id}
              role="button"
              tabIndex={0}
              onClick={handleCardClick}
              className="cursor-pointer flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.08)]"
            >
              {/* ✅ Image from API */}
              <div
                className="h-36 w-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(${post.image})`,
                }}
              />

              <div className="flex flex-1 flex-col gap-4 p-6">
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
                  <span className="text-blue-600">
                    {post.category_name || 'General'}
                  </span>
                  {/* <span className="text-slate-400">
                    {post.read_time || '5 min read'}
                  </span> */}
                </div>

                <h3 className="text-2xl font-semibold text-slate-900">
                  {post.title}
                </h3>

                <p className="text-sm text-slate-500">
                  {post.content?.slice(0, 100)}...
                </p>

                <div className="mt-auto flex items-center gap-3 border-t pt-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold uppercase text-slate-500">
                    {renderInitials(post.user_name)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {post.user_name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(post.created_at).toDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Blogs