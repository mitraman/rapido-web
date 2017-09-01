import TreeParser from '../../../src/js/modules/vocabulary/TreeParser.js';

describe('Vocabulary Tree Parser', function() {

  beforeAll(function() {
      this.treeParser = new TreeParser();
  })

  it('should generate a list of words from valid JSON request and response bodies', function() {
    let root = {
      name: 'root',
      data: {
        get:{
          request:
          {
            contentType: 'application/json',
            queryParams: '',
            body: '{"key1": "value1"}'
          },
          response:
          {
            contentType: 'application/json',
            status: '200',
            body: '{}'
          }
        },
        post: {
          request:
          {
            contentType: 'application/json',
            queryParams: '',
            body: '{"key1": "value1"}'
          },
          response:
          {
            contentType: 'application/json',
            status: '200',
            body: '{"key2": "value2"}'
          }
        }
      },
      children: [
        { name: 'child1', data: { get:{ request: { contentType: 'application/json', body: '{"key3":{ "obj1.key1": { "obj1.subObj1.key1": "value"}}}'}, response: { body: '{}'}}}},
        { name: 'child2', data: { get:{ request: { contentType: 'application/json', body: '{"key4":"value"'}, response: { contentType: 'application/json', body: '{}'}}}, children: [
          { name: 'grandchild1', data: { put: { request: {contentType: 'application/json', body: '{"key5": "value"}'}, response: {contentType: 'application/json', body: '{"key6": ["value", "value2", { "key8": "val"}]}'} } }}
        ] }
      ]
    }
    let tree = {};
    tree.rootNode = root;
    let vocabulary = this.treeParser.parseTree(tree.rootNode);
    console.log(vocabulary);
    expect(vocabulary.length).toBe(12);
    expect(vocabulary.indexOf('root')).not.toBeLessThan(0);
    expect(vocabulary.indexOf('key1')).not.toBeLessThan(0);
    expect(vocabulary.indexOf('key2')).not.toBeLessThan(0);
  });

});
