const logger = require('../../util/logger')
const uuidv4 = require('uuid').v4;
const CatalogService = require('./catalogService')
const CatalogRepo = require("../repository/catalogRepository")

class OrderService{
    #orderRepo;
    #catalogService;
    constructor(orderRepo){
        this.#orderRepo=orderRepo
        this.#catalogService=new CatalogService(new CatalogRepo())
    }

    addOrUpdateOrder(orderDetails){
        if(!orderDetails.id)
            orderDetails.id=uuidv4()
        return new Promise((resolve,reject)=>{
            this.getOrder(orderDetails.id)
                .then(order=>{
                    if(order){
                        if(!orderDetails.phone){
                            orderDetails.phone=order.phone
                        }
                        if(!orderDetails.location){
                            orderDetails.location=order.location
                        }
                        if(!orderDetails.status){
                            orderDetails.status=order.status
                        }
                        if(!orderDetails.quantity){
                            orderDetails.quantity=order.quantity
                        }
                        this.updateCatalog(orderDetails.quantity)
                            .then(res=>{
                                logger.info(`Placing order : ${JSON.stringify(orderDetails)}`)
                                this.#orderRepo.updateOrder(orderDetails)
                                .then(res=>{
                                    resolve(`updated order : ${orderDetails.id} successfully`)
                                }).catch(reject)
                            }).catch(reject)
                        
                    }else{
                        let date=new Date();
                        let dt=`${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`
                        orderDetails.date=dt
                        this.updateCatalog(orderDetails.quantity)
                                .then(res=>{
                                    logger.info(`Placing order : ${JSON.stringify(orderDetails)}`)

                                    this.#orderRepo.addOrder({...orderDetails,status:"placed"})
                                    .then(res=>{
                                        resolve(`order created successfully : ${orderDetails.id}`)
                                    }).catch(reject)
                        }).catch(reject)
                    }
                })  
        })
    }

    updateStatus(id,status){
        return new Promise((resolve, reject) => { 
            this.getOrder(id).then(order=>{
                if(order){
                    this.addOrUpdateOrder({...order,status:status})
                    .then(res=>{
                        resolve(`Order : ${id} moved to status : ${status}`)
                    }).catch(reject)
                }else{
                    reject(new Error(`Order : ${id} does not exist.`))
                }
            })
         })
    }

    updateCatalog(orderQuantity){
        return new Promise((resolve, reject) => { 
            let date=new Date();
            let dt=`${date.getFullYear()}-${date.getMonth()}-${date.getDay()}}`
            this.#catalogService
                .getCapacity(dt)
                .then(available=>{
                    if(available<orderQuantity){
                        reject(new Error(`Cannot place order for ${orderQuantity} Litres. Available is ${available} Litres`))
                    }else{
                        this.#catalogService.addOrUpdateQuantity(dt,available-orderQuantity)
                        resolve()
                    }
                })
         })
    }

    getOrder(id){
        return new Promise((resolve,reject)=>{
            this.#orderRepo.getOrder(id)
            .then(res=>{
                resolve(res)
            }).catch(reject)
        })
    }

    deleteOrder(id){
        return new Promise((resolve,reject)=>{
            this.getOrder(id).then(order=>{
                if(order){
                    this.#orderRepo.deleteOrder(id)
                    .then(res=>{
                        resolve(`Order : ${id} deleted sucessfully!!`)
                    }).catch(reject)
                }else{
                    reject(new Error(`Order : ${id} does not exist.`))
                }
            })
            
        })
    }
}

module.exports = OrderService