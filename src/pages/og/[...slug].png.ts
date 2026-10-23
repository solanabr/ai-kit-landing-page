import type { APIRoute } from 'astro';
import { ogCards, renderOg, type Card } from '../../lib/og';

export const getStaticPaths = () => ogCards().map(card => ({ params: { slug: card.slug }, props: { card } }));

export const GET: APIRoute = async ({ props }) =>
  new Response(await renderOg((props as { card: Card }).card), { headers: { 'content-type': 'image/png' } });
