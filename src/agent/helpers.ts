/*
const systemStringTemplate = 
`You are the internal Monologue of a Chat Assistant. 
You run in a loop of Thought, Action, Observation.
Use Thought to describe your thoughts about the question you have been asked.
Use Action to run one of the actions available to you - 
Observation will be the result of running those actions.

Choices:
{{possibleChoices}}

Rules:
- If you have received an Input from the user, you should reply with a Thought and an Action.
- If you have received an Observation from a tool, you should reply with a Thought and an Action.
- You should never reply with an Input.
Input = `
*/


export const makeSystemString = (systemStringTemplate: string, possibleChoices: string[]) => {
  console.log(possibleChoices)
  const formattedToolsString = possibleChoices.join('\n')
  console.log(formattedToolsString)
  const systemString = systemStringTemplate.replace('{{possibleChoices}}', formattedToolsString)
  return systemString
}

// just one arg right now
export const parseActionAndArg = (message: string) => {
  const messageArr = message.split("\n")
  console.log(messageArr)
  for(let thoughtOrAction of messageArr) {
    if(thoughtOrAction.toLowerCase().startsWith("action:")) {
      let justAction = thoughtOrAction.split(' ').slice(1).join(' ') // remove action from beginning
      const [choice, arg]= justAction.split(/[()]/)
      console.log("choice is:", choice)
      console.log("arg is", arg )
      return [choice, arg]
    }
  }
  return ['', '']
}