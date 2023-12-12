export const increment = () => {
    return {
        type: "INCREMENT",
        playload: {
            count: 1,
        }
    }
}
export const asyncIncrement = () => {
    return (dispatch) => {
        setTimeout(() => {
            dispatch({
                type: "ASYNCINCREMENT",
                playload: {
                    count: 1,
                },
            })
        }, 2000)
    }
}

export const decrement = () => {
    return {
        type: "DECREMENT",
        playload: {
            count: 1,
        }
    }
}

export const asyncDecrement = () => {
    return (dispatch) => {
        setTimeout(() => {
            dispatch({
                type: "ASYNCDECREMENT",
                playload: {
                    count:100,
                },
            })
        }, 2000)
    }
}