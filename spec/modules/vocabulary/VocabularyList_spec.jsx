import React from 'react';
import VocabularyList from '../../../src/js/modules/vocabulary/VocabularyList.jsx';
import ReactTestUtils from 'react-addons-test-utils';
import { shallow, mount } from 'enzyme';


describe('Vocabulary Component', function() {

  const vocabList = [
    {word: 'word 1', sketches: [12,13]},
    {word: 'word 2', sketches: []},
    {word: 'word 3', sketches: [12]},
    {word: 'word 4', sketches: []}
  ];


  describe('Layout', function() {

    it('should display a single column of words if no column number is specified', function() {

      const wrapper = mount(<VocabularyList vocabulary={vocabList}/>);
      expect(wrapper.find('div.vocabularyWord').length).toBe(vocabList.length);

      // Make sure that the list is in a single bootstrap column
      expect(wrapper.find('div.vocabularyListColumn').length).toBe(1);
    });

    it('should display two columns of words', function() {
      const wrapper = mount(<VocabularyList vocabulary={vocabList} numberOfColumns="2"/>);
      expect(wrapper.find('div.vocabularyWord').length).toBe(vocabList.length);

      // Make sure that the list is in a single bootstrap column
      expect(wrapper.find('div.vocabularyListColumn').length).toBe(2);
    })


    it('should display three columns of words', function() {

      const wrapper = mount(<VocabularyList vocabulary={vocabList}  numberOfColumns="3"/>);
      expect(wrapper.find('div.vocabularyWord').length).toBe(vocabList.length);

      // Make sure that the list is in a single bootstrap column
      expect(wrapper.find('div.vocabularyListColumn').length).toBe(3);
    })

    it('should display four columns of words', function() {
      const wrapper = mount(<VocabularyList vocabulary={vocabList}  numberOfColumns="4"/>);
      expect(wrapper.find('div.vocabularyWord').length).toBe(vocabList.length);

      // Make sure that the list is in a single bootstrap column
      expect(wrapper.find('div.vocabularyListColumn').length).toBe(4);
    })

    it('should display four columns even if five columns are specified', function() {
      const wrapper = mount(<VocabularyList vocabulary={vocabList}  numberOfColumns="5"/>);
      expect(wrapper.find('div.vocabularyWord').length).toBe(vocabList.length);

      // Make sure that the list is in a single bootstrap column
      expect(wrapper.find('div.vocabularyListColumn').length).toBe(4);

    })

  })

  describe('List', function() {
    it('should render the complete vocabulary list if no filter is specified', function() {
      const wrapper = mount(<VocabularyList vocabulary={vocabList} />);

      let words = wrapper.find('div.vocabularyWord');

      expect(words.length).toBe(vocabList.length);

      for(let i = 0; i < words.length; i++ ) {
        expect((words.get(i).textContent)).toBe(vocabList[i].word);
      }
    })

    //TODO: Should we allow the user to edit words?  What about dependencies - should we edit all occurances of the word in sketches?

  })

});
