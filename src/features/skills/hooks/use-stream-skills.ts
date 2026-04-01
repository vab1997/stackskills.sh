"use client";

import type {
  SkillsByDependency,
  SkillsStreamEvent,
} from "@/features/skills/types";
import { useEffect, useRef, useState } from "react";

export type StreamPhase =
  | "idle"
  | "detecting"
  | "technologies_found"
  | "fetching_skills"
  | "skill_fetched"
  | "complete"
  | "error";

export interface StreamState {
  phase: StreamPhase;
  technologies: string[];
  fetchedCount: number;
  totalCount: number;
  skills: SkillsByDependency | null;
  errorMessage: string | null;
}

const INITIAL_STATE: StreamState = {
  phase: "idle",
  technologies: [],
  fetchedCount: 0,
  totalCount: 0,
  skills: null,
  errorMessage: null,
};

export function useStreamSkills() {
  const [streamState, setStreamState] = useState<StreamState>(INITIAL_STATE);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  async function streamSkills(packageJsons: string[]) {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStreamState({ ...INITIAL_STATE, phase: "detecting" });

    try {
      const response = await fetch("/api/skills/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageJsons }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Request failed");
        setStreamState((s) => ({
          ...s,
          phase: "error",
          errorMessage: errorText,
        }));
        return "error";
      }

      const reader = response.body?.getReader();
      if (!reader) {
        setStreamState((s) => ({
          ...s,
          phase: "error",
          errorMessage: "No response body",
        }));
        return "error";
      }

      const decoder = new TextDecoder();
      let buffer = "";
      let finalPhase: StreamPhase = "detecting";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          const event = JSON.parse(trimmed) as SkillsStreamEvent;
          finalPhase = event.type;
          setStreamState((s) => applyEvent(s, event));
        }
      }

      // flush remaining buffer
      if (buffer.trim()) {
        const event = JSON.parse(buffer.trim()) as SkillsStreamEvent;
        finalPhase = event.type as StreamPhase;
        setStreamState((s) => applyEvent(s, event));
      }

      return finalPhase;
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return "idle";
      setStreamState((s) => ({
        ...s,
        phase: "error",
        errorMessage: err instanceof Error ? err.message : "Unknown error",
      }));
      return "error";
    }
  }

  function resetStream() {
    abortRef.current?.abort();
    abortRef.current = null;
    setStreamState(INITIAL_STATE);
  }

  return { streamSkills, resetStream, streamState };
}

function applyEvent(state: StreamState, event: SkillsStreamEvent): StreamState {
  switch (event.type) {
    case "detecting":
      return { ...state, phase: "detecting" };
    case "technologies_found":
      return {
        ...state,
        phase: "technologies_found",
        technologies: event.technologies,
      };
    case "fetching_skills":
      return { ...state, phase: "fetching_skills", totalCount: event.total };
    case "skill_fetched":
      return {
        ...state,
        phase: "skill_fetched",
        fetchedCount: event.fetched,
        totalCount: event.total,
      };
    case "complete":
      return { ...state, phase: "complete", skills: event.skills };
    case "error":
      return { ...state, phase: "error", errorMessage: event.message };
    default:
      return state;
  }
}
