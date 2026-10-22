import type { APIContext } from 'astro';
import { cards, itemMarkdown, markdownResponse } from '../../lib/data';
export const getStaticPaths = () => cards('skills').map(c => ({ params: { id: c.id } }));
export const GET = ({ params }: APIContext) => markdownResponse(itemMarkdown('skills', params.id!));
