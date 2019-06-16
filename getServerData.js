
function GetPlayers(){
  var myInit = { method: 'GET',
                 headers: {'Accept': 'application/json','Content-Type': 'application/json'},
                 cache: 'default'};

  var myRequest = new Request('http://localhost:3000/scores', myInit);

  fetch('http://localhost:3000/scores')
    .then(response => {
      return response.json();
    })
    .then(data => {
      WriteHtml(data);
    })
}

function WriteHtml(data){
  var p = document.getElementById("players");
  var i;
  for(i=0;i<data.length;i++)
  {
    var ix=JSON.stringify(data[i]);
    var obj=JSON.parse(ix);

    p.innerHTML+='<tr>'+'<td class="text-left">'+obj.name+'</td>'+'<td class="text-left">'+obj.points+'</td>'+'</tr>';
  }
}
