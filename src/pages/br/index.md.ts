import { indexMarkdown, markdownResponse } from '../../lib/data';
export const GET = () => markdownResponse(indexMarkdown('br'));
