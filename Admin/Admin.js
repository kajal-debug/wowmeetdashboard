const data = [{
    name:"kajal"
},
{
    name:"kanishk"
},
{
    name:"sachin"
},
{
    name:"sourav"
},
{
    name:"purvi"
}]
var state = true
function add(){
    console.log("data",data)
    data.map((item)=>{
        var element = document.createElement('li');
        var elementul = document.getElementById('ultext');
             
        // creating checkbox element
        var checkbox = document.createElement('input');
         
        // Assigning the attributes
        // to created checkbox
        checkbox.type = "checkbox";
        checkbox.name = item.name;
        checkbox.value = item.name;
        checkbox.id = "id";
         
        // creating label for checkbox
        var label = document.createElement('label');
         
        // assigning attributes for
        // the created label tag
        label.htmlFor = "id";
         
        // appending the created text to
        // the created label tag
        label.appendChild(document.createTextNode(item.name));
         
        // appending the checkbox
        // and label to div
        element.appendChild(checkbox);
        element.appendChild(label);
        console.log("item++",item)
        // element.innerText = item.name;
     
        elementul.appendChild(element);
      

    //     checkbox.type = "checkbox"?
    //  drop.appendChild(div)

    //     :null
    var doc = document.getElementById("id");
           checkbox.addEventListener('click',(e)=>{
            console.log("e",e,checkbox.checked,checkbox.value)
            var drop = document.getElementById('drop');
            var div = document.createElement('div');
            // const att = document.createAttribute("id");
            div. setAttribute('id','para-1');
           div.style.background='#d8d3d3';
             div.style.height = '30px';
             div.style.width= '40px';
             div.style.margin= '5px';
// Set the value of the class attribute:

// var demo = div.setAttributeNode(att,"demo") 
 const idcrt = document.getElementById("para-1")
          checkbox.value
            checkbox.checked? drop.appendChild(div): idcrt.remove()
            // checkbox.checked===false?idcrt.remove():null
            // drop.parentNode.deleteChild(div)
            console.log("div___",div);
           })    
              // changing the state of checkbox to checked
            //   doc.checked = true;
              console.log("check",doc.checked)
    })
}