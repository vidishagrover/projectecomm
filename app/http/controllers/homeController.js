const Menu = require('../../models/product')
function homeController(){
    return{
        //index is a function
        async index(req, res){
            const clothes = await Menu.find()
            return res.render('home', { clothes : clothes})
        

            

        }
    }
}

module.exports = homeController