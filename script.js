
//---------variables----------

let todoinput=document.getElementById('todoinput');
let addbtn=document.getElementById('btn');
let list_p=document.querySelectorAll('.list_text p');
let deleteicon=document.querySelectorAll('.list_text span');
let list_text=document.querySelectorAll('.list_text')
let confirmModal=document.getElementById('confirmModal');
let confirmYes=document.getElementById('confirmYes');
let confirmNo=document.getElementById('confirmNo');
let empty=document.querySelector('.empty');
let checkList=document.querySelectorAll('.list_text input[type="checkbox"]');






let now=new Date();
let day=now.getDate();
let month=now.getMonth();
let year=now.getFullYear();
const  timeString= `${day}/${month}/${year}`;




//------ lists storage------

let lists = JSON.parse(localStorage.getItem('todoLists')) || [];
let activeListId = lists.length ? lists[0].id : null;




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



//--------add new list---------



let new_list_btn=document.getElementById("new_list_btn");
let new_list_modal_container=document.querySelector(".new_list_modal_container");
let new_list_add=document.getElementById('new_list_add');
let new_list_cancel=document.getElementById('new_list_cancel'); 
let new_list_input=document.getElementById("new_list_input");
let list_holder_box=document.querySelector(".list_holder_box");


new_list_btn.addEventListener("click",()=>{

    new_list_modal_container.style.display='flex';

})


new_list_add.addEventListener("click",()=>{

  let name = new_list_input.value.trim();

  if(name===""){
    new_list_input.classList.add('fill');
    return;
  }

  if(editingListId){
    let list = lists.find(l => l.id === editingListId);

    if(list){

      list.listname=name;
      saveToLocalStorage();
      renderLists();
      setActiveList(list.id);

    }

    editingListId=null;

  }else{

    let new_list={       
          id: Date.now(),
          listname:new_list_input.value,
          tasks:[]
    };

    lists.push(new_list);
    saveToLocalStorage();

    activeListId = new_list.id;
    renderLists();

    setActiveList(new_list.id);

  }

  new_list_input.value='';
  new_list_modal_container.style.display='none';
  new_list_input.classList.remove('fill');

    
})



new_list_cancel.addEventListener("click",()=>{
    new_list_input.value='';
    new_list_modal_container.style.display='none';
    new_list_input.classList.remove('fill');
    editingListId = null;
})







//------ render lists ----------


function renderLists() {
  
  list_holder_box.innerHTML = "";

  const activeList=lists.find( l => Number(l.id)=== Number(activeListId));
  if (!activeList) return;


  const listDiv=document.createElement("div");
  listDiv.className='list_holder';
  listDiv.dataset.id=activeList.id;

  const head = document.createElement("div");
  head.className = "list_head";
  head.innerHTML = `<h3>${activeList.listname}</h3>
  <svg class="show_events" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgba(105,105,105,1)"><path d="M12 3C10.9 3 10 3.9 10 5C10 6.1 10.9 7 12 7C13.1 7 14 6.1 14 5C14 3.9 13.1 3 12 3ZM12 17C10.9 17 10 17.9 10 19C10 20.1 10.9 21 12 21C13.1 21 14 20.1 14 19C14 17.9 13.1 17 12 17ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z"></path></svg>
    <div class="events_container">
      <div class="list_events">
        <p class="edit_list_name"> edit name </p>
        <p class="delete_list"> delete list </p>
      </div>
    </div>
  `;

  const innerList = document.createElement("div");
  innerList.className = "list";

  listDiv.appendChild(head);
  listDiv.appendChild(innerList);
  
  list_holder_box.appendChild(listDiv);

  setActiveList(activeList.id);

}







function setActiveList(listId) {
  activeListId = Number(listId);

  // highlight لیست فعال در UI
  document.querySelectorAll('.list_holder').forEach(div => {
    div.classList.toggle('active', Number(div.dataset.id) === Number(listId));
  });

  // رندر تسک‌های لیست فعال
  renderTasks(activeListId);
}





//------- render Tasks------




function emptyf(taskContainer) {
    
  if(!taskContainer.querySelector('.list_text')) {
      taskContainer.innerHTML = `<div class="empty">Add something to your list</div>`;
  }

}






function renderTasks(listId) {
  
  const listDiv = list_holder_box.querySelector(`.list_holder[data-id="${listId}"]`);
  if (!listDiv) {
    console.warn('renderTasks: listDiv not found for id', listId);
    return;
  }

  // مخفی کردن همه کانتینرهای تسک (نمایش فقط کانتینر لیست فعال)
  document.querySelectorAll('.list_holder .list').forEach(l => l.style.display = 'none');

  // گرفتن کانتینر تسک این لیست
  const taskContainer = listDiv.querySelector('.list');
  if (!taskContainer) {
    console.warn('renderTasks: taskContainer not found inside listDiv', listDiv);
    return;
  }

  
  taskContainer.style.display = 'block';
  taskContainer.innerHTML = '';

 
  const listObj = lists.find(l => Number(l.id) === Number(listId));
  if (!listObj) return;


  if (!listObj.tasks || listObj.tasks.length === 0) {
  
    emptyf(taskContainer);
    return;
  }

 
  listObj.tasks.forEach(task => {
    const newitem = document.createElement("div");
    newitem.className = 'list_text';
    newitem.dataset.id = task.id;

    newitem.innerHTML = `
      <input type="checkbox" ${task.checked ? 'checked' : ''}>
      <p class="${task.checked ? 'checked' : ''}">${task.text}</p>
      <small class="time">${task.time}</small>
      <span class="material-icons edit">edit</span>
      <span class="material-symbols-outlined delete_icon">delete</span>
    `;

    taskContainer.appendChild(newitem);

  });

}








//------- adding new task---------


addbtn.addEventListener("click", function(){

    let text = todoinput.value.trim();

    if (text === '') return;

    if (!activeListId) {
    alert('ابتدا یک لیست ایجاد یا انتخاب کنید.'); // بعدا باید اصلاح بشه
    return;
    }  


    const list = lists.find(l => l.id === activeListId);
    if (!list) return;

    const newTask = {
    id: Date.now(),
    text: text,
    checked: false,
    time: timeString
    };

    list.tasks.push(newTask);
    saveToLocalStorage();
    renderTasks(activeListId);

    todoinput.value = '';
    todoinput.style.height = 'auto';
    todoinput.classList.remove('scrool');
    

})










//-------delete-icon-functions--------



let itemdelet= null;




list_holder_box.addEventListener('click',function(e){

    if(e.target.classList.contains('material-symbols-outlined')){

        itemdelet=e.target.closest('.list_text');
        confirmModal.style.display='flex';


    }

})




confirmYes.addEventListener('click',function(){
           
    if(!itemdelet) return;

    const taskEl = itemdelet;
    const taskId = Number(taskEl.dataset.id);

    //----- delet from lists array       
    const list = lists.find(l => l.id === activeListId);
    if (list) {
    list.tasks = list.tasks.filter(t => t.id !== taskId);
    saveToLocalStorage();
    }

    renderTasks(activeListId);

    confirmModal.style.display = 'none';
    itemdelet = null;

})



confirmNo.addEventListener('click',function(){
    itemdelet=null;
    confirmModal.style.display='none';
})










//------------check-list--------



list_holder_box.addEventListener('change',function(e){

    if(e.target.matches('input[type="checkbox"]')){

        const parent = e.target.closest('.list_text');
        const taskId = Number(parent.dataset.id);
        const checked = e.target.checked;  

        const list = lists.find(l => l.id === activeListId);
        if (!list) return;

        const task = list.tasks.find(t => t.id === taskId);
        if (!task) return;

        task.checked = checked;
        saveToLocalStorage();

        const p = parent.querySelector('p');

        if (checked){
            p.classList.add('checked');
        }else{
            p.classList.remove('checked');
        }
        
    }

});








//-----------list-storage-----------


function saveToLocalStorage(){
   localStorage.setItem("todoLists",JSON.stringify(lists));
}








//------------edit----------


let edit_textarea=document.getElementById('edit_textarea');
let edit=document.querySelector('.edit_container');
let edit_yes=document.getElementById('edit_yes');
let edit_no=document.getElementById('edit_no');


let taskBeingEdited =null;



list_holder_box.addEventListener("click",function(e){

    if(e.target.classList.contains('edit')){

        const parent=e.target.closest('.list_text');
        const taskId = Number(parent.dataset.id);


        const list = lists.find(l => l.id === activeListId);
        if (!list) return;

        const task = list.tasks.find(t => t.id === taskId);
        if (!task) return;

        taskBeingEdited = { listId: activeListId, taskId: taskId };

        edit_textarea.value = task.text;
        edit.style.display = 'flex';

        
    }


});






edit_no.addEventListener('click',function(){

    edit_textarea.value='';
    edit.style.display='none';
    taskBeingEdited = null;

});


edit_yes.addEventListener('click',function(){

    if (!taskBeingEdited) return;

    const list=lists.find( l => l.id===taskBeingEdited.listId);
    if (!list) return;

    const task = list.tasks.find(t => t.id === taskBeingEdited.taskId);
    if (!task) return;

    task.text = edit_textarea.value.trim() || task.text; //  سوال
    saveToLocalStorage();
    renderTasks(taskBeingEdited.listId);

    edit.style.display = 'none';
    edit_textarea.value = '';
    taskBeingEdited = null;
   
});








//------- show edit and delete list ---------

document.addEventListener("click", e =>{

  let show_events=e.target.closest(".show_events");
  let allHeads = document.querySelectorAll('.list_head');

  if(show_events){

    allHeads.forEach( a => a.classList.remove('events-open'));

    let head=show_events.closest(".list_head");

    if(head){
      head.classList.add("events-open");     
    }

    
  }else{
    if (!e.target.closest('.events_container')) {
      allHeads.forEach(h => h.classList.remove('events-open'));
    }
  }

})





//------- edit_list_name -------

let editingListId = null;

document.addEventListener("click", e =>{

  let editbtn=e.target.closest('.edit_list_name');


  if(editbtn){
    let list = lists.find(l => Number(l.id) === Number(activeListId));
    if (!list) return;

    editingListId = list.id;

    new_list_input.value = list.listname;
    new_list_modal_container.style.display = 'flex';

  }

})






//------ delete lists------

let delete_list_modal=document.querySelector(".delete_list_modal");
let delet_list_confirm=document.getElementById("delet_list_confirm");
let delet_list_cancel=document.getElementById("delet_list_cancel");


document.addEventListener("click", e =>{

  let deletebtn=e.target.closest('.delete_list');

  if(deletebtn){

    itemdelet=lists.find( l => Number(l.id)===Number(activeListId));
    delete_list_modal.style.display='flex';

  }

})



delet_list_confirm.addEventListener("click", ()=>{

  if(!itemdelet) return;

  lists=lists.filter( l => Number(l.id)!==Number(itemdelet.id));

  if (lists.length > 0) {
    activeListId = lists[0].id;
  } else {
    activeListId = null;
  }

  saveToLocalStorage();
  renderLists();
  
  if (activeListId) {
    renderTasks(activeListId);
  } else {
    document.querySelector('.list_holder_box').innerHTML = '';
  }

  itemdelet=null;
  delete_list_modal.style.display='none';

})




delet_list_cancel.addEventListener("click", ()=>{

  itemdelet=null;
  delete_list_modal.style.display='none';

})





//-------- search lists------

let search_icon=document.getElementById("search_icon");
let search_input=document.getElementById("search_input");


search_icon.addEventListener("click", () => {
  let query = search_input.value.trim().toLowerCase();

  
  if (query === "") {
    renderLists();  
    return;
  }
  
  
  let foundList = lists.find(l => l.listname.toLowerCase().includes(query));

  if (foundList) {

    activeListId = foundList.id;
    renderLists(); 
    setActiveList(foundList.id);

  } else {
  
    renderLists(); 
    alert('not found')  //---------- بعدا اصلاح میشه

  }

});










//---- DOMContentLoaded-----


window.addEventListener('DOMContentLoaded', function () {
  renderLists();
});
