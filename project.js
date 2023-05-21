const { get } = require('http');
const readLine = require('readline');

const r1 = readLine.createInterface({input: process.stdin, output: process.stdout,});

class Task{
  constructor(description, priority, dueDate, number){
    this.description = description;
    this.priority = priority;
    let month = dueDate.slice(0,2);
    let day = dueDate.slice(3,5);
    let year = dueDate.slice(6);
    this.dueDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    this.status = false;
    this.number = number;
  }

  completed(){
    this.status = true;
  }

  getStatus(){
    return this.status;
  }


  print(){
    console.log("TASK #" + this.number + "\nDESCRIPTION: " + this.description + "\nPRIORITY: " + this.priority + "\nDUE DATE: " + this.dueDate);
    console.log(`STATUS: ${this.status?`COMPLETED`:`NOT COMPLETED`}`);
  }
}


const tasks = [];

function addTask() {
  let description = "";
  let priority;
  let dueDate;

  const getDescription = () => {
    r1.question("What's the description of your new task? ", answer => {
      description = answer;
      getPriority();
    });
  };

  const getPriority = () => {
    r1.question("What's the priority of the task? (Enter a number from 1 - 10). ", answer => {
      if(parseInt(answer) > 10 || parseInt(answer) < 1){
        console.log("Please enter number from 1 to 10.");
        getPriority();
      } else {
        priority = parseInt(answer);
        getDueDate();
      }
    });
  };

  const getDueDate = () => {
    r1.question("When is the due date of the task?(MM/DD/YYYY) ", answer => {
      if (answer.length !== 10) {
        console.log("Please enter the date in the following format: MM/DD/YYYY.");
        getDueDate(); 
      } else {
        dueDate = answer;
        let newTask = new Task(description, priority, dueDate, tasks.length + 1);
        tasks.push(newTask);
        console.log("New task added!");
        getAction();
      }
    });
  };

  getDescription();
}


const listTasks = (chosenTasks) => {

  //Check if user added any tasks yet
  if(chosenTasks.length == 0){
    console.log("You have no tasks.");
    return 0;
  }
  
  for(let i = 0; i < chosenTasks.length; i++){
    chosenTasks[i].print();
    console.log("_____________________\n");
  }
}

const markComplete = () => {

  //Check if user added any tasks yet
  if(tasks.length == 0){
    return console.log("You have no tasks yet.");}

  listTasks(tasks);
  r1.question("Which task did you complete? Enter task number. ", answer => {
    let taskNum = parseInt(answer);
    if(taskNum <= 0 || taskNum > tasks.length){
      console.log("You have " + tasks.length + " tasks. Please enter the number of the task, from 1 to " + tasks.length);
      return markComplete();
    }

    task = tasks.filter(task => task.number == taskNum);
    task[0].completed();
    console.log("Task #" + taskNum + " is now completed!");
    return getAction();

  });
}


const deleteTask = () => {

  //Check if user added any tasks yet
  if(tasks.length == 0){
    return console.log("You have no tasks yet.");}

  listTasks(tasks);
  r1.question("Which task do you want to delete? Enter task number. ", answer => {
    let taskNum = parseInt(answer);
    if(taskNum <= 0 || taskNum > tasks.length){
      console.log("You have " + tasks.length + " tasks. Please enter the number of the task, from 1 to " + tasks.length);
      return deleteTask();
    }

    task = tasks.filter(task => task.number == taskNum);

    //Confirm with user before deleting the task.
    task[0].print();
    r1.question("Are you sure you want to delete this task?(y/n)\n", answer => {
      if(answer[0].toLowerCase() == 'y'){

        for(let i = tasks.indexOf(task[0]) + 1; i < tasks.length; i++){
          tasks[i].number--;
        }
        tasks.splice(tasks.indexOf(task[0]), 1);
        console.log("Task #" + taskNum + " has been deleted.");
        return getAction();
      }
      else {
        deleteTask();
      }
    });


  });
}

const sortByDate = (task1, task2) =>{

  if(task1.dueDate > task2.dueDate) return -1;
  else if(task1.dueDate < task2.dueDate) return 1;
  else return 0;

}

const sortbyPriority = (task1, task2) =>{

  if(task1.priority > task2.priority) return -1;
  else if(task1.priority < task2.priority) return 1;
  else return 0;

}

function clearTasks(){
  tasks.splice(0, tasks.length);
  console.log("All tasks have been removed.");
}


const intro = "***************************\n Welcome to JS TODO-APP\n***************************\nSelect an action:\n1) Add a new task \n2) List all tasks \n3) List completed tasks \n4) Mark the task as done \n5) Delete a task \n6) Sort tasks by the due date \n7) Sort tasks by priority \n8) Clear all tasks \n9) Exit\n***************************\nWhat's your choice? ";

const getAction = () => {

  r1.question(intro, answer => {

    switch(parseInt(answer)){
    case 1:
      addTask();
      break;
    case 2:
      listTasks(tasks);
      break;
    case 3:
      listTasks(tasks.filter(task => task.getStatus()));
      break;
    case 4:
      markComplete();
      break;
    case 5:
      deleteTask();
      break;
    case 6:
      listTasks(tasks.sort(sortByDate));
      break;
    case 7:
      listTasks(tasks.sort(sortbyPriority));
      break;
    case 8:
      clearTasks();
      break;   
    case 9:
      console.log("GoodBye!");
      r1.close(); process.exit(); break;
    default:
      console.log("Please enter number from 1-8.")
      getAction();
    } getAction();
  });

 
}

getAction();
