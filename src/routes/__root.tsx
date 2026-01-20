import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'X Virality Predictor - Powered by Phoenix Algorithm',
      },
      {
        name: 'description',
        content:
          "Simulate X's Phoenix-style ranking signals to estimate engagement. Disclaimer: the open-sourced repo lacks production weights/embeddings, so outputs are illustrative—not fully accurate predictions.",
      },
      {
        property: 'og:title',
        content: 'X Virality Predictor',
      },
      {
        property: 'og:description',
        content:
          "Simulate X's ranking signals (illustrative; missing production weights/embeddings).",
      },
      {
        name: 'theme-color',
        content: '#0a0a0b',
      },
    ],
    links: [
      // Force a blank favicon so the browser doesn't show any cached/default icon.
      // (Some browsers will otherwise keep showing an old /favicon.ico from cache.)
      {
        rel: 'icon',
        href: 'data:,',
      },
      {
        rel: 'shortcut icon',
        href: 'data:,',
      },
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Outfit:wght@300;400;500;600;700;800&display=swap',
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  )
}
