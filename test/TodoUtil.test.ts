import * as assert from 'assert';
import {expect} from 'chai';
import {toTag} from '../src/TodoUtil';

suite("TodoUtil Tests", () => {
    test("should return a new tag", () => {
        expect(toTag('NewTag')).equals('@NewTag');
    });
});