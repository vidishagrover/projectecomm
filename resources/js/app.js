//client code 
import axios from 'axios' //axios is used to make AJAX call
import { Document } from 'mongoose'
// This means that it is possible to update parts of a web page, without reloading the whole page
import Noty from 'noty'   // for notification message
// import {initAdmin} from './admin'
import  initAdmin  from './admin'
import moment from 'moment'
let add = document.querySelectorAll('.add')
let cartCounter = document.querySelector('#cartCounter')


function updateCart(cloth) {
    axios.post('/update-cart', cloth).then(res => { 
        cartCounter.innerText = res.data.totalQty
        new Noty({
            type: 'success',
            timeout: 1000 ,
            progressBar: false ,
            text: 'Item added to cart' 
            // layout: 'bottomLeft'  to change its pos
        }).show();
    }).catch(err => {
        new Noty({
            type: 'error',
            timeout: 1000 ,
            progressBar: false ,
            text: 'Something went wrong' 
            // layout: 'bottomLeft'  to change its pos
        }).show();
    })

}

add.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        let cloth = JSON.parse(btn.dataset.cloth)
        updateCart(cloth)
    })
})
// this is to remove alert message of order successfull
const alertMsg = document.querySelector('#success-alert')
    if(alertMsg){
        setTimeout(() => {
            alertMsg.remove()
        }, 2000)

    }
// initAdmin()  this isnt working

// change order status
let statuses = document.querySelectorAll('.status_line') // selectorAll for selecting every item having this class
let hiddenInput = document.querySelector('#hiddenInput') 
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order) // converting again in object
let time = document.createElement('small') // this will create small at respective place

function updateStatus(order){
    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    let stepCompleted = true ;
    statuses.forEach((status) => {
       let dataProp = status.dataset.status 
       // the data-status attribute is needen here to access 
       // it localvariable.dataset.word after - in the attribute defined
       if(stepCompleted){
           status.classList.add('step-completed')
       }
       if(dataProp == order.status){
           stepCompleted = false
           time.innerText = moment(order.updatedAt).format('hh:mm A')
           status.appendChild(time)
           if(status.nextElementSibling){
           status.nextElementSibling.classList.add('current')
           }
       }

    })


}
updateStatus(order);

// Socket 
let socket = io()
// Join
if(order){
socket.emit('join', `order_${order._id}`)
}
// admin
let adminAreaPath = window.location.pathname // fetches the url 
if(adminAreaPath.includes('admin')){
    initAdmin(socket)
    socket.emit('join', 'adminRoom')
}
socket.on('orderUpdated', (data) => {
    const updatedOrder = { ...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)
    new Noty({
        type: 'success',
        timeout: 1000 ,
        progressBar: false ,
        text: 'Order Updated' 
        // layout: 'bottomLeft'  to change its pos
    }).show();

})