/*////////////////////////////////////

Adds functionality to dropdown members list in edit modal

*/////////////////////////////////////
$('#members_list')
.dropdown({
    placeholder:'No Members',
    onRemove: function(value){
        for(var i = 0;i < userIdList.length; i++){
            if(userIdList[i] === value){
                userIdList.splice(i, 1);
            }
        }
        deleted_members_array.push(value);
    },
    onAdd: function(value){
        for(var i = 0;i < deleted_members_array.length; i++){
            if(deleted_members_array[i] === value){
                deleted_members_array.splice(i, 1);
            }
        }
        userIdList.push(value);
    }
});