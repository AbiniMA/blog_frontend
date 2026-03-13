import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

const TOAST_DURATION = 2800

const HomeBanner = () => {
  const [toast, setToast] = useState("")
  const timerRef = useRef(null)
  const navigate = useNavigate()
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"))
    } catch {
      return null
    }
  }, [])

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current)
      }
    }
  }, [])

  const showToast = (message) => {
    setToast(message)
    if (timerRef.current) {
      window.clearTimeout(timerRef.current)
    }
    timerRef.current = window.setTimeout(() => setToast(""), TOAST_DURATION)
  }

  const handleExploreClick = () => {
    if (!user) {
      showToast("Log in first to explore posts.")
      return
    }

    navigate("/explore")
  }

  const handleStartWritingClick = () => {
    if (!user) {
      showToast("Log in first to start writing.")
      return
    }

    showToast("Start writing is coming soon.")
  }

  return (
    <>
      <section className="grid gap-10 md:grid-cols-[1.3fr_1fr] md:items-center my-[50px] w-[80%] mx-auto">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 px-4 py-1 font-bold text-sm text-[#2563f0]">
            <svg
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 10h4l2 4 3-8 2 6h5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Powered by AI
          </div>

          <h1 className="mt-8 text-[40px] lg:text-[70px] font-bold leading-tight text-slate-900 ">
            Discover &amp; <br /> Share AI- <br /> Generated Content
          </h1>
          <p className="mt-10 max-w-2xl text-lg text-slate-600">
            A modern hub for publishing, discovering, and exploring AI-assisted articles. Read what
            the future is writing and collaborate with creators pushing the frontier of intelligent
            storytelling.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={handleExploreClick}
              className="flex items-center gap-2 rounded-2xl bg-[#2f6cff] px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_50px_rgba(47,108,255,0.3)] transition hover:bg-[#1445d9]"
            >
              Explore Posts
              <span aria-hidden="true">&gt;</span>
            </button>
            <button
              onClick={handleStartWritingClick}
              className="rounded-2xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
            >
              Start Writing
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[30px] border border-blue-100 bg-white/90 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.09)]">
            <div className="space-y-5">
              <div className="h-12 w-full rounded-2xl bg-slate-100"></div>
              <div className="h-4 w-3/4 rounded-full bg-slate-200"></div>
              <div className="h-4 w-1/2 rounded-full bg-slate-200"></div>
              <div className="h-32 rounded-[20px] bg-slate-100"></div>
            </div>
          </div>
        </div>
      </section>
      {toast && (
        <div className="pointer-events-none fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-slate-900/60">
          {toast}
        </div>
      )}
    </>
  )
}

export default HomeBanner
