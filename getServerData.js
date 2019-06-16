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
      //Methods run with the data
      var sortedData=SortPlayers(data);
      WriteHtml(sortedData);
    })
}

function SortPlayers(data){
  //Parsing the data so that it's usable
  var ix=JSON.stringify(data);
  var obj=JSON.parse(ix);

  var i;
  var j;
  for (i = 0; i < data.length; i++) {
       for(j = 0 ; j < data.length - i-1; j++){
       if (data[j].points < data[j + 1].points) {
         var temp = data[j];
         data[j] = data[j+1];
         data[j + 1] = temp;
       }
      }
     }

   return data;
}

function WriteHtml(data){
  var p = document.getElementById("players");
  var i;

  //Adds a line for every player in the table
  for(i=0;i<data.length;i++)
  {
    p.innerHTML+='<tr>'+'<td class="text-left">'+data[i].name+'</td>'+'<td class="text-left">'+data[i].points+'</td>'+'</tr>';
  }
}
