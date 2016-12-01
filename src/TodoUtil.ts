import {Symbol} from './TodoConstants';

export function toTag(tagName: string): string {
    return `${Symbol.SYMBOL_TAG.toString()}${tagName}`;
}