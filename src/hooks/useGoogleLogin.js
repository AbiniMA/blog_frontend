import { useEffect, useRef, useState } from "react";
import { loginWithGoogleCode } from "../services/Serviceapi";

const GOOGLE_CLIENT_ID =
  process.env.REACT_APP_GOOGLE_CLIENT_ID ||
  "353750962031-jgua7j8u3fq78dohspu0i9lcgq8q2rkg.apps.googleusercontent.com";

const storeUserLocally = (userData) => {
  if (!userData?.user) return;
  localStorage.setItem("user", JSON.stringify(userData.user));
};

const GOOGLE_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

const loadGoogleScript = () => {
  return new Promise((resolve, reject) => {
    if (window.google) {
      resolve();
      return;
    }

    const existing = document.querySelector(
      `script[src="${GOOGLE_SCRIPT_SRC}"]`,
    );
    if (existing) {
      if (existing.dataset && existing.dataset.loaded) {
        resolve();
        return;
      }
      const onLoad = () => resolve();
      existing.addEventListener("load", onLoad, { once: true });
      existing.addEventListener("error", () =>
        reject(new Error("Google script failed to load")),
      );
      return;
    }

    const script = document.createElement("script");
    script.src = GOOGLE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => reject(new Error("Google script failed to load"));
    document.head.appendChild(script);
  });
};

export const useGoogleLogin = () => {
  const [ready, setReady] = useState(false);
  const codeClientRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const initGoogle = () => {
      if (!window.google) {
        console.error(
          "Google script loaded but `window.google` is unavailable",
        );
        return;
      }

      codeClientRef.current = window.google.accounts.oauth2.initCodeClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: "openid email profile",
        ux_mode: "popup",
        select_account: true,
        callback: async (response) => {
          if (!response.code) {
            console.error("No auth code returned from Google");
            return;
          }

          try {
            const data = await loginWithGoogleCode(response.code);
            storeUserLocally(data);
           
            window.location.reload();
          } catch (err) {
            console.error("Google login error:", err);
          }
        },
        error_callback: (err) => {
          console.error("Google popup error:", err);
        },
      });

      setReady(true);
    };

    loadGoogleScript()
      .then(() => {
        if (!cancelled) {
          initGoogle();
        }
      })
      .catch((err) => {
        console.error("Google script failed to load", err);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const requestLogin = () => {
    if (!codeClientRef.current) {
      console.error("Google client not initialized");
      return;
    }
    codeClientRef.current.requestCode();
  };

  return { requestLogin, ready };
};
