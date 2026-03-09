"use client";

import { useEffect } from "react";

export default function OAuthPopupCallback() {
  useEffect(() => {
    if (window.opener) {
      window.opener.postMessage(
        { type: "oauth-complete" },
        window.location.origin,
      );
      window.close();
    }
  }, []);

  return null;
}
