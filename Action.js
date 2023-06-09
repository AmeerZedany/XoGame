export const GAME = 'GAME';
export const COUNT = 'COUNT';
export const ADD_OWINNER = 'ADD_OWINNER';
export const ADD_XWINNER = 'ADD_XWINNER';

let oMin ;
let oMax ;
let xMin ;
let xMax ;

const initialState = {
  GameNumber : [],
  RoundTime: [],
  OTime: [],
  XTime: [],
  MaxWinTimeX : null ,
  MinWinTimeX : null ,
  MaxWinTimeO : null ,
  MinWinTimeO : null ,

};

export function addGame(GameNumber,RoundTime,OTime,XTime) {
  return {
    type: GAME,
    GameNumber: [GameNumber],
    RoundTime: [RoundTime],
    OTime: [OTime],
    XTime: [XTime],
  };
}
export function addOWinner(OTime) {
  return {
    type: ADD_OWINNER,
    OTime: [OTime],
  };
}

export function addXWinner(XTime) {
  return {
    type: ADD_XWINNER,
    XTime: [XTime],
  };
}

function middleware(state = initialState, action) {
  switch (action.type) {
    case GAME:
      return {
        ...state,
        GameNumber: [...state.GameNumber, ...action.GameNumber], 
        RoundTime: [...state.RoundTime, ...action.RoundTime], 
      };

    case ADD_OWINNER:
      oMin = action.OTime[0];
      oMax = action.OTime[0];
      for(let i = 0 ; i < state.OTime.length ; i++){
          if (state.OTime[i] < oMin){
            oMin = state.OTime[i] ; 
          }
          if (state.OTime[i] > oMax){
            oMax = state.OTime[i] ; 
          }
        }
      return {
        ...state,
        OTime: [...state.OTime, ...action.OTime], 
        MaxWinTimeO : oMax,
        MinWinTimeO : oMin,
      };
    case ADD_XWINNER:
      xMin = action.XTime[0];
      xMax = action.XTime[0];
      console.log(action.XTime[0]);
      for(let i = 0 ; i < state.XTime.length ; i++){
          if (state.XTime[i] < xMin){
            xMin = state.XTime[i] ; 
          }
          if (state.XTime[i] > xMax){
            xMax = state.XTime[i] ; 
          } 
      }
      return {
        ...state,
        XTime: [...state.XTime, ...action.XTime], 
        MaxWinTimeX : xMax,
        MinWinTimeX : xMin,
      };
    default:
      // Check if the cached data is still valid before returning the state
      if (state.GameNumber.length > 0 ) {
        return state;
      } else {
        return { ...state, GameNumber: [] , RoundTime: [], OTime: [], XTime: [] ,
          MaxWinTimeX : null ,
          MinWinTimeX : null ,
          MaxWinTimeO : null ,
          MinWinTimeO : null };
      };
  }
}

export default middleware;