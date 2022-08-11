const express = require("express")
const HttpStatusCodes = require('http-status-codes').StatusCodes;

const orderRouter = express.Router()

const serviceFactory = require('../../lib/factory/serviceFactory')

orderRouter.get('/checkCapacity/:date',(request,response)=>{
    serviceFactory.getCatalogService().getCapacity(request.params.date)
    .then(res=>{
        response.status(HttpStatusCodes.OK)
            .json({
                message:res
            })
    })  
})

orderRouter.post('/add',(request,response)=>{
    serviceFactory.getOrderService()
        .addOrUpdateOrder(request.body)
        .then(res=>{
            response.status(HttpStatusCodes.OK)
                .json({
                    message:res
                })
        })  
})


orderRouter.patch('/update/:id',(request,response)=>{
    serviceFactory.getOrderService()
        .addOrUpdateOrder({...request.body,id:request.params.id})
        .then(res=>{
            response.status(HttpStatusCodes.OK)
                .json({
                    message:res
                })
        }).catch(err=>{
            response.status(HttpStatusCodes.NOT_FOUND)
            .json({
                message:err.message
            })
        }) 
})

orderRouter.patch('/updateStatus/:id',(request,response)=>{
     
    serviceFactory.getOrderService()
    .updateStatus(request.params.id,request.body.status)
    .then(res=>{
        response.status(HttpStatusCodes.OK)
            .json({
                message:res
            })
    }).catch(err=>{
        response.status(HttpStatusCodes.NOT_FOUND)
        .json({
            message:err.message
        })
    })
})

orderRouter.delete('/delete/:id',(request,response)=>{
    serviceFactory.getOrderService()
        .deleteOrder(request.params.id)
        .then(res=>{
            response.status(HttpStatusCodes.OK)
                .json({
                    message:res
                })
        }).catch(err=>{
            response.status(HttpStatusCodes.NOT_FOUND)
            .json({
                message:err.message
            })
        })
})


module.exports = orderRouter