import { llmsTxt, markdownResponse } from '../lib/data';
export const GET = () => markdownResponse(llmsTxt(), 'text/plain');
