/*
 * Copyright © 2025 Hexastack. All rights reserved.
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
import ChatGptLlmHelper from '@/extensions/helpers/hexabot-helper-chatgpt/index.helper';
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

  async process(block: Block, ctx: Context, _convId: string) {
    const RAG = ctx.text ? await this.contentService.textSearch(ctx.text) : [];
    const { model, context, max_messages_ctx, instructions, ...options } =
      this.getArguments(block);

    const chatGptHelper = this.helperService.use(
      HelperType.LLM,
      ChatGptLlmHelper,
    );

    const history = await this.messageService.findLastMessages(
      ctx.user,
      max_messages_ctx,
    );

    const systemPrompt = `CONTEXT: ${context}
          DOCUMENTS: \n${RAG.reduce(
            (prev, curr, index) =>
              `${prev}\n\tDOCUMENT ${index} \n\t\tTitle:${curr.title}\n\t\tData:${curr.rag}`,
            '',
          )}\nINSTRUCTIONS: 
          ${instructions}
        `;

    const text = ctx?.text
      ? await chatGptHelper.generateChatCompletion(
          ctx.text,
          model,
          systemPrompt,
          history,
          {
            ...options,
            user: ctx.user.id,
            seed:
              typeof options.seed === 'number' && options.seed >= 0
                ? options.seed
                : null,
            stop: !!options.stop ? options.stop : null,
            top_logprobs:
              options.logprobs &&
              typeof options.top_logprobs === 'number' &&
              options.top_logprobs >= 0
                ? options.top_logprobs
                : undefined,
            logit_bias:
              (JSON.parse(options.logit_bias) as Record<string, number>) || {},
            max_completion_tokens: parseInt(
              (options.max_completion_tokens || 0).toString(),
            ),
          },
        )
      : '';

    const envelope: StdOutgoingTextEnvelope = {
      format: OutgoingMessageFormat.text,
      message: {
        text,
      },
    };
    return envelope;
  }
}
