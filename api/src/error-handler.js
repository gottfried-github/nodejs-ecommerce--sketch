import createError from 'http-errors'
import * as m from '../messages.js'

function errorHandler(e, req, res, next) {
    if (!e) return next()

    if (e instanceof Error) {
        // req.log("handleApiErrors, an instance of Error occured, the instance:", e)
        return res.status(500).send()
    }

    if (e instanceof m.Message) {
        if (m.InvalidPassword.code === e.code) return res.status(400).json(e)

        const _e = m.InvalidErrorFormat.create()

        // req.log(`handleApiErrors, ${_e.message}, the error:`, e)
        return res.status(500).json(_e)
    }

    // bodyParser generates these
    if (e instanceof createError.HttpError) { // somehow isHttpError is not a function...
    // if (createError.isHttpError(e)) {
        return res.status(e.status).json(e)
    }

    if (!isValidBadInputTree(e)) return res.status(500).json(m.InvalidErrorFormat.create())

    return res.status(400).json(e)
}

export {errorHandler}
