// function verifyToken(req, res, next) {
//     const bearerHeader = req.headers['authorization'];
//     if(typeof bearerHeader !== 'undefined') {

//     } else {
//         res.sendStatus(403);
//     }
// }

module.exports.verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined') {

    } else {
        res.sendStatus(403);
    }
}