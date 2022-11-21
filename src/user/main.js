var uploadimg = document.getElementById('display-picture');
// uploadimg.src= `/uploads/${localStorage.name.concat(localStorage.image)}`

/**Fetch Users */

function fetchUsers() {
  var company_id = localStorage.company_id;
  axios.defaults.headers.common['x-auth-token'] = localStorage.token;
  axios.post('/api/fetchUsers', { company_id: company_id }).then(async (response) => {
    // console.log("response", response.data.users.length)
    $("#team-count").text(response.data.users.length);
    var text = "";
    var row = "";
    // console.log("response.data.users",Math.floor(response.data.users.length/2))
    // Math.floor(response.data.users.length/2).map((item)=>{
    //  text1=  `<div class='row'>
    //    <div class='col-lg-6 col-md-6 col-sm col-xs'>h</div>
    //    <div class='col-lg-6 col-md-6 col-sm col-xs'>hmk</div>
    //    </div>`
    //    $("#team").html(text1);
    // })
    response.data.users.map(async(item,i,arr) => {
      var display = ''
      // console.log("response.data.users",Math.ceil(response.data.users.length/2))
            //  console.log("item",arr.length, i,i+1,item.name,i<arr.length-1?arr[i].name:0,i<arr.length-1?arr[i+1].name:0)
            console.log("i",item.name,i,Math.floor(i%2)==0&&i<arr.length?`${i}+${i+1}`:0,"length",arr.length)
      text +=
      `
     <div class='col-lg-6 col-md-6 col-sm col-xs'>
     <div class="sidebar-user-pro media border-end">
     <div class="position-relative mx-auto">
         <img src="assets/images/users/user-4.jpg" alt="user" class="rounded-circle thumb-md">
     </div>
     <div class="media-body ms-2 user-detail align-self-center">
         <h5 class="font-14 m-0 ">`+ item.name + `</h5>
         <p class="opacity-50 mb-0">`+ item.user_type + `</p>
     </div>
     <div 
     onclick= "Delete('${item.name}')"><i class="far fa-trash-alt" style=" margin:5px; color: #c26161;
     font-size: 18px;"></i></div>
 </div>
                  </div>
                 
              `
              // document.getElementById('colspa').style.display='none':
              // document.getElementById('colspa').style.display='';
          //  return i===arr.length ?display += 'none':display += ''
            });
    // for(var i =0; i<Math.ceil(response.data.users.length/2);i++){
    //   row = `<div class = 'row'></div>`
    // }
   await $("#team").html(text);
  }).catch(async (errors) => {
    toastr["error"](errors)
    toastr.options = {
      "closeButton": true,
      "newestOnTop": false,
      "progressBar": true,
      "positionClass": "toast-top-center",
    //   "preventDuplicates": false,
    //   "onclick": null,
       "showDuration": "3000000",
    //   "hideDuration": "1000",
       "timeOut": "50000000",
    //   "extendedTimeOut": "1000",
    //   "showEasing": "swing",
    //   "hideEasing": "linear",
    //   "showMethod": "fadeIn",
    //   "hideMethod": "fadeOut"
    }
    // console.log("error-*--*",errors.response.data.msg)
  })

}
fetchUsers()
function Delete(e){
  axios.defaults.headers.common['x-auth-token'] = localStorage.token;
  console.log("r u ready to delete",e)
  axios.post('/api/DeleteUsers', { name: e}).then(async (response) => {
      console.log("item",response)
      fetchUsers()
  }).catch(async (errors) => {
    toastr["error"](errors.response)
    toastr.options = {
      "closeButton": true,
      "newestOnTop": false,
      "progressBar": true,
      "positionClass": "toast-top-center",
    //   "preventDuplicates": false,
    //   "onclick": null,
       "showDuration": "3000000",
    //   "hideDuration": "1000",
       "timeOut": "50000000",
    //   "extendedTimeOut": "1000",
    //   "showEasing": "swing",
    //   "hideEasing": "linear",
    //   "showMethod": "fadeIn",
    //   "hideMethod": "fadeOut"
    }
    
  })
}
function Accept(e){
  axios.defaults.headers.common['x-auth-token'] = localStorage.token;
  console.log("r u ready to delete",e)
  axios.post('/api/AcceptUsers', { name: e}).then(async (response) => {
      console.log("item",response)
      fetchUsers()
      Accept();
  }).catch(async (errors) => {
    toastr["error"](errors.response)
    toastr.options = {
      "closeButton": true,
      "newestOnTop": false,
      "progressBar": true,
      "positionClass": "toast-top-center",
    //   "preventDuplicates": false,
    //   "onclick": null,
       "showDuration": "3000000",
    //   "hideDuration": "1000",
       "timeOut": "50000000",
    //   "extendedTimeOut": "1000",
    //   "showEasing": "swing",
    //   "hideEasing": "linear",
    //   "showMethod": "fadeIn",
    //   "hideMethod": "fadeOut"
    }
    
  })
}
/**Request User**/
function requestUsers() {
  var company_id = localStorage.company_id;
  axios.defaults.headers.common['x-auth-token'] = localStorage.token;
  axios.post('/api/requestUsers', { company_id: company_id }).then(async (response) => {
    // console.log("response", response.data.users.length)
    $("#team-count").text(response.data.users.length);
    var text = "";
    console.log("response.data.users",Math.floor(response.data.users.length/2))
    // Math.floor(response.data.users.length/2).map((item)=>{
    //  text1=  `<div class='row'>
    //    <div class='col-lg-6 col-md-6 col-sm col-xs'>h</div>
    //    <div class='col-lg-6 col-md-6 col-sm col-xs'>hmk</div>
    //    </div>`
    //    $("#team").html(text1);
    // })
    response.data.users.map((item) => {
      // console.log("item",item)
           
      text += `<div class="sidebar-user-pro media border-end">
                  <div class="position-relative mx-auto">
                      <img src="assets/images/users/user-4.jpg" alt="user" class="rounded-circle thumb-md">
                  </div>
                  <div class="media-body ms-2 user-detail align-self-center">
                      <h5 class="font-14 m-0 ">`+ item.name + `</h5>
                      <p class="opacity-50 mb-0">`+ item.user_type + `</p>
                  </div>
                  <div 
                  onclick= "Delete('${item.name}')"> <i class="far fa-trash-alt" style=" margin:5px; color: #c26161;
                  font-size: 18px;"></i></div>
                  <div 
                  onclick= "Accept('${item.name}')"><i class="fa fa-check-circle" style=" margin:5px; color: green;
                  font-size: 18px;"></i></div>
              </div>`;
    });
    // for(var i =0; i<Math.ceil(response.data.users.length/2);i++){
    //   row = `<div class = 'row'></div>`
    // }
    $("#request").html(text);
  }).catch(async (errors) => {
    toastr["error"](errors.response.data.msg)
    toastr.options = {
      "closeButton": true,
      "newestOnTop": false,
      "progressBar": true,
      "positionClass": "toast-top-center",
    //   "preventDuplicates": false,
    //   "onclick": null,
       "showDuration": "3000000",
    //   "hideDuration": "1000",
       "timeOut": "50000000",
    //   "extendedTimeOut": "1000",
    //   "showEasing": "swing",
    //   "hideEasing": "linear",
    //   "showMethod": "fadeIn",
    //   "hideMethod": "fadeOut"
    }
    // console.log("error-*--*",errors.response.data.msg)
  })

}
requestUsers()

/**Fetch Meetings */
function fetchMeetings() {
  var company_id = localStorage.company_id;

  axios.post('/api/fetchMeetings', { company_id: company_id }).then(async (response) => {
    // console.log("response", response.data.users.length)


    $("#team-count").text(response.data.users.length);






    
    var text = "";
    response.data.users.map((item) => {
      // console.log("item", item.name)
      text += `<div class="sidebar-user-pro media border-end">
                  <div class="position-relative mx-auto">
                      <img src="assets/images/users/user-4.jpg" alt="user" class="rounded-circle thumb-md">
                  </div>
                  <div class="media-body ms-2 user-detail align-self-center">
                      <h5 class="font-14 m-0 ">`+ item.name + `</h5>
                      <p class="opacity-50 mb-0">`+ item.user_type + `</p>
                      
      
                  </div>
              </div>`;
    });
    $("#team").html(text);

  }).catch(async (errors) => {
  })
}


