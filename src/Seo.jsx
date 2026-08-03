import { useEffect } from 'react';

/**
 * Dependency-free per-route <head> manager for the ListMate SPA.
 *
 * Because ListMate is a client-side single-page app, every route would
 * otherwise inherit the homepage <title>, description, canonical and og:*
 * tags baked into index.html. This component updates those tags on mount /
 * prop change so each public route advertises its own metadata to browsers,
 * search engines and social crawlers that execute JavaScript.
 *
 * (For crawlers that do NOT run JS, add prerendering/SSG at build time — see
 * README notes. This covers the client-side baseline.)
 *
 * Props:
 *   title       — full <title> (keep under ~60 chars)
 *   description — meta description + og/twitter description
 *   path        — route path, e.g. "/pricing". Combined with SITE_ORIGIN to
 *                 build the canonical URL and og:url.
 *   image       — absolute og/twitter image URL (defaults to the site card)
 *   noindex     — when true, tells crawlers not to index this route (e.g. 404)
 */

const SITE_ORIGIN = 'https://listmate.co.uk';
const DEFAULT_IMAGE = `${SITE_ORIGIN}/og-image.png`;

function upsertMeta(attr, key, content) {
  if (content == null) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export default function Seo({ title, description, path = '/', image = DEFAULT_IMAGE, noindex = false }) {
  useEffect(() => {
    const url = SITE_ORIGIN + path;

    if (title) document.title = title;

    upsertMeta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow');

    if (description) {
      upsertMeta('name', 'description', description);
      upsertMeta('property', 'og:description', description);
      upsertMeta('name', 'twitter:description', description);
    }

    if (title) {
      upsertMeta('property', 'og:title', title);
      upsertMeta('name', 'twitter:title', title);
    }

    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:image', image);
    upsertMeta('name', 'twitter:image', image);
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertCanonical(url);
  }, [title, description, path, image, noindex]);

  return null;
}
