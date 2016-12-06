'use strict';

import { commands, TextEditor, TextEditorEdit, CompletionItem} from 'vscode';
import { TodoDocumentEditor } from './TodoDocumentEditor';
import {Action} from './TodoConstants';
import {toTag} from './TodoUtil';

export class TodoCommands {
    public static NEW_TASK= "task.new";
    public static COMPLETE_TASK= "task.complete";
    public static CANCEL_TASK= "task.cancel";
    public static ARCHIVE_TASKS= "task.archive";

    public registerNewTaskCommand() {
        return commands.registerTextEditorCommand(TodoCommands.NEW_TASK, (textEditor: TextEditor, edit: TextEditorEdit) => {
            if (this.isSupportedLanguage(textEditor)) {
                new TodoDocumentEditor(textEditor, edit).createNewTask();
            }
        });
    }

    public registerCompleteTaskCommand() {
        return commands.registerTextEditorCommand(TodoCommands.COMPLETE_TASK, (textEditor: TextEditor, edit: TextEditorEdit) => {
            if (this.isSupportedLanguage(textEditor)) {
                new TodoDocumentEditor(textEditor, edit).completeCurrentTask();
            }
        });
    }

    public registerCancelTaskCommand() {
        return commands.registerTextEditorCommand(TodoCommands.CANCEL_TASK, (textEditor: TextEditor, edit: TextEditorEdit) => {
            if (this.isSupportedLanguage(textEditor)) {
                new TodoDocumentEditor(textEditor, edit).cancelCurrentTask();
            }
        });
    }

    private isSupportedLanguage(textEditor: TextEditor):boolean {
        return "todo" === textEditor.document.languageId;
    }

    public registerArchiveTasksCommand() {
        return commands.registerTextEditorCommand(TodoCommands.ARCHIVE_TASKS, (textEditor: TextEditor, edit: TextEditorEdit) => {
            if (this.isSupportedLanguage(textEditor)) {
                new TodoDocumentEditor(textEditor, edit).archiveDoneTasks();
            }
        });
    }
}

interface CommandObject {
    label: string;
    command: string; 
}

export class TodoCommandsProvider {

    private static COMMANDS: CommandObject[]= [{label: toTag(Action.ACTION_DONE), command: "Ctrl+Shift+d"},
                                    {label: toTag(Action.ACTION_CANCELLED), command: "Ctrl+Shift+c"}];

    public static getCommands(filter?: string):Promise<CompletionItem[]> {
        let filtered= TodoCommandsProvider.COMMANDS.filter((commandObject: CommandObject, index: number, collection: CommandObject[]): boolean =>{
                            return !filter || commandObject.label.indexOf(filter) !== -1;
                        });
        let result= filtered.map((commandObject: CommandObject, index: number, collection: CommandObject[]): CompletionItem =>{
                            var completionItem= new CompletionItem(commandObject.label);
                            return completionItem;
                        });
        return Promise.resolve(result);
    } 
}