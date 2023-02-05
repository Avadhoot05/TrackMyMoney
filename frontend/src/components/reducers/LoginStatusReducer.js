

export const LoginStatusReducer = (currState, action) => {
    if(action.type === 'USER_OK')
    {
        return {
            flg: action.payload.flg,
            userid: action.payload.userid, 
            name: action.payload.name, 
            email: action.payload.email
        }
    } 

    return currState;
}

export default LoginStatusReducer;
