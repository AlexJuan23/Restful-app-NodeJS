
$(document).ready(function() {
    //Populate the user table on initial page load
    MYRESTFULAPP.populateTable();
    //Username link click
    $('#userList table tbody').on('click', 'td a.linkshowuser', MYRESTFULAPP.showUserInfo);
    $('#btnAddUser').on('click', MYRESTFULAPP.addUser);
    $('#btnUpdateUser').on('click', MYRESTFULAPP.update);
    $('#btnCancel').on('click', MYRESTFULAPP.cancel);
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', MYRESTFULAPP.deleteUser);
    $('#userList table tbody').on('click', 'td a.linkupdateuser', MYRESTFULAPP.updateUser);
 

});

//fill table with data
var MYRESTFULAPP = {
    //Userlist data array for filling in info box
    userListData : [],
    populateTable : function() {
        //empty content string
        var tableContent = '';

        $.getJSON('/users/userlist', function(data) {
            MYRESTFULAPP.userListData = data;
            //for each item in our JSON, adda table row and cells
            $.each(data, function() {
                tableContent +='<tr>';
                tableContent +='<td><a href="#" class="linkshowuser" rel="' + this.username + '"title="Show Details">' + this.username + '</a></td>';
                tableContent += '<td>' + this.email + '</td>';
                tableContent += '<td><a href="#"" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';            
                tableContent += '<td><a href="#"" class="linkupdateuser" rel="' + this._id + '">update</a></td>';
                tableContent += '</tr>';
            });
            //inject the content string into our existing HTML table
            $('#userList table tbody').html(tableContent);
        });
    },
    //Show user info
    showUserInfo : function(event) {
        //prevent link from Firing
        event.preventDefault();

        //retrieve username from link rel attribute
        var thisUserName = $(this).attr('rel');

        //Get index of object based on id value
        var arrayPosition = MYRESTFULAPP.userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);

        //Get our User Object
        var thisUserObject = MYRESTFULAPP.userListData[arrayPosition];

        $('#userInfoName').text(thisUserObject.fullname);
        $('#userInfoAge').text(thisUserObject.age);
        $('#userInfoGender').text(thisUserObject.gender);
        $('#userInfoLocation').text(thisUserObject.location);
    },
    //add user
    addUser : function(event) {
        event.preventDefault();
        //form validation
        var errorCount = 0;
        $('#addUser input').each(function(index, val) {
        if($(this).val() === '') {errorCount++;}
        });

        //make sure error count is zero
        if(errorCount ===1) {
        //compile all user data into one object
            var input = '#addUser fieldset input#inputUser';
            var newUser = {
                'username' : $(input + 'Name').val(),
                'email' : $(input + 'Email').val(),
                'fullname' : $(input + 'Fullname').val(),
                'age' : $(input + 'Age').val(),
                'location' : $(input + 'Location').val(),
                'gender' : $(input + 'Gender').val()
            };
        // Use AJAX to post the object to our adduser service
            $.ajax({
                type : 'POST',
                data: newUser,
                url: '/users/adduser',
                dataType: 'JSON'
            }).done(function (response) {
                if(response.msg ==='') {
                    //clear forms
                    $('#addUser fieldset input').val('');
                    MYRESTFULAPP.populateTable();
                }
                else {
                    alert('Error: ' + response.msg);
                }
            });
        }
        else {
            //if errorCount is more than 0
            alert('Please fill in all fields ');
            return false; 
        }
    },
    updateUser : function updateUser(event) {
        event.preventDefault();
        MYRESTFULAPP.buttonToggle();

        var _id = $(this).attr('rel');

        //Get index of object based on id value
        var arrayPosition = MYRESTFULAPP.userListData.map(function(arrayItem) { return arrayItem._id; }).indexOf(_id);

        //Get our User Object
        var thisUserObject = MYRESTFULAPP.userListData[arrayPosition];
    
        $('#inputUserName').val(thisUserObject.username);
        $('#inputUserEmail').val(thisUserObject.email);
        $('#inputUserFullname').val(thisUserObject.fullname);
        $('#inputUserAge').val(thisUserObject.age);
        $('#inputUserGender').val(thisUserObject.gender);
        $('#inputUserLocation').val(thisUserObject.location);
        $('#inputUserID').val(thisUserObject._id);

    },
    update : function(event) {
        event.preventDefault();
        var confirmation = confirm('are you sure you want to update?');
        var _id = $('#inputUserID').val();

        if(confirmation) {
            var input = '#addUser fieldset input#inputUser';
            var updateUser = {
                'username' : $(input + 'Name').val(),
                'email' : $(input + 'Email').val(),
                'fullname' : $(input + 'Fullname').val(),
                'age' : $(input + 'Age').val(),
                'location' : $(input + 'Location').val(),
                'gender' : $(input + 'Gender').val()
            };
            $.ajax({
                type: 'PUT',
                url: '/users/updateuser/' + _id,
                data: updateUser,
                dataType: 'JSON'
            }).done(function(response) {
                //check for successful response
                if(response.msg ==='') {
                    MYRESTFULAPP.buttonToggle();
                    $('#addUser fieldset input').val('');
                }
                else {
                    alert('Error: ' + response.msg);
                }
            MYRESTFULAPP.populateTable();

            });

        }
        else {
            return false;
        }
    },
    //cancel
    cancel : function(event) {
        MYRESTFULAPP.buttonToggle();
        $('#addUser fieldset input').val('');
    },
    //delete user
    deleteUser : function(event) {
        event.preventDefault();

        //pop-up a confirmation dialog
        var confirmation = confirm('Are you sure you want to delete this user?');
        if(confirmation) {
            $.ajax({
                type: 'DELETE',
                url: '/users/deleteuser/' + $(this).attr('rel')
            }).done(function(response) {
                //check for successful response
                if(response.msg ==='') {
                }
                else {
                    alert('Error: ' + response.msg);
                }
            MYRESTFULAPP.populateTable();

            });

        }
        else {
            return false;
        }
    },
    buttonToggle : function() {
        $('#btnAddUser').toggle();
        $('#btnUpdateUser').toggle();
        $('#btnCancel').toggle();
        $('.linkupdateuser').toggle();
    }
};
