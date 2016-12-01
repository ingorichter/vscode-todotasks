'use strict';

import {TextDocument, TextLine, Position, CompletionItem, Range} from 'vscode';
import Task from './Task';
import {Symbol, Tag, Action} from './TodoConstants';

export class TodoDocument {

    constructor(private _textDocument: TextDocument) {
    }

    public getProject(pos: Position): Project {
        let line= this._textDocument.lineAt(pos.line)
        let projectText= line.text.trim();
        if (projectText.endsWith(Symbol.SYMBOL_PROJECT)) {
            return new Project(line);
        }
        return null;
    }

    public getTasks(): Task[] {
        let result: Task[]= [];
        var text= this._textDocument.getText();
        var regEx= /^\s*[☐|✘|✔]/gm;
        var match;
        while (match = regEx.exec(text)) {
            let line= this._textDocument.lineAt(this._textDocument.positionAt(match.index + 1).line);
            result.push(new Task(line));
        }
        return result;
    }

    public getTask(pos: Position): Task {
        if (!this.isTask(pos)) {
            return null;
        }

        let line= this._textDocument.lineAt(pos.line);
        return new Task(line);
    }

    public isTask(pos: Position): boolean {
        let task= this._textDocument.lineAt(pos.line).text.trim();
        return task.startsWith(Symbol.SYMBOL_NEW_TASK.toString()) 
                    || task.startsWith(Symbol.SYMBOL_CANCEL_TASK.toString())
                    || task.startsWith(Symbol.SYMBOL_DONE_TASK.toString());
    }
}

export class Project {
    constructor(public line: TextLine) {
    }
}