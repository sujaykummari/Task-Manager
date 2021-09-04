const taskcontainer = document.querySelector(".taskcontainer");

let globalTaskData = [];

const  generateHTML = (taskData) =>{return `
<div id=${taskData.id} class="col-md-6 col-lg-4 my-4">
    <div class="card">
      <div class="card-header d-flex justify-content-end gap-2">
        <button class="btn btn-outline-primary" name =${taskData.id}  onclick="editCard.apply(this, arguments)">
          <i class="far fa-pencil" name =${taskData.id} ></i>
        </button> 
        <button class="btn btn-outline-danger" name =${taskData.id} onclick="deleteCard.apply(this, arguments)">
          <i class="far fa-trash-alt" name =${taskData.id}></i>
        </button>
      </div>
      <div class="card-body">
      <img
      src=${taskData.image}
      alt="image"
      class="card-img"
    />

        <h5 class="card-title mt-4">${taskData.title}</h5>
        <p class="card-text">
        ${taskData.description}
        </p>
        <span class="badge bg-primary">${taskData.type}</span>
      </div>
      <div class="card-footer">
        <button class="btn btn-outline-primary" name=${taskData.id}>open task</button>
        
      </div>
    </div>

  </div>`};

  const saveToLocalStorage = () => 
  localStorage.setItem("tasky",JSON.stringify({card: globalTaskData}));

  const insertToDom = (content) =>
  taskcontainer.insertAdjacentHTML("beforeend",content);


const addnewcard = () => { // using arrow function

    //get task data
    const taskData = {
        id: `${Date.now()}`, // templet iteral
        title: document.getElementById("TaskTitle").value,
        image: document.getElementById("imageURl").value,
        type: document.getElementById("TaskType").value,
        description: document.getElementById("TaskDescription").value,

        
    };

    globalTaskData.push(taskData);

    //updata the local storage
    // tasky is becaus ti identify our data in the local storage as there are many web sites
    //parse will convert the json to js
    //stringify will convert the js to json
    saveToLocalStorage(); 
    
    //generate HTML code
    const newCard = generateHTML(taskData);
    // inject it to dom

    insertToDom(newCard);



    // clear form
    document.getElementById("TaskTitle").value=""
    document.getElementById("imageURl").value=""
    document.getElementById("TaskType").value=""
    document.getElementById("TaskDescription").value=""
    
    return;

};

const loadExistingcards = () => {

      //check local storage

      const getData = localStorage.getItem("tasky");
      // retreve data, if exists

      if(!getData) return;

      const taskCards = JSON.parse(getData);

      globalTaskData=taskCards.card;

      
      //generate HtML code for these data
      globalTaskData.map((taskData) => {
        const newCard = generateHTML(taskData);
        insertToDom(newCard);

      });

      return;
      //inject to dom
};

const deleteCard = (event) => {
      const targetID = event.target.getAttribute("name");
      const elementType = event.target.tagName;

      const removeTask = globalTaskData.filter((task) => task.id !== targetID);
      globalTaskData = removeTask;

      //updata the local storage
      saveToLocalStorage();

      // access dom to remove card
      if(elementType==="BUTTON") {
        return taskcontainer.removeChild(
        event.target.parentNode.parentNode.parentNode
        );
      }
      else{
        return taskcontainer.removeChild(
          event.target.parentNode.parentNode.parentNode.parentNode
          );

      }

};

const editCard = (event) => {
      // const targetID = event.target.getAttribute("name");
      const elementType = event.target.tagName;

      let TaskTitle;
      let TaskType;
      let TaskDescription;

      let parentElement;

      let submitButton;

      if (elementType==="BUTTON"){
        parentElement = event.target.parentNode.parentNode;
      }else{
        parentElement = event.target.parentNode.parentNode.parentNode;
      }

      TaskTitle = parentElement.childNodes[3].childNodes[3];
      TaskDescription = parentElement.childNodes[3].childNodes[5];
      TaskType = parentElement.childNodes[3].childNodes[7];
      submitButton = parentElement.childNodes[5].childNodes[1];
      
      TaskTitle.setAttribute("contenteditable", "true");
      TaskDescription.setAttribute("contenteditable", "true");
      TaskType.setAttribute("contenteditable", "true");
      submitButton.setAttribute("onclick","saveEdit.apply(this, arguments)")
      submitButton.innerHTML = "Save Changes";
    };
      const saveEdit = (event) => {
        const targetID = event.target.getAttribute("name");
        const elementType = event.target.tagName;
      
        let parentElement;
      
        if (elementType === "BUTTON") {
          parentElement = event.target.parentNode.parentNode;
        } else {
          parentElement = event.target.parentNode.parentNode.parentNode;
        }
      
        const TaskTitle = parentElement.childNodes[3].childNodes[3];
        const TaskDescription = parentElement.childNodes[3].childNodes[5];
        const TaskType = parentElement.childNodes[3].childNodes[7];
        const submitButton = parentElement.childNodes[5].childNodes[1];
      
        const updatedData = {
          title: TaskTitle.innerHTML,
          type: TaskType.innerHTML,
          description: TaskDescription.innerHTML,
        };
      
        console.log({ updatedData, targetID });
      
        const updateGlobalTasks = globalTaskData.map((task) => {
          if (task.id === targetID) {
            console.log({ ...task, ...updatedData });
            return { ...task, ...updatedData };
          }
          return task;
        });
      
        globalTaskData = updateGlobalTasks;
      
        saveToLocalStorage();
      
        TaskTitle.setAttribute("contenteditable", "false");
        TaskDescription.setAttribute("contenteditable", "false");
        TaskType.setAttribute("contenteditable", "false");
        submitButton.innerHTML = "Open Task";
      };

