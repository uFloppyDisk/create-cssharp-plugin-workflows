import { PromptObject } from "prompts";

function validateString(errorMsg: string) {
  return (str: unknown): true | string => {
    return typeof str === 'string' && str.trim().length > 0 ? true : errorMsg;
  }
}

export default <PromptObject[]>[
  {
    type: 'text',
    name: 'pluginName',
    message: 'What do you want to name your plugin?',
    validate: validateString('Your plugin must have a name!'),
  },
  {
    type: 'toggle',
    name: 'containingDirectorySameName',
    message: 'Do you want the containing directory to have the same name as your plugin?',
    initial: true,
    active: 'yes',
    inactive: 'no',
  },
  {
    type: (_, values) => values.containingDirectorySameName === false ? 'text' : null,
    name: 'containingDirectoryName',
    message: 'What do you want to name the containing directory?',
    validate: validateString('Containing directory must have a name!'),
  },
  {
    type: 'text',
    name: 'pluginAuthor',
    message: 'Plugin author',
    initial: '',
  },
  {
    type: 'text',
    name: 'pluginDescription',
    message: 'Plugin description',
    initial: '',
  },
  {
    type: 'text',
    name: 'pluginVersion',
    message: 'Initial version',
    initial: '0.0.1',
  },
];

