import * as assert from 'assert';
import {expect} from 'chai';
import { CompletionItem, TextDocument } from 'vscode';
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

    test("should return an array of projects", () => {
        const document : TextDocument = <TextDocument> {
            getText() {
                return "Project1:\nProject2:\n";
            }
        };

        const todoDocument:TodoDocument = new TodoDocument(document);
        const projects:Project[] = [{name: 'Project1'}, {name: 'Project2'}];

        expect(todoDocument.getProjects()).to.deep.equal(projects);
    });
});