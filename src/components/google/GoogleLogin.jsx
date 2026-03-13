import { useGoogleLogin } from "../../hooks/useGoogleLogin";

export default function GoogleLogin() {
  const { requestLogin, ready } = useGoogleLogin();

  return (
    <button
      onClick={requestLogin}
      disabled={!ready}
      className="text-slate-600 transition hover:text-slate-900 disabled:opacity-40 disabled:cursor-wait"
    >
      Log in
    </button>
  );
}
