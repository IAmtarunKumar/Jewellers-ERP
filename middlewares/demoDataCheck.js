

let x = true;
let domeDataChecker = (req, res, next) => {
    if (req.url === "/add") {
        // console.log(x)
        if (x === true) {
            x = false
            next()
        } else {
            console.log("data already fetch")
            return res.status(400).send("data already fetched. Remove for re-fetching the data")
        }

    } else if (req.url === "/remove") {
        // console.log("remove x" ,x)
        if (x === false) {
            x = true
            next()
        } else {
            return res.status(400).send("data already empty. Add data please")
        }

    }
}


module.exports = { domeDataChecker }