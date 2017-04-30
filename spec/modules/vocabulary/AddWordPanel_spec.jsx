import React from 'react';
import AddWordPanel from '../../../src/js/modules/vocabulary/AddWordPanel.jsx';
import ReactTestUtils from 'react-addons-test-utils';
import { shallow, mount } from 'enzyme';


describe('Add Vocabulary Words', function() {

    xit('should display a text field for new words', function() {

      const wrapper = mount(<VocabularyList vocabulary={vocabList}/>);
      expect(wrapper.find('div.vocabularyWord').length).toBe(vocabList.length);

      // Make sure that the list is in a single bootstrap column
      expect(wrapper.find('div.vocabularyListColumn').length).toBe(1);
    });

});
