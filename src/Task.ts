import {TextLine, Position, Range} from 'vscode';
import {Symbol, Action} from './TodoConstants';
import {toTag} from './TodoUtil';

export default class Task {
    private taskText: string;

    constructor(public taskLine: TextLine) {
        this.taskText= taskLine.text.trim();
    }

    public getDescription(): string {
        if (this.isDone()) {
            let index= this.taskText.indexOf(toTag(Action.ACTION_DONE));
            return index !== -1 ? this.taskText.substring(Symbol.SYMBOL_DONE_TASK.length, index).trim()
                                       : this.taskText.substring(Symbol.SYMBOL_DONE_TASK.length).trim();
        }
        if (this.isCancelled()) {
            var index= this.taskText.indexOf(toTag(Action.ACTION_CANCELLED));
            return index !== -1 ? this.taskText.substring(Symbol.SYMBOL_CANCEL_TASK.length, index).trim()
                                       : this.taskText.substring(Symbol.SYMBOL_CANCEL_TASK.length).trim();
        }
        return this.taskText.substring(Symbol.SYMBOL_NEW_TASK.length).trim();
    }

    public isEmpty(): boolean {
        return !this.getDescription().trim();
    }

    public isDone(): boolean {
        return this.taskText.indexOf(Symbol.SYMBOL_DONE_TASK) !== -1;
    }

    public isCancelled(): boolean {
        return this.taskText.indexOf(Symbol.SYMBOL_CANCEL_TASK) !== -1;
    }

    public hasTag(tag: string): boolean {
        return this.taskText.toLocaleLowerCase().indexOf(toTag(tag).toLocaleLowerCase()) !== -1;
    }

    public getTagRanges(tag: string): Range[] {
        var result:Range[]= [];
        var regEx= /@[^@\s]+/g  ;
        var match;
        while (match = regEx.exec(this.taskText)) {
            if (toTag(tag).toLocaleLowerCase() === match[0].toLocaleLowerCase()) {
                let start:Position= this.taskLine.range.start;
                let startPosition= new Position(start.line, this.taskLine.firstNonWhitespaceCharacterIndex + match.index);
                let endPosition= new Position(start.line, this.taskLine.firstNonWhitespaceCharacterIndex + match.index + match[0].length);
                result.push(new Range(startPosition, endPosition));
            }
        }
        return result;
    }

    public getTags(): string[] {
        var result= [];
        var regEx= /@[^@\s]+/g  ;
        var match;
        while (match = regEx.exec(this.taskText)) {
            if (toTag(Action.ACTION_CANCELLED) !== match[0] && toTag(Action.ACTION_DONE) !== match[0]) {
                result.push(match[0]);
            }
        }
        return result;
    }

    public getTagsRanges(): Range[] {
        let result:Range[]= [];
        const regEx= /@[^@\s]+/g;
        let match;
        while (match = regEx.exec(this.taskText)) {
            if (toTag(Action.ACTION_CANCELLED) !== match[0] && toTag(Action.ACTION_DONE) !== match[0]) {
                let start:Position= this.taskLine.range.start;
                let startPosition= new Position(start.line, this.taskLine.firstNonWhitespaceCharacterIndex + match.index);
                let endPosition= new Position(start.line, this.taskLine.firstNonWhitespaceCharacterIndex + match.index + match[0].length);
                result.push(new Range(startPosition, endPosition));
            }
        }
        return result;
    }
}
