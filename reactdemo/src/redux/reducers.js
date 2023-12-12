const initialState = {count:2};
const counterReducer = (state = initialState, action) => {
    switch (action.type) {
        case "INCREMENT":
            return {count:state.count+action.playload.count};
        case "ASYNCINCREMENT":
            return {count:state.count+action.playload.count};
        case "DECREMENT":
            return {count:state.count - action.playload.count};
        case "ASYNCDECREMENT":
            return {count:state.count - action.playload.count};
        default:
            return state;
    }
}

export default counterReducer;