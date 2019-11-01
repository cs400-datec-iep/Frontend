/*////////////////////////////////////

Function to mark notification as read

*/ ////////////////////////////////////
function notificationRead() {
  //Url
  var UrlMarkNotifAsRead = urlMain + "api/Logs/";
  var notif = JSON.parse(sessionStorage.getItem("notifications"));

  notif.forEach(currentItem => {
    var payload_notif = {
      LogID: currentItem.LogID,
      UserID: currentItem.UserID,
      Event_Type: currentItem.Event_Type,
      Event_Description: currentItem.Event_Description,
      Trigger: currentItem.Trigger,
      Module: currentItem.Module,
      ProjectID: currentItem.ProjectID,
      TimeStamp: currentItem.TimeStamp,
      Viewed: true,
      Assignedto: currentItem.Assignedto
    };

    fetch(UrlMarkNotifAsRead + currentItem.LogID, {
      async: false,
      method: "PUT",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify(payload_notif)
    }).catch(error => console.error("Error:", error));
  });
}
