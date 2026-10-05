"use client";

import { useEffect } from "react";
import { getOrAssignAbVariant, tagClarityAb } from "@/lib/ab";

export function AbBootstrap() {
  useEffect(() => {
    tagClarityAb(getOrAssignAbVariant());
  }, []);

  return null;
}
