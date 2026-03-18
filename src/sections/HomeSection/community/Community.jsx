import React, { useMemo, useRef, useState, useEffect } from "react"
import { useGoogleLogin } from "../../../hooks/useGoogleLogin"
import { useNavigate } from "react-router-dom"

const scrollToId = (id) => {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: "smooth" })
}

const Community = () => {
  const { requestLogin, ready } = useGoogleLogin()
  const [toast, setToast] = useState("")
  const toastTimerRef = useRef(null)
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
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current)
      }
    }
  }, [])

  const showToast = (message) => {
    setToast(message)
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current)
    }
    toastTimerRef.current = window.setTimeout(() => setToast(""), 2800)
  }

  const handleGetStarted = () => {
    if (!ready) {
      showToast("Preparing login flow…")
      return
    }
    if (!user) {
      showToast("You need to log in first.")
      requestLogin()
      return
    } else {
      navigate("/dashboard")
    }
    scrollToId("featured-posts")
  }


  return (
    <section className="bg-[#e9efff] py-20">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Community</p>
        <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
          Ready to Join the Community?
        </h2>
        <p className="max-w-3xl text-base text-slate-600 sm:text-lg">
          Share your AI-generated ideas, read cutting-edge content, and be part of the future of
          content creation.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={handleGetStarted}
            disabled={!ready}
            className={`rounded-full bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-blue-200 transition ${ready ? "hover:bg-blue-700" : "cursor-wait opacity-80"
              }`}
          >
            Get Started Free
          </button>

        </div>
      </div>
      {toast && (
        <div className="pointer-events-none fixed bottom-6 left-1/2 w-fit -translate-x-1/2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-slate-900/60">
          {toast}
        </div>
      )}
    </section>
  )
}

export default Community
