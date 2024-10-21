import { PluginSetting } from '@/plugins/types';
import { SettingType } from '@/setting/schemas/types';

export const CHATGPT_PLUGIN_SETTINGS = [
  {
    label: 'token',
    group: 'default',
    type: SettingType.secret,
    value: '',
  },
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
    label: 'num_ctx',
    group: 'default',
    type: SettingType.number,
    value: 256,
  },
  {
    label: 'max_messages_ctx',
    group: 'default',
    type: SettingType.number,
    value: 5,
  },
] as const satisfies PluginSetting[];
