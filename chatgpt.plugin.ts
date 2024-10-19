/*
 * Copyright © 2024 Hexastack. All rights reserved.
 *
 * Licensed under the GNU Affero General Public License v3.0 (AGPLv3) with the following additional terms:
 * 1. The name "Hexabot" is a trademark of Hexastack. You may not use this name in derivative works without express written permission.
 * 2. All derivative works must include clear attribution to the original creator and software, Hexastack and Hexabot, in a prominent location (e.g., in the software's "About" section, documentation, and README file).
 */

import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

import { Block } from '@/chat/schemas/block.schema';
import { Context } from '@/chat/schemas/types/context';
import {
  OutgoingMessageFormat,
  StdOutgoingTextEnvelope,
} from '@/chat/schemas/types/message';
import { MessageService } from '@/chat/services/message.service';
import { ContentService } from '@/cms/services/content.service';
import { LoggerService } from '@/logger/logger.service';
import { BaseBlockPlugin } from '@/plugins/base-block-plugin';
import { PluginService } from '@/plugins/plugins.service';

import { CHATGPT_PLUGIN_SETTINGS } from './settings';

@Injectable()
export class ChatgptPlugin extends BaseBlockPlugin<
  typeof CHATGPT_PLUGIN_SETTINGS
> {
  private openai: OpenAI;

  constructor(
    pluginService: PluginService,
    private logger: LoggerService,
    private contentService: ContentService,
    private readonly messageService: MessageService,
  ) {
    super('chatgpt', CHATGPT_PLUGIN_SETTINGS, pluginService);

    this.template = { name: 'ChatGPT RAG Block' };

    this.effects = {
      onStoreContextData: () => {},
    };
  }

  private async getMessagesContext(context: Context, maxMessagesCtx = 5) {
    const recentMessages = await this.messageService.findLastMessages(
      context.user,
      maxMessagesCtx,
    );

    const messagesContext: { role: 'user' | 'assistant'; content: string }[] =
      recentMessages.map((m) => {
        const text =
          'text' in m.message && m.message.text
            ? m.message.text
            : JSON.stringify(m.message);
        return {
          role: 'sender' in m && m.sender ? 'user' : 'assistant',
          content: text,
        };
      });

    return messagesContext;
  }

  async process(block: Block, context: Context, _convId: string) {
    const RAG = await this.contentService.textSearch(context.text);
    const args = this.getArguments(block);
    const client = this.getInstance(args.token);
    const historicalMessages = await this.getMessagesContext(
      context,
      args.max_messages_ctx,
    );
    const completion = await client.chat.completions.create({
      model: args.model,
      messages: [
        {
          role: 'system',
          content: `CONTEXT: ${args.context}
          DOCUMENTS: \n${RAG.reduce(
            (prev, curr, index) =>
              `${prev}\n\tDOCUMENT ${index} \n\t\tTitle:${curr.title}\n\t\tData:${curr.rag}`,
            '',
          )}\nINSTRUCTIONS: 
          ${args.instructions}
        `,
        },
        ...historicalMessages,
        { role: 'user', content: context.text },
      ],
      temperature: 0.8,
      max_tokens: args.num_ctx || 256,
    });

    const envelope: StdOutgoingTextEnvelope = {
      format: OutgoingMessageFormat.text,
      message: {
        text: completion.choices[0].message.content,
      },
    };
    return envelope;
  }

  private getInstance(token: string) {
    if (this.openai) {
      return this.openai;
    }

    try {
      this.openai = new OpenAI({
        apiKey: token,
      });
      return this.openai;
    } catch (err) {
      this.logger.warn('RAG: Unable to instanciate OpenAI', err);
    }
  }
}
