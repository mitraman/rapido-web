import React from 'react'
import ReactDOM from 'react-dom'

export default class extends React.Component{

  constructor(props) {
      super(props);
  }

  /* Render Method */
  render() {

    let words = [];
    let columns = []
    let numberOfColumns = (this.props.numberOfColumns) ? this.props.numberOfColumns: 1;


    if( numberOfColumns === 1) {
      this.props.vocabulary.forEach( (word, index) => {
        words.push(<div key={index} className="vocabularyWord">{word.word}</div>)
      });

      columns.push(<div key="1" className="col-md-12 vocabularyListColumn">{words}</div>);
    }else {

      if(numberOfColumns > 4 ) {
        console.warn('Vocabulary List can only display a maximum of 4 columns');
        numberOfColumns = 4;
      }
      // Calculate the bootstrap column size
      let bootstrapColumnSize = 12 / numberOfColumns;
      let bootstrapColumnClass = 'vocabularyListColumn col-md-'+bootstrapColumnSize;

      // Divide the words into columns
      let wordColumns = [];
      for(let i = 0; i < numberOfColumns; i++ ) {
        wordColumns.push([]);
      }

      let columnIndex = 0;
      for(let i = 0; i < this.props.vocabulary.length; i++ ) {
        let word = this.props.vocabulary[i].word;
        wordColumns[columnIndex].push(<div key={"word"+i} className="vocabularyWord">{word.word}</div>);
        if( columnIndex+1 < numberOfColumns) {
          columnIndex++;
        }else {
          columnIndex = 0;
        }
      }

      for(let i = 0; i < numberOfColumns; i++ ) {
        columns.push(<div key={"column"+i} className={bootstrapColumnClass}>{wordColumns[i]}</div> );
      }
    }


    return (
      <div className="vocabularyList row">
        {columns}
      </div>
    )
  }
}
