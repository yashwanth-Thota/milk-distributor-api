const logger=require('../../util/logger')
const OrderRepository=require('../repository/orderRepository')
const CatalogRepository=require('../repository/catalogRepository')

class RepoFactory{
    #orderRepository;
    #catalogRepository;
    
    constructor(){
        this.getCatalogRepository()
        this.getOrderRepository()
    }

    getOrderRepository() {
        if(!this.#orderRepository){
            this.#orderRepository=new OrderRepository();
        }
        return this.#orderRepository;
    }

    getCatalogRepository() {
        if(!this.#catalogRepository){
            this.#catalogRepository=new CatalogRepository();
        }
        return this.#catalogRepository;
    }
    
}

module.exports=new RepoFactory()