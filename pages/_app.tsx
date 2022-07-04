import { withTRPC } from "@trpc/next";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import { AppRouter } from "./api/trpc/[trpc]";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    if (typeof window !== "undefined") {
      // during client requests
      return {
        // transformer: superjson, // optional - adds superjson serialization
        url: "/api/trpc",
      };
    }
    // during SSR below

    // optional: use SSG-caching for each rendered page (see caching section for more details)
    // const ONE_DAY_SECONDS = 60 * 60 * 24;
    // ctx?.res?.setHeader(
    //   "Cache-Control",
    //   `s-maxage=1, stale-while-revalidate=${ONE_DAY_SECONDS}`
    // );

    // The server needs to know your app's full url
    // On render.com you can use `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}/api/trpc`
    const url = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/trpc`
      : "http://localhost:3000/api/trpc";

    return {
      // transformer: superjson, // optional - adds superjson serialization
      url,
      headers: {
        // optional - inform server that it's an ssr request
        "x-ssr": "1",
      },
    };
  },
  ssr: true,
})(MyApp);
