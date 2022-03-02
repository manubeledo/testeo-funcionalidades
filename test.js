const axios = require('axios')
const mocha = require('mocha')
const expect = require('chai').expect




var idTestingProduct = Date.now()

describe('CRUD de productos', ()=>{

    it('/getAll should return a non empty array', async function (){
        let products
        try{
            products =  await axios.get('http://localhost:5000/api/productos')
        }catch(err){
            console.log('error al realizar get', err)
        }
        expect(products.data).to.be.a('array')
        expect(products.data.length).to.be.greaterThan(0)     
    })

    it('/productos post should add one product to DB', async function(){

        let dbBefore = await countDB()
        try{
            await axios(
            {
                method: 'post',
                url: 'http://localhost:5000/api/productos',
                data: {
                    id_producto: idTestingProduct,
                    name: 'Otro producto agregado',
                    description: 'un mouse',
                    price: 500,
                    thumbnail: 'https://cdn0.iconfinder.com/data/icons/media-and-communication-3/64/mouse-device-computer-click-scroll-256.png',
                    stock: 200
                }
        })
        } catch(err){
            console.log('error al realizar el post', err)
        }
        
        let dbAfter = await countDB()
        
        expect(dbAfter).to.be.greaterThan(dbBefore)
        
})

    it('update should modify last product to DB and be equal in length', async function(){

        let dbBefore = await countDB()
        let productBeforeUpdate = await getByIdDB(idTestingProduct)
        try{
            await axios(
            {
                method: 'put',
                url: 'http://localhost:5000/api/updateproductos',
                data: {
                    id: idTestingProduct,
                    name: 'producto MODIFICADO',
                    description: 'producto MODIFICADO',
                    price: 1000,
                    thumbnail: 'https://cdn0.iconfinder.com/data/icons/media-and-communication-3/64/mouse-device-computer-click-scroll-256.png',
                    stock: 200
                }
        })
        } catch(err){
            console.log('error al realizar el update', err)
        }
        let productAfterUpdate = await getByIdDB(idTestingProduct)
        let dbAfter = await countDB()
        
        expect(dbAfter).to.equal(dbBefore)
        expect(productBeforeUpdate).to.not.eql(productAfterUpdate)
        
    })

    it('delete should remove last product to DB', async function(){

        let dbBefore = await countDB()
        try{
            await axios(
            {
                method: 'delete',
                url: 'http://localhost:5000/api/deleteproductos',
                data: {
                    id: idTestingProduct,
                }
        })
        } catch(err){
            console.log('error al realizar el delete', err)
        }
        
        let dbAfter = await countDB()

        expect(dbBefore).to.be.greaterThan(dbAfter)

    })

})

async function countDB(){
    let products
    try{
        products =  await axios.get('http://localhost:5000/api/productos')
    }catch(err){
        console.log('error al realizar get', err)
    }
    return products.data.length
}

async function getByIdDB(idTest){
    let products
    try{
        products =  await axios(
            {
                method: 'get',
                url: 'http://localhost:5000/api/producto/:id',
                data: {
                    id: idTest,
                }
        })
    }catch(err){
        console.log('error al realizar get', err)
    }
    return products
}