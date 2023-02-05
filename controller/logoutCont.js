export const logout = async (req, res )=>{
    res.clearCookie('jwtoken',{path:'/'});
    res.status(200).send("User Logout");
}