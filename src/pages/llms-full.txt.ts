import { llmsFull, markdownResponse } from '../lib/data';
export const GET = () => markdownResponse(llmsFull(), 'text/plain');
