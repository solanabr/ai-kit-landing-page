import { catalogMarkdown, markdownResponse } from '../lib/data';
export const GET = () => markdownResponse(catalogMarkdown('agents'));
