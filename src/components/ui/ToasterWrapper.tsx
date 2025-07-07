"use client";

import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

export function ToasterWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <Toaster position="top-center" reverseOrder={false} />;
} 