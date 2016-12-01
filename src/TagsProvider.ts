'use strict';

import {CompletionItem} from 'vscode';
import {TodoDocument} from './TodoDocument';
import {Symbol, Tag, Action} from './TodoConstants';
import {toTag} from './TodoUtil';

export default class TagsProvider {
    private static TAGS: string[] = [Tag.TAG_CRITICAL,
                                        Tag.TAG_HIGH,
                                        Tag.TAG_LOW,
                                        Tag.TAG_TODAY];

    public static getTags(prefix?: string): Promise<CompletionItem[]> {
        prefix = prefix && prefix !== Symbol.SYMBOL_TAG
            ? prefix.startsWith(Symbol.SYMBOL_TAG) ? prefix.substring(1) : prefix.toLocaleLowerCase()
            : "";
        let filtered = TagsProvider.TAGS.filter((tag: string, index: number, collection: String[]): boolean => {
            return !prefix || tag.toLocaleLowerCase().indexOf(prefix) !== -1
        });
        let result = filtered.map(this.toCompletionItem);
        return Promise.resolve(result);
    }

    private static toCompletionItem(tag: string, index: number, collection: String[]): CompletionItem {
        tag = toTag(tag);
        var completionItem = new CompletionItem(tag);
        completionItem.insertText = tag + " ";
        return completionItem;
    }
}