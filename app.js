const request = require("request")
const argv = require("yargs").argv
let userToken = argv.token
let nocollect = !!argv.nocollect

if (userToken === undefined || userToken.length !== 213)
    throw Error("No valid token provided")

let getActivePoints = () => {
    const options = {
        url: "https://api.nasapatrola.com/Points/GetActivePoints",
        headers: { Authorization: userToken }
    };
    return new Promise(function(resolve, reject) {
        request.get(options, function(err, resp, body) {
            if (err) reject(err)
            else resolve(body)
        });
    });
};

let collectPoints = id => {
    const options = {
        url: "https://api.nasapatrola.com/Points/CollectPoint",
        headers: { Authorization: userToken },
        body: JSON.stringify({id})
    };
    return new Promise((resolve, reject) => {
        request.post(options, (err, resp, body) => {
            if (err) reject(err)
            else resolve(body)
        });
    });
};

const errHandler = (err) => console.error(err)

let main = () => {
    console.log(`Iteration ran at ${new Date().toUTCString()}`);
    getActivePoints()
        .then(JSON.parse, errHandler)
        .then(result => {
            console.log(`Found ${result.length} active points`, result);

            if (nocollect) return;

            result.map(({id}) => {
                collectPoints(id)
                .then(JSON.parse, errHandler)
                .then(({poins}) => {
                    console.log(`Collected ${points} points from active points id ${id}`)
                })
                .catch((err) => {
                    console.error(`Unable to retrieve points for id ${id}\n${err}`)
                });
            })
        }, errHandler)
}

main()
setInterval(main, 1000 * 60 * 5);