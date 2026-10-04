'use client';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="entry"><h1>Something interrupted your workspace.</h1><p>Your saved records are still on the server. Try loading this page again.</p><button onClick={reset}>Try again</button></main>;
}
