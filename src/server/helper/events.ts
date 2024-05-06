import { env } from "@/env";

export const trackProjectPlannerEvent = async (event: string) => {
  if (env.NODE_ENV === "production") {
    await fetch("https://projectplannerai.com/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: event, // any custom event you want to track
        projectId: env.PROJECT_PLANNER_PROJECT_ID,
      }),
    });
  }
};
