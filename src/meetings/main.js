/**Fetch Users */
function fetchUsers() {
  var company_id = "10002";

  axios.post('/api/fetchUsers', { company_id: company_id }).then(async (response) => {
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
fetchUsers()

/**Fetch Meetings */
function fetchMeetings() {
  var company_id = "10002";

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
fetchUsers()

[
{

}
,
{

}

]