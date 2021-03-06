function notifyMe(title,msg,url) {
 if (Notification.permission !== 'granted'){
  Notification.requestPermission();
}else {
  var notification = new Notification(title, {
   body: msg,
  });
  notification.onclick = function() {
    window.open(url, '_blank');
  };
 }
}

function getinf(flag){
  chrome.storage.local.get(['wasedaid', 'password'], function (results) {
    //Communication
    if(flag){
      $("#tab2").empty();
    }
    try {
      $.ajax({
          url: "https://kadai-reminder-server.herokuapp.com/getinf/"+results.wasedaid,
          type: 'GET',
          success: function(json) {
            getresult(results.wasedaid,flag);
          }
      });
    }
    catch (e) {
      alert(e);
    }

});
}


function getresult(username,flag){
  $.ajax({
      url: "https://kadai-reminder-server.herokuapp.com/result/"+username,
      type: 'GET',
      success: function(json) {
        const obj = JSON.parse(json);
        if(Array.isArray(obj)){
          chrome.storage.local.set({"kadaidata":json},function(){
            for(var i=0;i<obj.length;i++) {
              if(flag){
                $("#tab2").append(`<div class=\"listchild\"><a href=\"${obj[i].url}\" class=\"cname\" target="_blank">${obj[i].name}</a><p class=\"cdate\">${obj[i].deadline}</p></div>`);
              }
              notifyMe(obj[i].name,`活動は${obj[i].deadline}が期限です`,obj[i].url);
            }
          });
        }else{
          if(obj.name == undefined){
            setTimeout(function(){ getresult(username,flag);}, 10000);
          }else{
            alert("ログインに失敗しました");
          }

        }

      }
  });
}
