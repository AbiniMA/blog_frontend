import { useEffect, useRef } from "react";

export default function GoogleLogin() {
  const codeClientRef = useRef(null);

  useEffect(() => {
    const initGoogle = () => {
      if (!window.google) {
        console.error("Google script not loaded");
        return;
      }

      codeClientRef.current = window.google.accounts.oauth2.initCodeClient({
        client_id:
          "423472984938-uol0vvd26dmcsha9d9keh090jjm3pkem.apps.googleusercontent.com",
        scope: "openid email profile",
        ux_mode: "popup",
        select_account: true,
        callback: async (response) => {
          console.log("Auth code response:", response);

          if (!response.code) {
            console.error("No auth code returned");
            return;
          }

          try {
            const res = await fetch("http://127.0.0.1:8000/api/google-login/", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
              },
              body: JSON.stringify({ code: response.code }),
            });

            const data = await res.json();
            console.log("Backend response:", data);
          } catch (err) {
            console.error("Login error:", err);
          }
        },
        error_callback: (err) => {
          console.error("Google popup error:", err);
        },
      });
    };

    initGoogle();
  }, []);

  const handleLoginClick = () => {
    if (!codeClientRef.current) {
      console.error("Google client not initialized");
      return;
    }
    codeClientRef.current.requestCode();
  };

  return (
    <button
      onClick={handleLoginClick}
      className="text-slate-600 transition hover:text-slate-900"
    >
      Log in
    </button>
  );
}