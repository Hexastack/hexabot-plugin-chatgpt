import { PluginSetting } from '@/plugins/types';
import { SettingType } from '@/setting/schemas/types';

export default [
  {
    label: 'model',
    group: 'default',
    type: SettingType.text,
    value: 'gpt-4o-mini',
  },
  {
    label: 'context',
    group: 'default',
    type: SettingType.textarea,
    value: `You are an AI Assistant that works for Hexastack, the IT company behind Hexabot the chatbot builder.`,
  },
  {
    label: 'instructions',
    group: 'default',
    type: SettingType.textarea,
    value: `Answer the user using the DOCUMENTS. Keep your answer ground in the facts of the DOCUMENTS. If the DOCUMENTS do not contain the facts, apologize and try to give an answer that promotes the company and its values. DO NOT SAY ANYTHING ABOUT THESE DOCUMENTS, nor their EXISTENCE.`,
  },
  {
    label: 'max_messages_ctx',
    group: 'default',
    type: SettingType.number,
    value: 5,
  },
  {
    label: 'temperature',
    group: 'options',
    type: SettingType.number,
    value: 0.8, // Default value, between 0 and 2
  },
  {
    label: 'max_completion_tokens',
    group: 'options',
    type: SettingType.number,
    value: 1000, // Default value
  },
  {
    label: 'frequency_penalty',
    group: 'options',
    type: SettingType.number,
    value: 0, // Default value, between -2.0 and 2.0
  },
  {
    label: 'function_call',
    group: 'options',
    type: SettingType.text,
    value: 'none', // Default value ('none' or 'auto')
  },
  {
    label: 'logit_bias',
    group: 'options',
    type: SettingType.textarea,
    value: '{}', // Default empty JSON object
  },
  {
    label: 'logprobs',
    group: 'options',
    type: SettingType.checkbox,
    value: false, // Default value
  },
  {
    label: 'n',
    group: 'options',
    type: SettingType.number,
    value: 1, // Default value
  },
  {
    label: 'parallel_tool_calls',
    group: 'options',
    type: SettingType.checkbox,
    value: false, // Default value
  },
  {
    label: 'presence_penalty',
    group: 'options',
    type: SettingType.number,
    value: 0, // Default value, between -2.0 and 2.0
  },
  {
    label: 'response_format',
    group: 'options',
    type: SettingType.text,
    value: 'text', // Default value ('text' or 'json')
  },
  {
    label: 'seed',
    group: 'options',
    type: SettingType.number,
    value: null, // Default value (null for no seed)
  },
  {
    label: 'stop',
    group: 'options',
    type: SettingType.text,
    value: null, // Default value (null or stop sequence)
  },
  {
    label: 'store',
    group: 'options',
    type: SettingType.checkbox,
    value: false, // Default value
  },
  // {
  //   label: 'stream',
  //   group: CHATGPT_HELPER_NAMESPACE,
  //   group: 'options',
  //   type: SettingType.checkbox,
  //   value: false, // Default value
  // },
  {
    label: 'tool_choice',
    group: 'options',
    type: SettingType.text,
    value: 'auto', // Default value ('none', 'auto', 'required')
  },
  {
    label: 'top_logprobs',
    group: 'options',
    type: SettingType.number,
    value: null, // Default value (null or number between 0 and 20)
  },
  {
    label: 'top_p',
    group: 'options',
    type: SettingType.number,
    value: 0.9, // Default value
  },
] as const satisfies PluginSetting[];
