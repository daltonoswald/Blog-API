const alreadyLoggedIn = (req, res, next) => {
    const alreadyLoggedIn = req.get('authenticationToken');
    console.log(`alreadyLoggedIn = ` + alreadyLoggedIn);

    if (alreadyLoggedIn) {
        res.sendStatus(409);
        res.redirect("/");
        next();
    }
    next();
}

module.exports = { alreadyLoggedIn }