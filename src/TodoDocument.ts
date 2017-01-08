'use strict';

import {TextDocument, TextLine, Position} from 'vscode';
import Task from './Task';
import {Symbol} from './TodoConstants';

const ARCHIVE_PROJECT_SEPARATOR_LINE = '＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿';

export class TodoDocument {

    constructor(private _textDocument: TextDocument) {
    }

    public getProject(pos: Position): Project {
        let line= this._textDocument.lineAt(pos.line);
        let projectText= line.text.trim();
        if (projectText.endsWith(Symbol.SYMBOL_PROJECT)) {
            return new Project(line.text, pos);
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

    public getProjects(): Project[] {
        let projects: Project[] = [];
        
        var text= this._textDocument.getText();
        var regEx= /^\s?\w+:$/gm;
        var match;

        while (match = regEx.exec(text)) {
            let position= this._textDocument.positionAt(match.index + 1);

            let projectTaskSeparatorLine = this._textDocument.lineAt(position.line - 1);
            if (projectTaskSeparatorLine.text.match(ARCHIVE_PROJECT_SEPARATOR_LINE)) {
                projects.push(new Project(match[0].trim(), position, true));
            } else {
                projects.push(new Project(match[0].trim(), position));
                // this.insertNewArchiveProject();
            }
        }

        return projects;
    }

    public insertNewArchiveProject() {

    }
}

export class Project {
    constructor(public name: string, public position: Position, public archive: Boolean = false) {
        if (name.endsWith(Symbol.SYMBOL_PROJECT)) {
            this.name = this.name.substring(0, name.length - 1);
        }
    }
}