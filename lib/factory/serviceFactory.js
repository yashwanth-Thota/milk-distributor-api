const logger=require('../../util/logger')

const OrderService=require('../service/orderService')
const CatalogService=require('../service/catalogService')
const repoFactory=require('./repoFactory')

class ServiceFactory{
    #catalogService;
    #orderService;

    constructor(){
        this.getCatalogService()
        this.getOrderService()
    }

    getOrderService() {
        if(!this.#orderService){
            this.#orderService=new OrderService(repoFactory.getOrderRepository());
        }
        return this.#orderService;
    }

    getCatalogService() {
        if(!this.#catalogService){
            this.#catalogService=new CatalogService(repoFactory.getCatalogRepository());
        }
        return this.#catalogService;
    }
    
}

module.exports=new ServiceFactory()