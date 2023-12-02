const errorHandler = (err,req,res,next) =>{
    const StatusCode = res.StatusCode ? res.StatusCode : 500
    res.status(StatusCode)
    res.json({
        message: err.message,
        stack: err.stack
    })
}

module.exports = {errorHandler}