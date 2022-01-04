const express = require('express')
const async = require('hbs/lib/async')
const app = express()
const {ObjectId} = require('mongodb')
const {insertObjectToCollection, 
        getAllDocumentsFromCollection,deleteDocumentById,
    updateCollection,getDocumentById} = require('./databaseHandler')


app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))


app.get('/edit',async (req,res)=>{
    const id = req.query.id
    const collectionName = "Products"
    const productToEdit = await getDocumentById(collectionName, id)
    res.render('edit',{product:productToEdit})
})
app.post('/edit',async (req,res)=>{
    const nameInput = req.body.txtName
    const priceInput = req.body.txtPrice
    const picURLInput = req.body.txtPicURL
    const id = req.body.txtId
    
    const myquery = { _id: ObjectId(id) }
    const newValues = { $set: {name: nameInput, price: priceInput,picURL:picURLInput } }
    const collectionName = "Products"
    await updateCollection(collectionName, myquery, newValues)
    res.redirect('/view')
})
app.get('/',(req,res)=>{
    res.render('index')
})

app.get('/create',async (req,res)=>{
    res.render('product')
})

app.get('/delete',async (req,res)=>{
    const id = req.query.id
    console.log("id deleted:"+ id)
    const collectionName = "Products"
    await deleteDocumentById(collectionName, id)
    res.redirect('/')
})


app.get('/view',async (req,res)=>{
    const collectionName = "Products"
    const results = await getAllDocumentsFromCollection(collectionName)
    res.render('view',{products:results})
})

app.post('/product',async (req,res)=>{
    const nameInput = req.body.txtName
    const priceInput = req.body.txtPrice
    const picURLInput = req.body.txtPicURL

    if(isNaN(priceInput)==true && priceInput == ''){
        const errorMessage = "Price must be number!"
        const oldValues = {name:nameInput,price:priceInput,picURL:picURLInput}
        res.render('product',{error:errorMessage,oldValues:oldValues})
        return;
    }
    if(nameInput.startsWith('Toy') == false) {
        const toyMessage = "This product is not a toy!"
        res.render('product',{toy:toyMessage})
        return;
    }
  
    const newP = {name:nameInput,price:Number.parseFloat(priceInput),
                    picURL:picURLInput}
    
    const collectionName = "Products"
    insertObjectToCollection(collectionName,newP)   
    res.redirect('/')
})

const PORT = process.env.PORT || 5000
app.listen(PORT)
console.log('Server is running!')
