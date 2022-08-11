const express = require("express")
const HttpStatusCodes = require('http-status-codes').StatusCodes;

const adminRouter = express.Router()

const serviceFactory = require('../../lib/factory/serviceFactory')

adminRouter.use((request,response,next)=>{
    const token=request.headers.authorization.split('Basic ')[1]
    const login = Buffer.from(token, 'base64').toString().split(':');
    if(login[0]=='admin'&&login[1]=='admin'){
        next();
    }else{
        response.status(HttpStatusCodes.UNAUTHORIZED)
        response.json({message:'Authentication failed for user : admin'})
    }
})

adminRouter.post('/updateAvailability', function(request, response) {
    serviceFactory.getCatalogService(request.body.date,request.body.quantity)
    .then(res=>{
        response.status(HttpStatusCodes.OK)
        response.json({
            'message':`Updated quantity to : ${request.body.quantity} for date ${request.body.date} `
        })
    })
    .catch(err=>{
        response.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
        response.json({
            message:err.message
        })
    })
})

adminRouter

module.exports = adminRouter