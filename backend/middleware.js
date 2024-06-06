const alreadyLoggedIn = (req, res, next) => {
    console.log("middelware");
    const alreadyLoggedIn = req.get('authenticationToken');
    console.log(`alreadyLoggedIn = ` + alreadyLoggedIn);

    if (alreadyLoggedIn) {
        res.sendStatus(409);
        res.redirect("/");
        next();
    } else {
        next();
    }
}

module.exports = { alreadyLoggedIn }