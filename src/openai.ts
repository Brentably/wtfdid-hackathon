import { ChatCompletionRequestMessage, Configuration, OpenAIApi, ChatCompletionRequestMessageRoleEnum } from "openai";
import {readApiKey, readStore, writeStore} from "./state"

const PRICING_RATE:{[key:string]:any} = {
  "gpt-3.5-turbo": {"prompt": 0.002, "completion": 0.002},
  "gpt-4": {"prompt": 0.03, "completion": 0.06},
  "gpt-4-32k": {"prompt": 0.06, "completion": 0.12},
}

function calculateExpense(prompt_tokens: number, completion_tokens: number, model: string) {
  const {prompt: prompt_pricing, completion: completion_pricing} = PRICING_RATE[model]
  return ((prompt_tokens / 1000) * prompt_pricing) + ((completion_tokens / 1000) * completion_pricing)
}
//helper
function getOpenAI() {
  const configuration = new Configuration({
      apiKey: readApiKey(),
  });

  return new OpenAIApi(configuration);
}

// calls openai, stores the message history in store.json
export async function getChatCompletion(userMessage: string, messagesHistory: ChatCompletionRequestMessage[], model = "gpt-3.5-turbo") {
  const openai = getOpenAI()
  
  const messages = [...messagesHistory, {role: ChatCompletionRequestMessageRoleEnum.User, content: userMessage}];
  const completion = await openai.createChatCompletion({
    model: model,
    messages: messages,
  });

  if(!completion.data.choices[0].message) throw new Error("something fucked up")

  return completion.data.choices[0].message.content
}


// calls openai, stores the message history in store.json
export async function getChatCompletionStandalone(message: string, model = "gpt-3.5-turbo") {
  const openai = getOpenAI()
  const messages = [{role: ChatCompletionRequestMessageRoleEnum.User, content: message}];
  const completion = await openai.createChatCompletion({
    model: model,
    messages: messages
  });

  if(!completion.data.choices[0].message) throw new Error("something fucked up")

  return completion.data.choices[0].message.content
}

// async function test() {
//   console.log(await getChatCompletion('Hello'))
//   console.log(readStore())
// }
// test()
