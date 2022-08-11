const logger=require('../../util/logger')
const constants = require('../common/contants')
const axios = require('axios')

class OrderRepository{
    
    getOrder(id){
        return new Promise((resolve,reject)=>{
            axios.get(`${constants.DB_URL}/orders?id=${id}`)
            .then(res=>res.data[0])
            .then(resolve)
            .catch(reject)
        })
    }

    addOrder(orderDetails){
        return new Promise((resolve, reject) => { 
            axios.post(`${constants.DB_URL}/orders`,
                        orderDetails
            ).then(res=>resolve("OK"))
            .catch(reject)
        })
    }

    updateOrder(orderDetails){
        return new Promise((resolve, reject) => { 
            axios.patch(`${constants.DB_URL}/orders/${orderDetails.id}`,
                        orderDetails
            ).then(res=>resolve("OK"))
            .catch(reject)
        })
    }

    deleteOrder(id){
        return new Promise((resolve, reject) => { 
            axios.delete(`${constants.DB_URL}/orders/${id}`).then(res=>resolve("OK"))
            .catch(reject)
        })
    }
}

module.exports=OrderRepository
