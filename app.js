const request = require('request')
const argv = require('yargs').argv
let userToken = argv.token
let nocollect = !!argv.nocollect

if (userToken === undefined)
    throw Error('No valid token provided')

let getActivePoints = () => {
    const options = {
        url: 'https://api.nasapatrola.com/Points/GetActivePoints',
        headers: { Authorization: userToken }
    }
    return new Promise((resolve, reject) => {
        request.get(options, (err, resp, body) => {
            if (err) reject(err)
            else resolve(body)
        })
    })
}

let collectPoints = id => {
    const options = {
        url: 'https://api.nasapatrola.com/Points/CollectPoint',
        headers: { Authorization: userToken },
        body: JSON.stringify({id})
    }
    return new Promise((resolve, reject) => {
        request.post(options, (err, resp, body) => {
            if (err) reject(err)
            else resolve(body)
        })
    })
}

let getCurrentPoints = id => {
    const options = {
        url: 'https://api.nasapatrola.com/User/GetUserById/' + id,
        headers: { Authorization: userToken }
    }
    return new Promise((resolve, reject) => {
        request.get(options, (err, resp, body) => {
            if (err) reject(err)
            else resolve(body)
        })
    })
}

const errHandler = (err) => console.error(err)
const tokenExpired = (body) => {
    if(body.includes('expired'))
        throw new Error('Provided token has expired. Token re-acquirement has not been implemented.')
    return body
}

let main = () => {
    if (argv.id){
        getCurrentPoints(argv.id)
            .then(body => tokenExpired(body))
            .then(JSON.parse)
            .then(({ username, id, points }) => console.log(`User ${username} (${id}) has ${points} points`))
            .catch(errHandler)
        return
    }
    console.log(`Iteration ran at ${new Date().toUTCString()}`)
    getActivePoints()
        .then(body => tokenExpired(body))
        .then(JSON.parse, errHandler)
        .then(result => {
            console.log(`Found ${result.length} active points`, result)

            if (nocollect) return

            result.map(({ id }) => {
                collectPoints(id)
                    .then(body => tokenExpired(body))
                    .then(JSON.parse, errHandler)
                    .then(({ poins }) => console.log(`Collected ${poins} points from active points id ${id}`))
                    .catch(err => console.error(`Unable to retrieve points for id ${id}`, err))
            })
        }, errHandler)
}

main()
if (!argv.id && !argv.nointerval) setInterval(main, 1000 * 60 * 5)