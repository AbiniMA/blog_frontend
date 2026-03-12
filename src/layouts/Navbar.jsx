import { Outlet } from "react-router-dom";
import GoogleLogin from "../components/google/GoogleLogin";

function Navbar() {
  return (
    <>
     <nav className="flex flex-wrap items-center justify-between  my-4 gap-6 w-[80%] mx-auto">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1c64f2] text-lg font-semibold text-white shadow-lg shadow-[#1c64f2]/30">
          AI
        </div>
        <span className="text-lg font-semibold tracking-tight">AIBlog</span>
      </div>

      {/* <div className="flex w-full max-w-lg flex-1 items-center rounded-3xl border border-slate-200 bg-white/70 px-4 py-2 shadow-sm shadow-slate-200/60 backdrop-blur">
        <svg
          className="h-5 w-5 text-slate-400"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M8.5 3.5a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 0a5 5 0 0 1 5 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="m13.5 13.5 3 3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <input
          type="text"
          placeholder="Search posts..."
          className="ml-3 w-full bg-transparent text-sm text-slate-600 outline-none placeholder:text-slate-400"
        />
      </div> */}

      <div className="flex items-center gap-4 text-sm font-medium text-slate-600">
        {/* <button className="text-slate-600 transition hover:text-slate-900">Log in</button> */}
        <GoogleLogin />
        <button className="rounded-full bg-[#2f6cff] px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-[#2f6cff]/30 transition hover:bg-[#1445d9]">
          Sign up
        </button>
      </div>
    </nav>

    <Outlet/>
    
    </>
   
  );
}

export default Navbar;
