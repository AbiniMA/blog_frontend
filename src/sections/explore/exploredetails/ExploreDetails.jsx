import React from "react"
import { useLocation, useNavigate } from "react-router-dom"

const defaultPost = {
  title: "The Future of AI in Content Creation",
  excerpt:
    "Explore how AI is transforming the way we create and consume content in the digital age.",
  tag: "AI-Generated",
  readTime: "5 min read",
  author: "Sarah Chen",
  date: "Mar 11, 2026",
}

const sections = [
  {
    title: "Understanding AI-Generated Content",
    body:
      "AI-generated content refers to text, images, and multimedia created with the assistance of artificial intelligence algorithms. These systems analyze patterns, understand context, and produce coherent, relevant content for audiences.",
  },
  {
    title: "The Benefits for Creators",
    body:
      "Increased productivity and faster iteration, Enhanced creativity through collaborative AI assistance, Ability to personalize content at scale, Reduced time on repetitive writing tasks.",
    list: [
      "Increased productivity and faster iteration",
      "Enhanced creativity through collaborative AI assistance",
      "Ability to personalize content at scale",
      "Reduced time on repetitive writing tasks",
    ],
  },
  {
    title: "Challenges and Considerations",
    body:
      "The proliferation of AI-driven content raises questions about authenticity, copyright, and the balance between human creativity and machine output. Maintaining transparency and editorial oversight will remain critical.",
  },
  {
    title: "Looking Forward",
    body:
      "The future of content creation is a hybrid model where AI and human creativity work together. Platforms that navigate this transition while keeping humans in the loop will deliver the most meaningful experiences.",
  },
]

const ExploreDetails = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const post = location.state?.post ?? defaultPost

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-blue-700">
                {post.tag}
              </span>
              <h1 className="mt-4 text-4xl font-bold text-slate-900">{post.title}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-3">
                  <span className="h-10 w-10 rounded-full bg-slate-100" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{post.author}</p>
                    <p className="text-xs text-slate-500">
                      {post.date} · {post.readTime} · {post.tag}
                    </p>
                  </div>
                </div>
                {/* <button
                  onClick={() => navigate(-1)}
                  className="rounded-full border border-slate-200 px-4 py-1 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
                >
                  Back
                </button> */}
              </div>
            </div>
            {/* <button className="rounded-full border border-blue-200 bg-white px-5 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50">
              Follow
            </button> */}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="rounded-[28px] border border-slate-200 bg-gradient-to-b from-slate-100 via-white to-slate-200 p-1 shadow-[0_25px_80px_rgba(15,23,42,0.12)]">
          <div className="h-56 w-full rounded-[28px] bg-white" />
        </div>
        <p className="mt-6 text-base text-slate-600">{post.excerpt}</p>
        {sections.map((section) => (
          <div key={section.title} className="mt-10 space-y-3">
            <h3 className="text-xl font-semibold text-slate-900">{section.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {section.body}
            </p>
            {section.list && (
              <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        ))}

        <div className="mt-10 flex flex-wrap items-center gap-3">
          {["#AI", "#ContentCreation", "#Technology", "#Future"].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-slate-100 pt-6 text-sm text-slate-500">
          <span className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-full border border-slate-200 bg-white flex items-center justify-center text-xs font-bold text-slate-500">
              ♥
            </span>
            1.3K
          </span>
          <span className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-full border border-slate-200 bg-white flex items-center justify-center text-xs font-bold text-slate-500">
              💬
            </span>
            28
          </span>
          <button className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-slate-400">
            Share
          </button>
        </div>

        <div className="mt-10 rounded-[20px] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
          <h4 className="text-base font-semibold text-slate-900">Comments</h4>
          <p className="text-sm text-slate-500">Share your thoughts…</p>
          <textarea
            rows={3}
            className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 focus:border-slate-400 focus:outline-none"
            placeholder="Tell us what you found interesting."
          />
          <button className="mt-4 rounded-2xl bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700">
            Post Comment
          </button>
        </div>
      </section>
    </div>
  )
}

export default ExploreDetails
