
const O = [] // Удивительно, правда)

const KeyWord = [
  'ALL', 'DISTINCT', 'FROM', 'WHERE', 'GROUP BY', 'HAVING', 'WINDOW',
  'UNION', 'INTERSECT', 'EXCEPT', 'ORDER BY', 'LIMIT', 'OFFSET',
  'FETCH', 'FOR',
  'A', 'ABORT', 'ABS', 'ABSENT', 'ABSOLUTE', 'ACCESS', 'ACCORDING', 'ACTION',
  'ADA', 'ADD', 'ADMIN', 'AFTER', 'AGGREGATE', 'ALL', 'ALLOCATE', 'ALSO', 'ALTER',
  'ALWAYS', 'ANALYSE', 'ANALYZE', 'AND', 'ANY', 'ARE', 'ARRAY', 'ARRAY_AGG',
  'ARRAY_MAX_CARDINALITY', 'AS', 'ASC', 'ASENSITIVE', 'ASSERTION', 'ASSIGNMENT',
  'ASYMMETRIC', 'AT', 'ATOMIC', 'ATTRIBUTE', 'ATTRIBUTES', 'AUTHORIZATION',
  'AVG', 'BACKWARD', 'BASE64', 'BEFORE', 'BEGIN', 'BEGIN_FRAME', 'BEGIN_PARTITION',
  'BERNOULLI', 'BETWEEN', 'BIGINT', 'BINARY', 'BIT', 'BIT_LENGTH', 'BLOB', 'BLOCKED',
  'BOM', 'BOOLEAN', 'BOTH', 'BREADTH', 'BY', 'C', 'CACHE', 'CALL', 'CALLED', 'CARDINALITY',
  'CASCADE', 'CASCADED', 'CASE', 'CAST', 'CATALOG', 'CATALOG_NAME', 'CEIL', 'CEILING',
  'CHAIN', 'CHAR', 'CHARACTER', 'CHARACTERISTICS', 'CHARACTERS', 'CHARACTER_LENGTH',
  'CHARACTER_SET_CATALOG', 'CHARACTER_SET_NAME', 'CHARACTER_SET_SCHEMA', 'CHAR_LENGTH',
  'CHECK', 'CHECKPOINT', 'CLASS', 'CLASS_ORIGIN', 'CLOB', 'CLOSE', 'CLUSTER', 'COALESCE',
  'COBOL', 'COLLATE', 'COLLATION', 'COLLATION_CATALOG', 'COLLATION_NAME', 'COLLATION_SCHEMA',
  'COLLECT', 'COLUMN', 'COLUMNS', 'COLUMN_NAME', 'COMMAND_FUNCTION', 'COMMAND_FUNCTION_CODE',
  'COMMENT', 'COMMENTS', 'COMMIT', 'COMMITTED', 'CONCURRENTLY', 'CONDITION', 'CONDITION_NUMBER',
  'CONFIGURATION', 'CONNECT', 'CONNECTION', 'CONNECTION_NAME', 'CONSTRAINT', 'CONSTRAINTS',
  'CONSTRAINT_CATALOG', 'CONSTRAINT_NAME', 'CONSTRAINT_SCHEMA', 'CONSTRUCTOR',
  'CONTAINS', 'CONTENT', 'CONTINUE', 'CONTROL', 'CONVERSION', 'CONVERT', 'COPY',
  'CORRESPONDING', 'COST', 'COUNT', 'COVAR_POP', 'COVAR_SAMP', 'CREATE', 'CROSS', 'CSV', 'CUBE',
  'CUME_DIST', 'CURRENT', 'CURRENT_CATALOG', 'CURRENT_DATE', 'CURRENT_DEFAULT_TRANSFORM_GROUP',
  'CURRENT_PATH', 'CURRENT_ROLE', 'CURRENT_SCHEMA', 'CURRENT_ROW', 'CURRENT_TIME', 'CURRENT_TIMESTAMP',
  'CURRENT_TRANSFORM_GROUP_FOR_TYPE', 'CURRENT_USER', 'CURSOR', 'CURSOR_NAME', 'CYCLE',
  'DATA', 'DATABASE', 'DATALINK', 'DATE', 'DATETIME_INTERVAL_CODE', 'DATETIME_INTERVAL_PRECISION', 'DAY', 'DB', 'DEALLOCATE',
  'DEC', 'DECIMAL', 'DECLARE', 'DEFAULT', 'DEFAULTS', 'DEFERRABLE', 'DEFERRED', 'DEFINED', 'DEFINER', 'DEGREE', 'DELETE', 'DELIMITER', 'DELIMITERS', 'DENSE_RANK', 'DEPTH',
  'DEREF', 'DERIVED', 'DESC', 'DESCRIBE', 'DESCRIPTOR', 'DETERMINISTIC', 'DIAGNOSTICS', 'DICTIONARY', 'DISABLE', 'DISCARD', 'DISCONNECT', 'DISPATCH', 'DISTINCT', 'DLNEWCOPY', 'DLPREVIOUSCOPY', 'DLURLCOMPLETE', 'DLURLCOMPLETEONLY', 'DLURLCOMPLETEWRITE', 'DLURLPATH', 'DLURLPATHONLY', 'DLURLPATHWRITE', 'DLURLSCHEME', 'DLURLSERVER', 'DLVALUE', 'DO', 'DOCUMENT', 'DOMAIN', 'DOUBLE', 'DROP', 'DYNAMIC', 'DYNAMIC_FUNCTION', 'DYNAMIC_FUNCTION_CODE',
  'EACH', 'ELEMENT', 'EMPTY', 'ENABLE', 'ENCODING', 'ENCRYPTED', 'END', 'EXEC', 'END_FRAME', 'END_PARTITION', 'ENFORCED', 'ENUM', 'EQUALS', 'ESCAPE', 'EVENT', 'EVERY', 'EXCEPTION', 'EXCLUDE', 'EXCLUDING', 'EXCLUSIVE', 'EXEC', 'EXECUTE', 'EXISTS', 'EXP', 'EXPLAIN', 'EXPRESSION', 'EXTENSION', 'EXTERNAL', 'EXTRACT', 'FAMILY', 'FILE', 'FILTER', 'FINAL', 'FIRST', 'FIRST_VALUE', 'FLAG', 'FLOAT', 'FLOOR', 'FOLLOWING', 'FORCE', 'FORTRAN', 'FORWARD', 'FOUND', 'FRAME_ROW', 'FREE', 'FREEZE', 'FS', 'FULL', 'FUNCTION', 'FUNCTIONS', 'FUSION', 'G', 'GENERAL', 'GENERATED', 'GET', 'GLOBAL', 'GO', 'GOTO', 'GRANTED', 'GREATEST', 'GROUPING', 'GROUPS', 'HANDLER', 'HEADER', 'HEX', 'HIERARCHY', 'HOLD', 'HOUR', 'ID', 'IDENTITY', 'IF', 'IGNORE', 'ILIKE', 'IMMEDIATE', 'IMMEDIATELY', 'IMMUTABLE', 'IMPLEMENTATION', 'IMPLICIT', 'IMPORT', 'INCLUDING', 'INCREMENT', 'INDENT', 'INDEX', 'INDEXES', 'INDICATOR', 'INHERIT', 'INHERITS', 'INITIALLY', 'INLINE', 'INNER', 'INOUT', 'INPUT', 'INSENSITIVE', 'INSERT', 'INSTANCE', 'INSTANTIABLE', 'INSTEAD', 'INT', 'INTEGER', 'INTEGRITY', 'INTERSECTION', 'INTERVAL', 'INVOKER', 'IS', 'ISNULL', 'ISOLATION', 'JOIN', 'K', 'KEY', 'KEY_MEMBER', 'KEY_TYPE', 'LABEL', 'LAG', 'LANGUAGE', 'LARGE', 'LAST', 'LAST_VALUE', 'LATERAL', 'LC_COLLATE', 'LC_CTYPE', 'LEAD', 'LEAKPROOF', 'LEAST', 'LEFT', 'LENGTH', 'LEVEL', 'LIBRARY', 'LIKE', 'LIKE_REGEX', 'LIMIT', 'LINK', 'LISTEN', 'LN', 'LOAD', 'LOCAL', 'LOCALTIME', 'LOCALTIMESTAMP', 'LOCATION', 'LOCATOR', 'LOCK', 'LOWER', 'M', 'MAP', 'MAPPING', 'MATCH', 'MATCHED', 'MATERIALIZED', 'MAX', 'MAXVALUE', 'MAX_CARDINALITY', 'MEMBER', 'MERGE', 'MESSAGE_LENGTH', 'MESSAGE_OCTET_LENGTH', 'MESSAGE_TEXT', 'METHOD', 'MIN', 'MINUTE', 'MINVALUE', 'MOD', 'MODE', 'MODIFIES', 'MODULE', 'MONTH', 'MORE', 'MOVE', 'MULTISET', 'MUMPS', 'NAME', 'NAMES', 'NAMESPACE', 'NATIONAL', 'NATURAL', 'NCHAR', 'NCLOB', 'NESTING', 'NEW', 'NEXT', 'NFC', 'NFD', 'NFKC', 'NFKD', 'NIL', 'NO', 'NONE', 'NORMALIZE', 'NORMALIZED', 'NOTHING', 'NOTIFY', 'NOTNULL', 'NOWAIT', 'NTH_VALUE', 'NTILE', 'NULLABLE', 'NULLIF', 'NULLS', 'NUMBER', 'NUMERIC', 'OBJECT', 'OCCURRENCES_REGEX', 'OCTETS', 'OCTET_LENGTH', 'OF', 'OFF', 'OFFSET', 'OIDS', 'OLD', 'OPEN', 'OPERATOR', 'OPTION', 'OPTIONS', 'ORDERING', 'ORDINALITY', 'OTHERS', 'OUT', 'OUTER', 'OUTPUT', 'OVER', 'OVERLAPS', 'OVERLAY', 'OVERRIDING', 'OWNED', 'OWNER', 'P', 'PAD', 'PARAMETER', 'PARAMETER_MODE', 'PARAMETER_NAME', 'PARAMETER_ORDINAL_POSITION', 'PARAMETER_SPECIFIC_CATALOG', 'PARAMETER_SPECIFIC_NAME', 'PARAMETER_SPECIFIC_SCHEMA', 'PARSER', 'PARTIAL', 'PARTITION', 'PASCAL', 'PASSING', 'PASSTHROUGH', 'PASSWORD', 'PATH', 'PERCENT', 'PERCENTILE_CONT', 'PERCENTILE_DISC', 'PERCENT_RANK', 'PERIOD', 'PERMISSION', 'PLACING', 'PLANS', 'PLI', 'PORTION', 'POSITION', 'POSITION_REGEX', 'POWER', 'PRECEDES', 'PRECEDING', 'PRECISION', 'PREPARE', 'PREPARED', 'PRESERVE', 'PRIOR', 'PRIVILEGES', 'PROCEDURAL', 'PROCEDURE', 'PROGRAM', 'PUBLIC',
  'QUOTE', 'RANGE', 'RANK', 'READ', 'READS', 'REAL', 'REASSIGN', 'RECHECK', 'RECOVERY', 'RECURSIVE', 'REF', 'REFERENCES', 'REFERENCING', 'REFRESH', 'REGR_AVGX', 'REGR_AVGY', 'REGR_COUNT', 'REGR_INTERCEPT', 'REGR_R2', 'REGR_SLOPE', 'REGR_SXX', 'REGR_SXY', 'REGR_SYY', 'REINDEX', 'RELATIVE', 'RELEASE', 'RENAME', 'REPEATABLE', 'REPLACE', 'REPLICA', 'REQUIRING', 'RESET', 'RESPECT', 'RESTART', 'RESTORE', 'RESTRICT', 'RESULT', 'RETURN', 'RETURNED_CARDINALITY', 'RETURNED_LENGTH', 'RETURNED_OCTET_LENGTH', 'RETURNED_SQLSTATE', 'RETURNING', 'RETURNS', 'REVOKE', 'RIGHT', 'ROLE', 'ROLLBACK', 'ROLLUP', 'ROUTINE', 'ROUTINE_CATALOG', 'ROUTINE_NAME', 'ROUTINE_SCHEMA', 'ROW', 'ROWS', 'ROW_COUNT', 'ROW_NUMBER', 'RULE', 'SAVEPOINT', 'SCALE', 'SCHEMA', 'SCHEMA_NAME', 'SCOPE', 'SCOPE_CATALOG', 'SCOPE_NAME', 'SCOPE_SCHEMA', 'SCROLL', 'SEARCH', 'SECOND', 'SECTION', 'SECURITY', 'SELECT', 'SELECTIVE', 'SELF', 'SENSITIVE', 'SEQUENCE', 'SEQUENCES', 'SERIALIZABLE', 'SERVER', 'SERVER_NAME', 'SESSION', 'SESSION_USER', 'SET', 'SETOF', 'SETS', 'SHARE', 'SHOW', 'SIMILAR', 'SIMPLE', 'SIZE', 'SMALLINT', 'SNAPSHOT', 'SOME', 'SOURCE', 'SPACE', 'SPECIFIC', 'SPECIFICTYPE', 'SPECIFIC_NAME', 'SQL', 'SQLCODE', 'SQLERROR', 'SQLEXCEPTION', 'SQLSTATE', 'SQLWARNING', 'SQRT', 'STABLE', 'STANDALONE', 'START', 'STATE', 'STATEMENT', 'STATIC', 'STATISTICS', 'STDDEV_POP', 'STDDEV_SAMP', 'STDIN', 'STDOUT', 'STORAGE', 'STRICT', 'STRIP', 'STRUCTURE', 'STYLE', 'SUBCLASS_ORIGIN', 'SUBMULTISET', 'SUBSTRING', 'SUBSTRING_REGEX', 'SUCCEEDS', 'SUM', 'SYMMETRIC', 'SYSID', 'SYSTEM', 'SYSTEM_TIME', 'SYSTEM_USER', 'T', 'TABLE', 'TABLES', 'TABLESAMPLE', 'TABLESPACE', 'TABLE_NAME', 'TEMP', 'TEMPLATE', 'TEMPORARY', 'TEXT', 'THEN', 'TIES', 'TIME', 'TIMESTAMP', 'TIMEZONE_HOUR', 'TIMEZONE_MINUTE', 'TO', 'TOKEN', 'TOP_LEVEL_COUNT', 'TRAILING', 'TRANSACTION', 'TRANSACTIONS_COMMITTED', 'TRANSACTIONS_ROLLED_BACK', 'TRANSACTION_ACTIVE', 'TRANSFORM', 'TRANSFORMS', 'TRANSLATE', 'TRANSLATE_REGEX', 'TRANSLATION', 'TREAT', 'TRIGGER', 'TRIGGER_CATALOG', 'TRIGGER_NAME', 'TRIGGER_SCHEMA', 'TRIM', 'TRIM_ARRAY', 'TRUE', 'TRUNCATE', 'TRUSTED', 'TYPE', 'TYPES', 'UESCAPE', 'UNBOUNDED', 'UNCOMMITTED', 'UNDER', 'UNENCRYPTED', 'UNION', 'UNIQUE', 'UNKNOWN', 'UNLINK', 'UNLISTEN', 'UNLOGGED', 'UNNAMED', 'UNNEST', 'UNTIL', 'UNTYPED', 'UPDATE', 'UPPER', 'URI', 'USAGE', 'USER', 'USER_DEFINED_TYPE_CATALOG', 'USER_DEFINED_TYPE_CODE', 'USER_DEFINED_TYPE_NAME', 'USER_DEFINED_TYPE_SCHEMA', 'USING', 'VACUUM', 'VALID', 'VALIDATE', 'VALIDATOR', 'VALUE', 'VALUES', 'VALUE_OF', 'VARBINARY', 'VARCHAR', 'VARIADIC', 'VARYING', 'VAR_POP', 'VAR_SAMP', 'VERBOSE', 'VERSION', 'VERSIONING', 'VIEW', 'VOLATILE', 'WHEN', 'WHENEVER', 'WHERE', 'WHITESPACE', 'WIDTH_BUCKET', 'WINDOW', 'WITH', 'WITHIN', 'WITHOUT', 'WORK', 'WRAPPER', 'WRITE', 'XML', 'XMLAGG', 'XMLATTRIBUTES', 'XMLBINARY', 'XMLCAST', 'XMLCOMMENT', 'XMLCONCAT', 'XMLDECLARATION', 'XMLDOCUMENT', 'XMLELEMENT', 'XMLEXISTS', 'XMLFOREST', 'XMLITERATE', 'XMLNAMESPACES', 'XMLPARSE', 'XMLPI', 'XMLQUERY', 'XMLROOT', 'XMLSCHEMA', 'XMLSERIALIZE', 'XMLTABLE', 'XMLTEXT', 'XMLVALIDATE', 'YEAR', 'YES', 'ZONE'
]

const FormingResult = (state, data) => {
  switch (state) {
    case 'O':
      return O;
    case 'Start':
      return ['WIDTH','SELECT']
    case 'AD' :
      return([
        'ON','FROM','WHERE','GROUP BY','HAVING','WINDOW',
        'UNION','INTERSECT','EXCEPT','ORDER BY','LIMIT','OFFSET','FETCH',
        'FOR',
        ...FormingResult('ColumnName',data)
      ])
    case 'Main' : 
      return([
        'ALL','DISTINCT','FROM','WHERE','GROUP BY','HAVING','WINDOW',
        'UNION','INTERSECT','EXCEPT','ORDER BY','LIMIT','OFFSET','FETCH',
        'FOR',
        ...FormingResult('ColumnName',data)
      ])
    case 'TableName':
      return ([
        ...data.consultant.reduce((ar, current) => { return ([...ar, { name: current.table, scheme: 'consultant' }]) }, []),
        ...data.uploaded.reduce((ar, current) => { return ([...ar, { name: current.table, scheme: 'uploaded' }]) }, []),
        ...data.userbase.reduce((ar, current) => { return ([...ar, { name: current.table, scheme: 'userbase' }]) }, []),
      ]);
    case 'ColumnName': {  
      return ([
        '*',
        ...data.consultant.reduce((ar, current) => { return ([...ar, ...current.columns.map((el) => { return ({ ...el, table: current.table }) })]) }, []),
        ...data.uploaded.reduce((ar, current) => { return ([...ar, ...current.columns.map((el) => { return ({ ...el, table: current.table }) })]) }, []),
        ...data.userbase.reduce((ar, current) => { return ([...ar, ...current.columns.map((el) => { return ({ ...el, table: current.table }) })]) }, []),
      ]);
    }
    default:
      return ([
        ...data.consultant.reduce((ar, current) => { return ([...ar, { name: current.table, scheme: 'consultant' }, ...current.columns.map((el) => { return ({ ...el, table: current.table }) })]) }, []),
        ...data.uploaded.reduce((ar, current) => { return ([...ar, { name: current.table, scheme: 'uploaded' }, ...current.columns.map((el) => { return ({ ...el, table: current.table }) })]) }, []),
        ...data.userbase.reduce((ar, current) => { return ([...ar, { name: current.table, scheme: 'userbase' }, ...current.columns.map((el) => { return ({ ...el, table: current.table }) })]) }, []),
        'ALL', 'DISTINCT', 'FROM', 'WHERE', 'GROUP BY', 'HAVING', 'WINDOW',
        'UNION', 'INTERSECT', 'EXCEPT', 'ORDER BY', 'LIMIT', 'OFFSET',
        'FETCH', 'FOR','SELECT','WIDTH'
      ]);
  }
}

const expression = (word) => {

}


const Analyzer = (string, data) => {

  let state = 'Start';
  let lexem = [];
  let lastSymbol = string.slice(-1);

  let str = false;
  let dstr = false;
  let cdol = 0;
  ( string
    .split(' ') || [])
      .filter((el)=>el!=='')
        .forEach((el)=> {
          console.log('!!!!',el)
          if (KeyWord.includes(el.toUpperCase())){lexem.push(el)}
          else {
            let i = 0;
            while(i < el.length){
              if ( str && (/\'/.test(el[i]) && !/\\/.test(el[i-1]))  ) {
                str=false;
                i++;
                lexem.push('@STR')
              } else
              if ( /\'/.test(el[i]) || ( /[BX]/.test(el[i]) && /\'/.test(el[i+1])) || (/U/.test(el[i]) && /\&/.test(el[i+1]) && /\'/.test(el[i+2])  )   || str ) {
                str=true;
                if (/\'/.test(el[i])) {i++} else
                if (( /[BX]/.test(el[i]) && /\'/.test(el[i+1]))) {i++;i++} else
                if ((/U/.test(el[i]) && /\&/.test(el[i+1]) && /\'/.test(el[i+2]))) {i++;i++;i++} else
                i++;
              } else
              if ( /\$/.test(el[i]) && cdol===3){
                cdol=0;
                dstr=false;
                lexem.push('@DSTR')
                i++;
              } else
              if ( /\$/.test(el[i]) || dstr ){
                if ( /\$/.test(el[i])  &&  /\d/.test(el[i+1]) ){
                  i++;i++;
                  while(/\d/.test(el[i])){
                    i++;
                  }
                  lexem.push('@PAR')
                } else 
                if (/\$/.test(el[i]))
                {
                  dstr = true;
                  i++;
                  cdol++;
                } else {i++}
              } 
              else 
              if ( /\w/.test(el[i]) && !(/\d/.test(el[i])) ){
                let word = ''
                while ( (/\w/.test(el[i]) || el[i] === '$' || el[i] === '.') && i < el.length ){
                  word=word + el[i];
                  i++;
                }
                if (KeyWord.includes(word.toUpperCase())){lexem.push(word)} else (lexem.push(word));
              } else 
              if ( /\d/.test(el[i]) || el[i]==='.'){
                let num = ''
                let stopper = true;
                let estate = false;
                if ( el[i] === '.') {num='.';i++;}
                while( /\d/.test(el[i]) || 
                          ( !(/\./g.test(num)) && !estate && /\./.test(el[i]))  || 
                              ( !/e/g.test(num) && /\d/g.test(num) && el[i]==='e' && stopper )){
                  if ( el[i] === 'e'){
                    estate=true;
                    if( i === (el.length-1) ) {stopper=false;}
                    else 
                    if ( /\d/.test(el[i+1])   ) {
                      num = num+el[i] + el[i+1];
                      i++;i++;
                    } else
                    if (/[\+\-]/.test(el[i+1]) ){
                      if (i === (el.length-2)){stopper=false;} else{
                        if ( /\d/.test(el[i+2]) ) {
                          num = num + el[i] + el[i+1] +  el[i+2];
                          i++;i++;i++
                        } else {stopper=false;}
                      }
                    } else {stopper=false;}
                  } else {
                    num = num+el[i];
                    i++;
                  }
                }
                lexem.push('@NUM')
              }
               else {lexem.push(el[i]);i++;}
            }
          }
        });

  let lex; 
  let lexs;

  if (lastSymbol === ' '){
    lex = ''
    lexs = lexem
  } else  {
    lex = lexem.slice(-1)[0] || ''
    lexs = lexem.slice(0,lexem.length-1)
  }   


  lexs.forEach((el)=>{
    switch(state){
      case 'Start' :
        if (el.toUpperCase() === 'SELECT' ) { state = 'Main'} else {state='ERROR'}
        break;
      case 'Main' :
        if (el.toUpperCase() === 'ALL' || el.toUpperCase() === 'DISTINCT' ) { state = 'AD'} else
        { state = 'ERROR' }
        break;
      case 'AD' :
        
        break;
      case 'EXPR' :
        
        break;
      default : state='ERROR'
    }
  })

  // console.log('Lex::',lex)  // Сортироем по последней лексеме
  // console.log('Lexem::',lexs) // Возвращаем элемент 
  // console.log('Result::', FormingResult(state,data)
  //                           .filter((el)=>{
  //                                 if (typeof(el)==='object'){
  //                                   return(el.name.toUpperCase().startsWith( lex.toUpperCase()) )
  //                                 } else {return(el.toUpperCase().startsWith( lex.toUpperCase()))}
  //                               }))

  return (FormingResult(state, data))
}

export {
  Analyzer
}