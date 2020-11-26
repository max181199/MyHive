const defaultState = () => {
  return {
    consultant: [],
    userbase: [],
    uploaded: [],
    wait : []
  };
};

const updateTables = (state, action) => {

  if (state === undefined) {
    return defaultState();
  }

  switch (action.type) {
    case 'TABLES_CHANGED':

      //console.log('REQ:',state.tables)

      return {
        ...state.tables,
        ...action.payload
      };
 
    default:
      return state.settings;
  }
};

export default updateTables;