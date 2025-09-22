
//---------variables----------

let todoinput=document.getElementById('todoinput');
let addbtn=document.getElementById('btn');
let listcontainer=document.querySelector('.list');
let list_p=document.querySelectorAll('.list_text p');
let deleteicon=document.querySelectorAll('.list_text span');
let list_text=document.querySelectorAll('.list_text')
let confirmModal=document.getElementById('confirmModal');
let confirmYes=document.getElementById('confirmYes');
let confirmNo=document.getElementById('confirmNo');
let empty=document.querySelector('.empty');
let checkList=document.querySelectorAll('.list_text input[type="checkbox"]');






let now=new Date();
let day=now.getDay();
let month=now.getMonth();
let year=now.getFullYear();
const  timeString= `${day}/${month}/${year}`;






//-------todoinput-size-control-------



todoinput.addEventListener('input',function(){

this.style.height = 'auto';     

if(this.scrollHeight<130){
    this.style.height=this.scrollHeight+'px';
    this.classList.remove('scrool');
}else{
    this.style.height ='130px';
    this.classList.add('scrool');
}


})


//-----------------------------------

 
//------add-list-------
 




function emptyf() {
    let items = document.querySelectorAll('.list_text');
    if (items.length === 0) {
        empty.style.display = 'block';
    } else {
        empty.style.display = 'none';
    }
}




addbtn.addEventListener('click',function(){

let text=todoinput.value.trim();

if(text!==''){
    let newitem=document.createElement('div');
    newitem.className='list_text';
    newitem.innerHTML=`<input type="checkbox">
    <p>${text}</p>
    <small class="time">${timeString}</small>
    <span class="material-icons edit">edit</span>
    <span class="material-symbols-outlined">delete</span>`;
    
    listcontainer.appendChild(newitem);

    saveToLocalStorage();

    todoinput.value='';
    todoinput.style.height='auto';
    todoinput.classList.remove('scrool');

    
    emptyf();

}



})







//-------delete-icon-functions--------



let itemdelet= null;




        confirmYes.addEventListener('click',function(){
           
            if(itemdelet){
                itemdelet.remove();

                

                confirmModal.style.display='none';
                itemdelet=null;

             emptyf();

             saveToLocalStorage();

            }


        })



        confirmNo.addEventListener('click',function(){
             itemdelet=null;
             confirmModal.style.display='none';
             emptyf();
        })


listcontainer.addEventListener('click',function(e){

    if(e.target.classList.contains('material-symbols-outlined')){

        itemdelet=e.target.closest('.list_text');
        confirmModal.style.display='flex';


    }

})









//------------check-list--------



listcontainer.addEventListener('change',function(e){

    if(e.target.matches('input[type="checkbox"]')){

        const p=e.target.parentElement.querySelector('p');

        if(e.target.checked){
            p.classList.add('checked');
        }else{
            p.classList.remove('checked');
        }


        saveToLocalStorage();

    }

});








//-----------list-storage-----------


function saveToLocalStorage(){
    const items = Array.from(document.querySelectorAll('.list_text')).map( item => {

        return{
            text:item.querySelector('p').textContent,
            checked:item.querySelector('input[type="checkbox"]').checked,
            time:item.querySelector('.time')?.textContent || ''
        };

    });
    localStorage.setItem('todoItems',JSON.stringify(items));
}









window.addEventListener('DOMContentLoaded',function(){

    let items=JSON.parse(localStorage.getItem('todoItems')) || [];

    items.forEach(function(item){

        let newitem=document.createElement('div');
        newitem.className='list_text';
        newitem.innerHTML = `
            <input type="checkbox" ${item.checked ? 'checked' : ''}>
            <p class="${item.checked ? 'checked' : ''}">${item.text}</p>
            <small class="time">${item.time}</small>
            <span class="material-icons edit" >edit</span>
            <span class="material-symbols-outlined">delete</span>`;
    
        listcontainer.appendChild(newitem);


    })

    emptyf();

});










//------------edit----------


let edit_textarea=document.getElementById('edit_textarea');
let edit=document.querySelector('.edit_container');
let edit_yes=document.getElementById('edit_yes');
let edit_no=document.getElementById('edit_no');


let current_p=null;



listcontainer.addEventListener("click",function(e){

    if(e.target.classList.contains('edit')){

        const parent=e.target.closest('.list_text');
        current_p=parent.querySelector('p');

        edit.style.display='flex';
        edit_textarea.value=current_p.textContent;


        setTimeout(()=>{


             edit_textarea.style.height = 'auto';
            const scroll_h = edit_textarea.scrollHeight;

            if (scroll_h < 130) {
                edit_textarea.style.height = scroll_h + "px";
                edit_textarea.classList.remove('scroll');
            } else {
                edit_textarea.style.height = '130px';
                edit_textarea.classList.add('scroll');
            }


        },0)



        
    }


});






edit_no.addEventListener('click',function(){

    edit_textarea.value='';
    edit.style.display='none';

});


edit_yes.addEventListener('click',function(){

    if(current_p){

        current_p.textContent=edit_textarea.value;
        edit.style.display='none';

        saveToLocalStorage();
        current_p=null;

    }
   
});

