const logger=require('../../util/logger')
const constants = require('../common/contants')
const axios = require('axios')

class CatalogRepo{
    constructor(){}

    updateQuantity(date,quantity){
        return new Promise((resolve,reject)=>{
            axios.get(`${constants.DB_URL}/catalog?date=${date}`)
            .then(res=>res.data[0])
            .then(catalogEntry=>{
                if(catalogEntry){
                    this.getCatalogEntry(date)
                        .then(_catalogEntry=>{
                            axios.patch(`${constants.DB_URL}/catalog/${_catalogEntry.id}`,
                                {"date":date,"available":quantity,"openQuantity":_catalogEntry['openQuantity']>quantity?_catalogEntry['openQuantity']:quantity}
                            ).then(res=>resolve("OK"))
                            .catch(reject)
                        })
                }else{
                    axios.post(`${constants.DB_URL}/catalog`,
                        {"date":date,"openQuantity":quantity,"available":quantity}
                    ).then(res=>resolve("OK"))
                    .catch(reject)
                }
            })
            .catch(err=>reject(err))
        })
    }

    getCatalogEntry(date){
        return new Promise((resolve,reject)=>{
            axios.get(`${constants.DB_URL}/catalog?date=${date}`)
            .then(res=>res.data[0])
            .then(resolve)
            .catch(reject)
        })
    }

    getCapacity(date){
        return new Promise((resolve,reject)=>{
            this.getCatalogEntry(date)
            .then(catalogEntry=>{
                if(catalogEntry) resolve(catalogEntry['available'])
                else resolve(0)
            })
            .catch(reject)
        })
    }
}

module.exports=CatalogRepo