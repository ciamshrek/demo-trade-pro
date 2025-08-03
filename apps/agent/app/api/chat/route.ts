import { openai } from '@ai-sdk/openai';
import { streamText, UIMessage, convertToModelMessages, stepCountIs } from 'ai';
import { agentTools } from './tools';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {

    const { messages }: { messages: UIMessage[] } = await req.json();
    const result = streamText({
        model: openai('gpt-4.1-mini'),
        messages: convertToModelMessages(messages),
        system: `You are a helpful stock trading assistant for DemoTradePro. You provide trading advice, market insights, and help users understand stock market concepts. You are knowledgeable, professional, and always emphasize risk management.

You are currently assisting'a user.

Key guidelines:
- Always remind users that trading involves risk
- Provide educational information about stocks and markets
- Help with basic trading concepts and strategies
- Be conversational and helpful
- Never provide specific financial advice or guarantees`,

        tools: agentTools,

        // maximum ever for the demos
        stopWhen: stepCountIs(15),
    });

    return result.toUIMessageStreamResponse();
}
