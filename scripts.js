"use strict"
let todoList = [];

$.ajax({
    // copy Your bin identifier here. It can be obtained in the dashboard
    url: 'https://api.jsonbin.io/b/61853ffa00966746034f4293/latest',
    type: 'GET',
    headers: { //Required only if you are trying to access a private bin
      'secret-key': '$2b$10$iWYsJXnXdYBYrHIcubNwGOwF451A.k2VepbKhHT92J75qJYwKu5Bq'
    },
    success: (data) => {
      //console.log(data);
      todoList = data;
    },
    error: (err) => {
      console.log(err.responseJSON);
    }
   });

let updateJSONbin = function() {
    $.ajax({
        url: 'https://api.jsonbin.io/b/61853ffa00966746034f4293',
        type: 'PUT',
        headers: { //Required only if you are trying to access a private bin
            'secret-key': '$2b$10$iWYsJXnXdYBYrHIcubNwGOwF451A.k2VepbKhHT92J75qJYwKu5Bq'
        },
        contentType: 'application/json',
        data: JSON.stringify(todoList),
        success: (data) => {
            console.log(data);
        },
        error: (err) => {
            console.log(err.responseJSON);
        }
    });
}


let updateTodoList = function () {
    
    let todoListDiv = $("#todoListView");

    todoListDiv.empty();

    let filterInput = $("#inputSearch").val();
    let filterDateBegin = $("#inputDate2").val();
    let filterDateEnd = $("#inputDate3").val();
    
    for (let todo in todoList) {
        var isFound = false;
        let dateBegin = Date.parse(filterDateBegin);
        let date = Date.parse(todoList[todo].dueDate);
        let dateEnd = Date.parse(filterDateEnd);
        for (let i in todoList[todo]) {
            if (((filterInput == "") ||
                (todoList[todo][i].includes(filterInput))) &&
                ((filterDateBegin == "" || filterDateEnd == "") ||
                (date >= dateBegin && date <= dateEnd))) {
                isFound = true;
                break;
            }
        }

        if (isFound) {
            let nextRow = $("<tr class='text-center'></tr>");
            for (let i in todoList[todo]) {
                nextRow.append($("<td class='text-center'></td>").text(todoList[todo][i]));
            }
            let deleteButton = $("<input type='button' value='done' class='btn btn-outline-danger btn-sm'/>");
            //$("<button type='button' class='close' aria-label='Close'><span aria-hidden='true'>&times;</span></button>")
            //$("<input type='button' value='x' class='btn btn-outline-danger btn-sm'/>");
            //$("<input class='form-check-input' type='checkbox' value='' id='flexCheckDefault'>");
            deleteButton.click(
                function () {
                    deleteTodo(todo);
                });       
            nextRow.append(deleteButton);       
            todoListDiv.append(nextRow);
        }        
    }    
}

setInterval(updateTodoList, 1000);

let deleteTodo = function (index) {
    todoList.splice(index, 1);
    updateJSONbin();
}

let addTodo = function () {
    //get the values from the form
    let newTitle = $("#inputTitle").val();
    let newDescription = $("#inputDescription").val();
    let newPlace = $("#inputPlace").val();
    let newDate = new Date($("#inputDate").val()).toISOString().slice(0, 10);
    //create new item
    let newTodo = {
        title: newTitle,
        description: newDescription,
        place: newPlace,
        dueDate: newDate
    }
    $("#form1")[0].reset();
    //add item to the list
    todoList.push(newTodo);
    updateJSONbin();
}
