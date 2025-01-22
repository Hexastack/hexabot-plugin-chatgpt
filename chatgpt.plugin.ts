/*
 * Copyright © 2024 Hexastack. All rights reserved.
 *
 * Licensed under the GNU Affero General Public License v3.0 (AGPLv3) with the following additional terms:
 * 1. The name "Hexabot" is a trademark of Hexastack. You may not use this name in derivative works without express written permission.
 * 2. All derivative works must include clear attribution to the original creator and software, Hexastack and Hexabot, in a prominent location (e.g., in the software's "About" section, documentation, and README file).
 */

import { Injectable } from '@nestjs/common';

import { Block } from '@/chat/schemas/block.schema';
import { Context } from '@/chat/schemas/types/context';
import {
  OutgoingMessageFormat,
  StdOutgoingTextEnvelope,
} from '@/chat/schemas/types/message';
import { MessageService } from '@/chat/services/message.service';
import { ContentService } from '@/cms/services/content.service';
import ChatGptLlmHelper from '@/contrib/extensions/helpers/hexabot-helper-chatgpt/index.helper';
import { HelperService } from '@/helper/helper.service';
import { HelperType } from '@/helper/types';
import { LoggerService } from '@/logger/logger.service';
import { BaseBlockPlugin } from '@/plugins/base-block-plugin';
import { PluginService } from '@/plugins/plugins.service';
import { PluginBlockTemplate } from '@/plugins/types';

import CHATGPT_PLUGIN_SETTINGS from './settings';

@Injectable()
export class ChatgptPlugin extends BaseBlockPlugin<
  typeof CHATGPT_PLUGIN_SETTINGS
> {
  template: PluginBlockTemplate = { name: 'ChatGPT RAG Plugin' };

  constructor(
    pluginService: PluginService,
    private helperService: HelperService,
    private logger: LoggerService,
    private contentService: ContentService,
    private readonly messageService: MessageService,
  ) {
    super('chatgpt-plugin', pluginService);
  }

  getPath(): string {
    return __dirname;
  }

  async process(block: Block, context: Context, _convId: string) {
    const RAG = context.text
      ? await this.contentService.textSearch(context.text)
      : [];
    const args = this.getArguments(block);
    const chatGptHelper = this.helperService.use(
      HelperType.LLM,
      ChatGptLlmHelper,
    );

    const history = await this.messageService.findLastMessages(
      context.user,
      args.max_messages_ctx,
    );

    const options = this.settings
      .filter(
        (setting) =>
          'subgroup' in setting &&
          setting.subgroup === 'options' &&
          setting.value !== null,
      )
      .reduce((acc, { label }) => {
        acc[label] = args[label];
        return acc;
      }, {});

    const systemPrompt = `CONTEXT: ${args.context}
          DOCUMENTS: \n${RAG.reduce(
            (prev, curr, index) =>
              `${prev}\n\tDOCUMENT ${index} \n\t\tTitle:${curr.title}\n\t\tData:${curr.rag}`,
            '',
          )}\nINSTRUCTIONS: 
          ${args.instructions}
        `;

    const text = context?.text 
      ? await chatGptHelper.generateChatCompletion(
          context.text, 
          args.model, 
          systemPrompt, 
          history, 
          { ...options, 
            user: context.user.id, 
          },
        ) 
      : "";

    const envelope: StdOutgoingTextEnvelope = {
      format: OutgoingMessageFormat.text,
      message: {
        text,
      },
    };
    return envelope;
  }
}
