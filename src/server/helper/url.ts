export function getBaseURL(): string {
  if (process.env.NODE_ENV === "development") {
    // For local development, use the Next.js development server URL
    return `http://localhost:${process.env.PORT ?? 3000}`;
  } else {
    // For production, use the Vercel URL
    // const vercelUrl = process.env.VERCEL_URL;
    // if (vercelUrl) {
    //   return `https://${vercelUrl}`;
    // }

    // // If VERCEL_URL is not available, use the hostname from the request
    // const hostname = window.location.hostname;
    // const isHttps = window.location.protocol.startsWith("https");
    // return `${isHttps ? "https" : "http"}://${hostname}`;
    return "https://weights-ai.vercel.app";
  }
}
