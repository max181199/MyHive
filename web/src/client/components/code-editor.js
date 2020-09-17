import React, {useState, useEffect, useRef} from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import AceEditor from "react-ace";

import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import "ace-builds/src-noconflict/mode-mysql";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/ext-language_tools";

const Root = styled.div`
  flex: 1;
`;

const Settings = styled.div`
  background-color: rgb(250, 250, 250);
  border-bottom: 1px solid rgb(224, 224, 224);
  padding: 7px;
  max-height: 45px;
`;


const CodeEditor = ({ tables }) => {
  const editor = useRef(null);
  const [value, setValue] = useState('');

  useEffect(() => {
    let wordList = [{
      caption: 'consultant',
      value: 'consultant',
      meta: ''
    }];
    for (const key in tables) {
      tables[key].map((table) => {
        wordList.push({
          caption: table.table,
          value: table.table,
          meta: ''
        });
        table.columns.map((column) => {
          wordList.push({
            caption: `${column.name}`,
            value: `${column.name}`,
            meta: ``
          });
        })
      })
    };
    
    const staticWordCompleter = {
      getCompletions: function(editor, session, pos, prefix, callback) {
          callback(null, wordList.map(function(word) {
              return word;
          }));
      }
    }
    editor.current.editor.setOption("enableBasicAutocompletion", [staticWordCompleter]);
  }, [tables])

	return (
    <Root>
      <Settings>
        <Tooltip title="Выполнить">
          <IconButton size="small">
            <PlayCircleOutlineIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Очистить">
          <IconButton size="small">
            <HighlightOffIcon />
          </IconButton>
        </Tooltip>
      </Settings>
      <AceEditor
        placeholder="Введите запрос"
        ref={editor}
        mode="mysql"
        theme="xcode"
        name="blah2"
        onChange={(value) => setValue(value)}
        fontSize={16}
        width="100%"
        height="calc(100% - 45px)"
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        value={value}
        setOptions={{
          enableLiveAutocompletion: false,
          enableSnippets: false,
          showLineNumbers: true,
          tabSize: 2,
        }}  
      />
    </Root>
  )
}

const mapStateToProps = ({ tables }) => {
  return { tables };
};

export default connect(mapStateToProps)(CodeEditor);
