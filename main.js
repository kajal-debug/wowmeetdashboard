 function employee(){
    window.location.href = "../Register/Employee.html";
}
  function admin(){
    window.location.href = "../Register/Admin.html";
}
 function Login(){
    window.location.href = "../Login/Employee.html";
}
 function adminlogin(){
    window.location.href = "../Login/Admin.html";
}
 async function empRegister(){
    var name = document.getElementById('name').value
    var email = document.getElementById('email').value
    var id = document.getElementById('id').value
    var passwordreq = document.getElementById('password').value
    var confrompassword = document.getElementById('confrompassword').value
    let emppassword;
    if(confrompassword===passwordreq){
        emppassword=confrompassword
    }
    console.log("name",name,email,id,emppassword)
    axios.post('http://localhost:5000/api/users/UserRegistation',{name:name,email:email,companyid:id,password:emppassword,isAdmin:'employee'}).then(()=>{})
} 
function adminRegister(){

      
    var adminname = document.getElementById('adminame').value
    var email = document.getElementById('email').value
    var companyname = document.getElementById('companyname').value
    var passwordreq = document.getElementById('password').value
    var confrompassword = document.getElementById('confrompassword').value
    var password;
    if(confrompassword===passwordreq){
        password=confrompassword
    }
    console.log("name",adminame,email,companyname,password)
    axios.post('http://localhost:5000/api/email/CompanyRegistraion',{adminname:adminname,email:email,companyname:companyname,password:password,isAdmin:'Admin'}).then((response)=>{
        console.log(response.status,"respose____")
        if(response.status==200){
            console.log("hii userrss")
            adminlogin();
        }
    })
}


function adminLogin(){
    var adminname = document.getElementById('adminname').value
    var email = document.getElementById('email').value
    var password = document.getElementById('password').value
    console.log("name++++",adminname,email,password) 
    axios.post('http://localhost:5000/api/login',{adminname:adminname,email:email,password:password}).then((response)=>{
        console.log("response",response)
        if(response.status===200){
            console.log("response",response)
             window.localStorage.setItem('token',response.data.company_id);
              window.location.href = '../index.html';
        }
    }).catch(async(errors)=>{
        function myFunction() {
            console.log("hii")
            var x = document.getElementById("snackbar");
            console.log("data",x.textContent)
            x.innerHTML=errors.response.data.errors.msg
            x.className = "show";
            setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
          }
        myFunction();
        console.log("err--",errors.response.data.errors.msg)
       // alert(errors.response.data.errors.msg)
        
    })
}
 let CompanyId=window.localStorage.getItem('token');
function logindata(){
    console.log("hiii")
   const company_id = window.localStorage.getItem('token')
     console.log("data___",company_id)
     axios.post('http://localhost:5000/api/fetch_user',{company_id:company_id}).then(async(response)=>{
        console.log("response",response.data.users.length)
        var text = "";
         let companyname = document.getElementById('companyName')
         response.data.users.map((item)=>{
             console.log("item",item.name)
             
            })
            for (var i= 0; i<response.data.users.length; i++){
                console.log("forloop",response.data.company)
                let ul = document.createElement('ul');
                ul.setAttribute('class','list-group');
            text=`  <li class="list-group-item border-0 d-flex p-4 mb-2 bg-gray-100 border-radius-lg" >
            <div class="d-flex flex-column">
              <h6 class="mb-3 text-sm">${response.data.users[i].name}</h6>
              <span class="mb-2 text-xs " >Company Name: <span class="text-dark font-weight-bold ms-sm-2" id="companyName" >${response.data.company}</span></span>
              <span class="mb-2 text-xs">Email Address: <span class="text-dark ms-sm-2 font-weight-bold"><a
                    href="./../cdn-cgi/l/email-protection.html" class="__cf_email__"
                    data-cfemail="ef808386998a9daf8d9a9d9d869b80c18c8082">${response.data.users[i].email}</a></span></span>
              <span class="text-xs">VAT Number: <span
                  class="text-dark ms-sm-2 font-weight-bold">FRB1235476</span></span>
            </div>
            <div class="ms-auto text-end">
              <a class="btn btn-link text-danger text-gradient px-3 mb-0" href="javascript:;"><i
                  class="far fa-trash-alt me-2"></i>Delete</a>
              <a class="btn btn-link text-dark px-3 mb-0" href="javascript:;"><i
                  class="fas fa-pencil-alt text-dark me-2" aria-hidden="true"></i>Approved</a>
            </div>
          </li>` ;
          ul.innerHTML = text;
          companyname.appendChild(ul)
           }

        // var span = document.createElement('span')
    }).catch(async(errors)=>{
        console.log("err--",errors.response)
        console.log("dat0000",company_id)
        // function myFunction() {
        //     console.log("hii")
        //     var x = document.getElementById("snackbar");
        //     console.log("data",x.textContent)      
        //     x.innerHTML=errors.response.data.errors.msg
        //     x.className = "show";
        //     setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
        //   }
        // myFunction();
    
    })
}
function empLogin(){
    var adminname = document.getElementById('adminname').value
    var email = document.getElementById('email').value
    var password = document.getElementById('password').value
   // console.log("name++++",adminname,email,password) 
    axios.post('http://localhost:5000/api/employeelogin',{name:adminname,email:email,password:password}).then(async(response)=>{
        console.log("response",response)
    }).catch(async(errors)=>{
        console.log("err--",errors.response.data.errors.msg)
        function myFunction() {
            console.log("hii")
            var x = document.getElementById("snackbar");
            console.log("data",x.textContent)      
            x.innerHTML=errors.response.data.errors.msg
            x.className = "show";
            setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
          }
        myFunction();
       
    })
}
 function validation(event){
   var validate=document.getElementById('validate');
  // var validate = document.createElement('div');
  console.log()
    var childText;
       
        // console.log("email",event.target.value)
       //event.target.value ===' '? childText = validate.parentNode.removeChild(validate):childText = document.createTextNode("hii")
        let regExp = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/;
        !regExp.test(event.target.value) ?
       
        childText = validate.innerText?document.createTextNode(""):document.createTextNode(`Please Enter valid email`)
     
            :    validate.innerHTML = ''
            // validate.parentNode.removeChild(validate)
            validate.appendChild(childText)
            console.log(validate.innerText)
            var textcolor=validate.innerText
            console.log('textcolor',textcolor)
            event.target.value===''?validate.innerHTML = '':validate.style.color='red'
}

const meetingdata = [{
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
var state=[];
let adduserdata=0;
function add(){
  adduserdata++;
  console.log("data",data)
  let user = []
  if(adduserdata<2){
  meetingdata.map((item)=>{
    var elementul = document.getElementById('ultext');
    var element = document.createElement('li');
      var checkbox = document.createElement('input');
      checkbox.type = "checkbox";
      checkbox.name = item.name;
      checkbox.value = item.name;
      checkbox.id = "id";
      var label = document.createElement('label');
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
if(checkbox.checked===true){
  user.push(checkbox.value);
  console.log("checkbox.checked",checkbox.value)
 }
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

          return state=user;
}

function mettingCreated(){
    // console.log("state,state++",state)
    var meetingtime= document.getElementById('date').textContent;
     console.log("state,state++",state,meetingtime,CompanyId)
  axios.post('http://localhost:5000/api/metting',{company_id:CompanyId,Mettingname:"mettingroom #8",users:state,meetingtime:meetingtime}).then((response)=>{
    console.log("meeting res",response)
    window.location.reload(true);
  })
   
}
let mettinguserDetails = [];
function fetchMeetingroom(){
  let userdetails = [];
  axios.post('http://localhost:5000/api/fetching/metting',{company_id:CompanyId}).then((response)=>{
    console.log("meeting res",response)
    response.data.metting.map((item)=>{
      console.log("item",item.userId)
var room=document.getElementById('mettingroom')
const col = document.createElement('div');
col.setAttribute('class','col-xl-3 col-md-6 mb-xl-0 mb-4')
for(let i=0;i<3;i++){
  console.log("value+++",item)
var meetingrooms = `<div class="card card-blog card-plain" onclick="meetingviewDetails('${item.userId},${item._id}')">
<div class="card card-blog card-plain">
<div class="position-relative">
  <a class="d-block shadow-xl border-radius-xl">
    <img src="./assets/img/home-decor-1.jpg" alt="img-blur-shadow"
      class="img-fluid shadow border-radius-xl">
  </a>
</div>
<div class="card-body px-1 pb-0">
<p class="text-gradient text-dark mb-2 text-sm" >${item.Mettingname}</p>

  <h5>
    3D Team
  </h5>
<p class="mb-4 text-sm">
</p>
<div class="d-flex align-items-center justify-content-between">
  <button type="button" class="btn btn-outline-primary btn-sm mb-0 " id="btnviewdetails"
  >View Details</button>
  <div class="avatar-group mt-2">
    <a href="javascript:;" class="avatar avatar-xs rounded-circle" data-bs-toggle="tooltip"
      data-bs-placement="bottom" title="Peterson">
      <img alt="Image placeholder" src="./assets/img/team-4.jpg">
    </a>
    <a href="javascript:;" class="avatar avatar-xs rounded-circle" data-bs-toggle="tooltip"
      data-bs-placement="bottom" title="Nick Daniel">
      <img alt="Image placeholder" src="./assets/img/team-3.jpg">
    </a>
    <a href="javascript:;" class="avatar avatar-xs rounded-circle" data-bs-toggle="tooltip"
      data-bs-placement="bottom" title="Ryan Milly">
      <img alt="Image placeholder" src="./assets/img/team-2.jpg">
    </a>
    <a href="javascript:;" class="avatar avatar-xs rounded-circle" data-bs-toggle="tooltip"
      data-bs-placement="bottom" title="Elena Morison">
      <img alt="Image placeholder" src="./assets/img/team-1.jpg">
    </a>
  </div>
</div>
</div>`;
col.innerHTML= meetingrooms;

}
 
room.appendChild(col);
userdetails.push(item.userId)
    })
    console.log("userdetails",userdetails)
  })
  console.log("userdetails",userdetails);
  return mettinguserDetails=userdetails;
}


console.log("mettinguserDetails",mettinguserDetails)

// var document = documet.getElementById('btnviewdetails').addEventListener('click',function(e){
//   console.log("e",e)
// })\
function meetingviewDetails(event){
  let userdetailsofdata={}
  let ido=document.getElementById('btnviewdetails')
  console.log("hii viewdetails r you ready to open??",event,event.split(',').slice(-1))
if(event){
//  console.log ("event",event.length !== 1 &&event.match(/[a-z]/i))/[a-zA-Z]+/g
 console.log ("user",event.slice(-1))
 let userarray =event.split(',')
 console.log("valuenumber",event.slice(-1))
 console.log("user",userarray.splice(userarray.length-1,1))
 event.split(',').slice(-1)?sessionStorage.setItem("id",event.split(',').slice(-1) ):sessionStorage.setItem("user", event.split(',').splice(userarray.length-1,1));
console.log("userarray",userarray)
sessionStorage.setItem("user", userarray);
}
  
  
  // console.log("mettloop",mettloop)
        window.location.href='./viewDetails.html';
  // return mettinguserDetails;
}

function participants(){
  // meetingviewDetails()

  var viewdetailsofparticipent = [];
  viewdetailsofparticipent.push(sessionStorage.getItem('user'));
  console.log("viewdetailsofparticipent",viewdetailsofparticipent)
  console.log("hii",CompanyId)
    viewdetailsofparticipent.map((item)=>{
      console.log("viewdetailsofparticipent",item)
      var id =0;
item.split(',').map((val)=>{
  var exitinguser = document.getElementById('exitinguser');
    var div = document.createElement('div');
    id++;
    console.log("idd",id)
    // const att = document.createAttribute("id");
    div. setAttribute('id',`para-${id}`);
   div.style.background='#d8d3d3';
     div.style.height = '30px';
     div.style.width= '40px';
     div.style.margin= '5px';
    //  div.style.marginRight= '15px';
    //  div.style.position='absolute';
     exitinguser.appendChild(div)
    //  console.log("id",id)
      document.getElementById('para-1').addEventListener('click',(item)=>{
             console.log("item",document.getElementById('para-1'))
      })
})
    
    })
}

let forloops =0;
function details(){
  
  forloops++;
  axios.post('http://localhost:5000/api/fetch_user',{company_id:CompanyId}).then(async(response)=>{
    console.log("response",forloops)
    if(forloops<2){
    var text = "";
    let companyname = document.getElementById('companyName')
    response.data.users.map((item)=>{
      console.log("item",item.name)
      
    })
    for (var i= 0; i<response.data.users.length; i++){
          if(i<1){
            console.log('hii')
          }
            console.log("forloop",response.data.company)
            let ul = document.createElement('ul');
            ul.setAttribute('class','list-group');
        text=`  <li class="list-group-item border-0 d-flex p-4 mb-2 bg-gray-100 border-radius-lg" >
        <div class="d-flex flex-column">
          <span class="mb-2 text-xs " >Company Name: <span class="text-dark font-weight-bold ms-sm-2" id="companyName" >${response.data.company}</span></span>
          <span class="mb-2 text-xs">Email Address: <span class="text-dark ms-sm-2 font-weight-bold"><a
                href="./../cdn-cgi/l/email-protection.html" class="__cf_email__"
                data-cfemail="ef808386998a9daf8d9a9d9d869b80c18c8082">${response.data.users[i].email}</a></span></span>
          <span class="text-xs">VAT Number: <span
              class="text-dark ms-sm-2 font-weight-bold">FRB1235476900</span></span>
        </div>
        <div class="ms-auto text-end" onclick="addparticipent('${response.data.users[i].name}')">
          <a class="btn btn-link text-danger text-gradient px-3 mb-0" href="javascript:;" id="addbutton" ><i
          class="fa fa-plus text-secondary me-2" ></i>ADD</a>
        </div>
      </li>` ;
      ul.innerHTML = text;
      companyname.appendChild(ul)
       }
      }
      console.log("viewdetails++++",response.data.users,document.getElementById('addbutton'))
      response.data.users.map((item)=>{
        var data = sessionStorage.getItem('user').split(',')
        data.filter((value)=>{
          console.log("value",value===item.name,value)
          if(value===item.name){
            document.getElementById('addbutton').style.display = 'none';
          }
        })
         console.log("bro data",) 


      })
      // var span = document.createElement('span')
    }).catch(async(errors)=>{
      console.log("err--",errors)
      // console.log("dat0000",company_id)
      
    })

}

function addparticipent(user){
  var _id = sessionStorage.getItem('id')
  console.log("hii new participent",user)
  axios.post('http://localhost:5000/api/update/mettinguser',{_id:_id,users:user}).then((response)=>{
    console.log("meeting res",response.data.res)
    response.data.res.map((item)=>{
      console.log("item",item.userId)
      sessionStorage.setItem("user",item.userId)
      window.location.reload(true);
    })
  })
}

function detailsadd(){
  console.log("hii")
  document.getElementById('popupdetailsfile').style.display = "none";
  document.getElementById('popupdetails').style.display = "block";
 window.onload= details();
}
function detailsupload(){
  console.log("hlww detailsupload")
  document.getElementById('popupdetailsfile').style.display = "block";
  document.getElementById('popupdetails').style.display = "none";
}

function filebrowser(event){
  var file = event.target.value;
  var Id = sessionStorage.getItem('id')
  console.log("file",file,sessionStorage.getItem('id'))
  axios.post('http://localhost:5000/api/upload',{file,Id}).then((response)=>{
    console.log("response",response)
  }).catch((err)=>{
    console.log("err",err)
  })
  console.log("hii file ",event.target.value)
}

function groupchat(){
    console.log("function call")
    axios.post('http://localhost:5000/api/chat',{}).then((res)=>{
      console.log("res",res)
    //   socketioo()
     
    }).catch((err)=>{
        console.log("errrr",err)
    })
    //socketioo();
    var socket = io.connect('http://localhost:5000');
    // if(socket.ids){

        socketioo()   
    // }
    function socketioo(){
       // var socket = io();
         const username = prompt('Enter your Name:');
         console.log("Username",username)
      //  var socket = io.connect('http://localhost', {port: 5000});
        if(socket !== undefined){
        console.log('connect to server');
        console.log("Username",username)
    }else{
        console.log("err",err)
    }
    // socket.on('connect', function(){
    //      
    //     console.log("hiiii " )
    // });
    var element = function(id){
        return document.getElementById(id)
    }
    var sendcontainer = element('send-container');
    var messageInp = element('messageInp');
   var messageContainer = document.querySelector('.container');
   const append =(message,position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText =message;
    // messageElement.classList.add('message');
    // messageElement.classList.add(position);
    messageContainer.append(messageElement);
   }
     socket.on('connect', () => {
        console.log(socket,"socket.io)))))999",socket.id);}
        )
       // console.log(socket,"socket.io",socket.id); 
        console.log("Username",username)
       socket.emit('newuserjoin',username)
        console.log("hii user1234",username)
        // const repetname = []
        socket.on('user-join',(username)=>{
            // repetname.push(username)
            //    repetname.length>0?

            //    repetname.map(item=>{
            //            console.log("repetname.filter(username)",repetname)

            //            if(item===username){
            //                let dupilcate = []
            //                let userepName=repetname.pop(item)
            //              dupilcate.push(userepName)
            //              dupilcate.map((user)=>{
            //                 if(item===user){
            //                     console.log("uuuuuu",item,user)
            //                 }else{
            //                     console.log("OOOO",user)
            //                 }
            //              })
            //            }
            //        })
            //    repetname.filter(repetname.map((item)=>{
            //     item==username-1
            //     console.log("item inside filter name",item)
            //     console.log("item inside filter name",username)
            // }))
            // :
            // console.log("repetname++",repetname)
            console.log("username++",username)
            
            console.log("hii user",username,socket.id)
            if(socket.id){
             append(`${username} joined the chat`,'right')}
        })
        // console.log("repetname out",repetname)
        sendcontainer.addEventListener('submit',(event)=>{
            event.preventDefault();
            const message = messageInp.value;
            // if(socket.id){

                append(`You:${message}`,'right');
            // }
         //   $('#message').val('')
        socket.emit('send',message) ;
           })
        socket.on('recive',(message)=>{
            console.log("message",message)
            append(`${message.name}:${message.message}`,'left')
        })
        socket.on('left',(name)=>{
            console.log("message",name)
            append(`${name} left the chat`,'left')
        })
}
   
}