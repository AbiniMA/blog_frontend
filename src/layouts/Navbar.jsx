import { Link, Outlet, useNavigate } from "react-router-dom";
import GoogleLogin from "../components/google/GoogleLogin";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  return (
    <>
      <nav className="flex flex-wrap items-center justify-between  my-4 gap-6 w-[80%] mx-auto">
        <Link to="/"> <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1c64f2] text-lg font-semibold text-white shadow-lg shadow-[#1c64f2]/30">
            AI
          </div>
          <span className="text-lg font-semibold tracking-tight">AIBlog</span>
        </div>
        </Link>

        <div className="flex items-center gap-4 text-sm font-medium text-slate-600">

          {!user ? (
            <>
              <GoogleLogin />

            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/dashboard">
                <img
                  src={user.picture}
                  alt="profile"
                  className="w-8 h-8 rounded-full"
                />
              </Link>
              <Link to="/dashboard">
                <span className="text-slate-700 font-medium">
                  {user.name}
                </span>
              </Link>

              <button
                onClick={() => {
                  localStorage.removeItem("user");
                  // window.location.reload();
                  navigate("/");
                }}
              >
                Logout
              </button>

            </div>
          )}

        </div>
      </nav>

      <Outlet />

    </>

  );
}

export default Navbar;
