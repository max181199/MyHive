const defaultState = () => {
  return {
    consultant: [],
    userbase: [],
    uploaded: []
  };
};

const updateTables = (state, action) => {

  if (state === undefined) {
    return defaultState();
  }

  switch (action.type) {
    
    case 'TABLES_CHANGED':
      return {
        ...state.settings,
        ...action.payload
      };
 
    default:
      return state.settings;
  }
};

export default updateTables;