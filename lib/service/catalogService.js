const logger=require('../../util/logger')

class CatalogService{
    #catalogRepo;

    constructor(catalogRepo){
        this.#catalogRepo=catalogRepo
    }

    addOrUpdateQuantity(date,quantity){
        return new Promise((resolve,reject)=>{
            this.#catalogRepo.updateQuantity(date,quantity)
            .then(res=>{
                resolve(`updated quantity to : ${quantity} for date : ${date}`)
            }).catch(reject)
        })
    }

    getCapacity(date){
        return new Promise((resolve,reject)=>{
            this.#catalogRepo.getCapacity(date)
            .then(availableCapacity=>resolve(`Available capacity : ${availableCapacity}`))
            .catch(reject)
        })
    }
}

module.exports = CatalogService