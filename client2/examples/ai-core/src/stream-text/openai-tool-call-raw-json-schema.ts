import { openai } from '@ai-sdk/openai';
import { jsonSchema, streamText, tool } from 'ai';
import 'dotenv/config';

async function main() {
  const result = streamText({
    model: openai('gpt-3.5-turbo'),
    tools: {
      weather: tool({
        description: 'Get the weather in a location',
        parameters: jsonSchema<{ location: string }>({
          type: 'object',
          properties: {
            location: { type: 'string' },
          },
          required: ['location'],
        }),
        // location below is inferred to be a string:
        execute: async ({ location }) => ({
          location,
          temperature: 72 + Math.floor(Math.random() * 21) - 10,
        }),
      }),
      cityAttractions: tool({
        parameters: jsonSchema<{ city: string }>({
          type: 'object',
          properties: {
            city: { type: 'string' },
          },
          required: ['city'],
        }),
      }),
    },
    prompt: 'What is the weather in San Francisco?',
  });

  for await (const part of result.fullStream) {
    switch (part.type) {
      case 'text-delta': {
        console.log('Text delta:', part.textDelta);
        break;
      }

      case 'tool-call': {
        switch (part.toolName) {
          case 'cityAttractions': {
            console.log('TOOL CALL cityAttractions');
            console.log(`city: ${part.args.city}`); // string
            break;
          }

          case 'weather': {
            console.log('TOOL CALL weather');
            console.log(`location: ${part.args.location}`); // string
            break;
          }
        }

        break;
      }

      case 'tool-result': {
        switch (part.toolName) {
          // NOT AVAILABLE (NO EXECUTE METHOD)
          // case 'cityAttractions': {
          //   console.log('TOOL RESULT cityAttractions');
          //   console.log(`city: ${part.args.city}`); // string
          //   console.log(`result: ${part.result}`);
          //   break;
          // }

          case 'weather': {
            console.log('TOOL RESULT weather');
            console.log(`location: ${part.args.location}`); // string
            console.log(`temperature: ${part.result.temperature}`); // number
            break;
          }
        }

        break;
      }

      case 'finish': {
        console.log('Finish reason:', part.finishReason);
        console.log('Usage:', part.usage);
        break;
      }

      case 'error':
        console.error('Error:', part.error);
        break;
    }
  }
}

main().catch(console.error);