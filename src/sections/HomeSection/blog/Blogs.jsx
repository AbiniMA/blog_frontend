import React from 'react'
import { useNavigate } from 'react-router-dom'

const posts = [
  {
    title: 'The Future of AI in Content Creation',
    excerpt:
      'Explore how AI is transforming the way we create and consume content in the digital age.',
    tag: 'AI-Generated',
    readTime: '5 min read',
    author: 'Author Name',
    date: 'Mar 11, 2026',
  },
  {
    title: 'Design Systems for Rapid AI Prototyping',
    excerpt:
      'See how modular design systems keep experimentation fast while staying consistent across products.',
    tag: 'AI-Assisted',
    readTime: '6 min read',
    author: 'Jamie Patel',
    date: 'Mar 9, 2026',
  },
  {
    title: 'Measuring Trust in AI-Created Stories',
    excerpt:
      'A framework for evaluating quality and audience trust when stories are written by models.',
    tag: 'Community Picks',
    readTime: '4 min read',
    author: 'Kira Lin',
    date: 'Mar 5, 2026',
  },
]

const Blogs = () => {
  const navigate = useNavigate()

  const handleCardClick = () => {
    navigate('/explore')
  }
  const renderInitials = (name) =>
    name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()

  return (
    <section id="featured-posts" className="bg-white py-16">
      <div className="mx-auto w-[80%]  px-6">
        <div className="space-y-3 max-w-2xl">
          <h2 className="text-4xl font-bold text-slate-900">Featured Posts</h2>
          <p className="text-lg text-slate-600">
            The best AI-generated and AI-assisted content from our community
          </p>
          <p className="text-slate-500">
            Deep dives, experiments, and stories hand-picked from authors pushing the limits of what’s possible with AI.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.title}
            role="button"
            tabIndex={0}
            onClick={handleCardClick}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                handleCardClick()
              }
            }}
            className="cursor-pointer flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.08)] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              <div className="h-36 w-full bg-gradient-to-b from-slate-100 via-white to-slate-200" />
              <div className="flex flex-1 flex-col gap-4 p-6">
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
                  <span className="text-blue-600">{post.tag}</span>
                  <span className="text-slate-400">{post.readTime}</span>
                </div>
                <h3 className="text-2xl font-semibold text-slate-900">{post.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{post.excerpt}</p>
                <div className="mt-auto flex items-center gap-3 border-t border-slate-100 pt-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold uppercase text-slate-500">
                    {renderInitials(post.author)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{post.author}</p>
                    <p className="text-xs text-slate-400">{post.date}</p>
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
