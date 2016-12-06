'use strict';

import { TextEditor, TextEditorEdit, Range, Position, TextLine } from 'vscode';
import {TodoDocument} from './TodoDocument';
import TodoDocumentDecorator from './TodoDocumentDecorator';

import {Symbol, Action} from './TodoConstants';
import {toTag} from './TodoUtil';

export class TodoDocumentEditor {
    constructor(private _textEditor: TextEditor, private _textEditorEdit: TextEditorEdit) {
    }

    public createNewTask() {
        let todoDocument= new TodoDocument(this._textEditor.document);
        let task= todoDocument.getTask(this._textEditor.selection.active);
        
        if (task) {
            // TODO: Create task in the next line
            return;
        }

        let taskLine= this._textEditor.document.lineAt(this._textEditor.selection.active);
        let taskDescription= taskLine.text.trim();
        this.updateTask(taskLine, taskDescription, Symbol.SYMBOL_NEW_TASK);
    }

    public completeCurrentTask() {
        let todoDocument= new TodoDocument(this._textEditor.document);
        let pos= this._textEditor.selection.active;
        var task= todoDocument.getTask(pos);
        
        if (!task || task.isEmpty()) {
            return;
        }

        if (task.isDone()) {
            this.updateTask(task.taskLine, task.getDescription(), Symbol.SYMBOL_NEW_TASK);
            return;
        }

        this.updateTask(task.taskLine, task.getDescription(), Symbol.SYMBOL_DONE_TASK, Action.ACTION_DONE);
    }

    public cancelCurrentTask() {
        let todoDocument= new TodoDocument(this._textEditor.document);
        let pos= this._textEditor.selection.active;
        var task= todoDocument.getTask(pos);
        
        if (!task) {
            return;
        }
        if (task.isEmpty()) {
            return;
        }
        if (task.isDone()) {
            return;
        }
        if (task.isCancelled()) {
            return;
        }

        this.updateTask(task.taskLine, task.getDescription(), Symbol.SYMBOL_CANCEL_TASK, Action.ACTION_CANCELLED);
    }

    public archiveDoneTasks() {
        let todoDocument= new TodoDocument(this._textEditor.document);
        let pos= this._textEditor.selection.active;
        var task= todoDocument.getTask(pos);
        
        if (!task) {
            return;
        }
        if (task.isEmpty()) {
            return;
        }

//        this.updateTask(task.taskLine, task.getDescription(), Symbol.SYMBOL_CANCEL_TASK, Action.ACTION_CANCELLED);
    }

    private updateTask(taskLine: TextLine, taskDescription: string, symbol: string, tag?: string) {
        var timestamp = new Date(); 
        this._textEditorEdit.delete(new Range(new Position(taskLine.lineNumber, taskLine.firstNonWhitespaceCharacterIndex), taskLine.range.end));
        this.insertTask(new Position(taskLine.lineNumber, taskLine.firstNonWhitespaceCharacterIndex), symbol + " " + taskDescription + (tag ? (" " + toTag(tag)+' (' + timestamp.toLocaleString() + ')'): ""));
    }

    private insertTask(pos: Position, task: string) {
        this._textEditorEdit.insert(pos, task);
        new TodoDocumentDecorator(this._textEditor).performDecoration();
    }
}
