"use client";

import { useEffect, useState } from "react";
import { formatDecimalAge } from "@/lib/age";

export function AgeTicker({ compact = false }: { compact?: boolean }) {
  const [age, setAge] = useState<string>();

  useEffect(() => {
    const tick = () => setAge(formatDecimalAge());
    tick();
    const interval = window.setInterval(tick, 50);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <span className={compact ? "age-compact" : "age-value"} aria-label="Age, updated continuously">
      <span aria-hidden="true" suppressHydrationWarning>{age ?? "22.000000000000"}</span>
      {!compact && <small>years, still compiling</small>}
    </span>
  );
}
