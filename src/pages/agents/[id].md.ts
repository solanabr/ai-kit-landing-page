import type { APIContext } from 'astro';
import { cards, itemMarkdown, markdownResponse } from '../../lib/data';
export const getStaticPaths = () => cards('agents').map(c => ({ params: { id: c.id } }));
export const GET = ({ params }: APIContext) => markdownResponse(itemMarkdown('agents', params.id!));
