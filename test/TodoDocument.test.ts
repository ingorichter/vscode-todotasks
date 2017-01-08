import * as assert from 'assert';
import {expect} from 'chai';
import { CompletionItem, TextDocument, Position, TextLine } from 'vscode';
import {TodoDocument, Project} from '../src/TodoDocument';

suite("TodoDocument Tests", () => {
    // test("should return a ", (done) => {
    //     let promise:Promise<CompletionItem[]>= TagsProvider.getTags();
    //     promise.then((actuals: CompletionItem[]) => {
    //         expect(actuals.length).equals(4);
    //         expect(actuals[0].label).equals("@critical");
    //         expect(actuals[1].label).equals("@high");
    //         expect(actuals[2].label).equals("@low");
    //         expect(actuals[3].label).equals("@today");
    //         done();
    //     });
    // });

    function newProject(name, line = 1, char = 1, archive = false) {
        return new Project(name, new Position(line, char), archive);
    }

    test("should return an array of top level projects", () => {
        const positions:Position[] = [new Position(1, 1), new Position(2, 1)];
        let functionCallCount = 0;
        const text : String[] = ['Project1:', 'Project2:'];

        const document : TextDocument = <TextDocument> {
            getText() {
                return text.join('\n');
            },
            positionAt(offset: Number) {
                return positions[functionCallCount++];
            },
            lineAt(line: Number) {
                return {text: text[line.toFixed()]};
            }
        };

        const todoDocument:TodoDocument = new TodoDocument(document);
        const projects:Project[] = [newProject('Project1'), newProject('Project2', 2, 1)];

        expect(todoDocument.getProjects()).to.deep.equal(projects);
    });

    test("should return an array of top level and nested projects", () => {
        const positions:Position[] = [new Position(1, 1), new Position(2, 1), new Position(3, 1), new Position(4, 1)];
        let functionCallCount = 0;
        const text : String[] = ['Project1:', 'Project2:', 'Project3:', 'Project4:'];

        const document : TextDocument = <TextDocument> {
            getText() {
                return text.join('\n');
            },
            positionAt(offset: Number) {
                return positions[functionCallCount++];
            },
            lineAt(line: Number) {
                return {text: text[line.toFixed()]};
            }
        };

        const todoDocument:TodoDocument = new TodoDocument(document);
        const projects:Project[] = [newProject('Project1'), newProject('Project2', 2, 1), newProject('Project3', 3, 1), newProject('Project4', 4, 1)];

        expect(todoDocument.getProjects()).to.deep.equal(projects);
    });

    test("should return the archive project", () => {
        const text : String[] = ['＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿', 'Archive:'];
        const document : TextDocument = <TextDocument> {
            getText() {
                return text.join('\n');
            },
            positionAt(offset: Number) {
                return new Position(1, 1);
            },
            lineAt(line: Number) {
                return {text: text[line.toFixed()]};
            }
        };

        const todoDocument:TodoDocument = new TodoDocument(document);
        const projects:Project[] = [newProject('Archive', 1, 1, true)];

        expect(todoDocument.getProjects()).to.deep.equal(projects);
    });

    test("should not return an archive project", () => {
        const text : String[] = ['Archive'];
        const document : TextDocument = <TextDocument> {
            getText() {
                return "Archive:\n";
            },
            positionAt(offset: Number) {
                return new Position(1, 1);
            },
            lineAt(line: Number) {
                return {text: text[line.toFixed()]};
            }
        };

        const todoDocument:TodoDocument = new TodoDocument(document);
        const projects:Project[] = [newProject('Archive', 1, 1)];

        expect(todoDocument.getProjects()).to.deep.equal(projects);
    });
});