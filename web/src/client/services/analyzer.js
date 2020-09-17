
const O = [] // Удивительно, правда)

const A = [
  'SELECT',
]

const B = [
  'FROM',
]

const FormingResult =  ( state , data , opt = null ) => {
  switch ( state ) {
    case 'O' : 
      return O;
    case 'A' :
      return A;
    case 'B' : 
      return B;
    case 'TableName' : 
      return ([
        ...data.consultant.reduce( (ar,current) => {return([...ar,{table : current.table, scheme : 'consultant' }])},[]),
        ...data.uploaded.reduce( (ar,current) => {return([...ar,{table : current.table, scheme : 'uploaded' }])},[]),
        ...data.userbase.reduce( (ar,current) => {return([...ar,{table : current.table, scheme : 'userbase' }])},[]),
      ]);
    case 'ColumnName' : {
         if ( opt === null ) {
          return([
            ...data.consultant.reduce( (ar,current) => {return([...ar,...current.columns.map( (el)=>{return({...el,table : current.table })})])},[]),
            ...data.uploaded.reduce( (ar,current) => {return([...ar,...current.columns.map( (el)=>{return({...el,table : current.table })})])},[]),
            ...data.userbase.reduce( (ar,current) => {return([...ar,...current.columns.map( (el)=>{return({...el,table : current.table })})])},[]),
          ]);
         } else {
           if ( opt.tableName ) {
            return([
              ...data.consultant.filter( (tb)=>opt.tableName.includes( tb.table )  ).reduce( (ar,current) => {return([...ar,...current.columns.map( (el)=>{return({...el,table : current.table })})])},[]),
              ...data.uploaded.filter( (tb)=>opt.tableName.includes( tb.table ) ).reduce( (ar,current) => {return([...ar,...current.columns.map( (el)=>{return({...el,table : current.table })})])},[]),
              ...data.userbase.filter( (tb)=>opt.tableName.includes( tb.table ) ).reduce( (ar,current) => {return([...ar,...current.columns.map( (el)=>{return({...el,table : current.table })})])},[]),
            ]);
           } else {
            return([
              ...data.consultant.reduce( (ar,current) => {return([...ar,...current.columns.map( (el)=>{return({...el,table : current.table })})])},[]),
              ...data.uploaded.reduce( (ar,current) => {return([...ar,...current.columns.map( (el)=>{return({...el,table : current.table })})])},[]),
              ...data.userbase.reduce( (ar,current) => {return([...ar,...current.columns.map( (el)=>{return({...el,table : current.table })})])},[]),
            ]);
           }
         }
      }
    default : 
      return([
        ...data.consultant.reduce( (ar,current) => {return([...ar,{table : current.table, scheme : 'consultant' },...current.columns.map( (el)=>{return({...el,table : current.table })})])},[]),
        ...data.uploaded.reduce( (ar,current) => {return([...ar,{table : current.table, scheme : 'uploaded' },...current.columns.map( (el)=>{return({...el,table : current.table })})])},[]),
        ...data.userbase.reduce( (ar,current) => {return([...ar,{table : current.table, scheme : 'userbase' },...current.columns.map( (el)=>{return({...el,table : current.table })})])},[]),
        ...A,
        ...B,
      ]);
  }

  
  
  return 
}


const Analyzer = ( string , data ) => {
  console.log(data)
  let token = [];
  let state = 'ColumnName';
  ( string
    .match(/.*?[ \+\-\/\\\.:\[\]\^\*\,\;\%\<\>\=\(\)\'\"\$\#\@\_]/gi) || [] )
      .forEach(  (el) => {
        let pos1 = el.slice(0,el.length-1)
        let pos2 = el.slice(-1)
        pos1 == '' ? null : token.push(pos1)
        switch ( pos2 ) {
          case '' :
            break;
          case ' ' :
            break;
          default :
            token.push(pos2)
        } 
      });  // разбили на токены, 
  
  //теперь построим автомат и сделаем обработку выпадения из автомата
  
  
  console.log('Tokens:: ', token )
  console.log('Result:: ', FormingResult(state,data,{tableName : [ 'qs_doc_test1', 'cs' ]}))

  return(FormingResult(state,data))
}

export {
  Analyzer
}