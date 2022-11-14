/**Fetch Users */
function fetchUsers() {
  var company_id = localStorage.company_id;
  axios.defaults.headers.common['x-auth-token'] = localStorage.token;
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
  var company_id = localStorage.company_id;

  axios.post('/api/fetchMeetings', { company_id: company_id }).then(async (response) => {
    // console.log("response", response.data.users.length)
    if (response.data.meetings.length > 0) {

      $('#div-no-meeting').hide();

      var text = "";
      response.data.meetings.map((item) => {
        // console.log("item", item.name)
        text += `<div class="col-md-4 col-lg-4 picture-item p-3">
                    <div class="lightbox effect-image zoom-effect">
                        <img class="img-fluid" src="assets/images/small/img-1.jpg" alt="image-1">

                        <h5 class="position-absolute bottom-0 start-0 p-1 text-white fw-bold">
                            `+ item.meetingName + `
                        </h5>

                        <button type="button" class="btn position-absolute top-0 start-0 m-1" style="background-color: #7e7eab;">`+ item.users.length + `
                            members</button>

                    </div>
                    <div class="btn-group w-100 py-2">
                        <a href="/game/?mId=`+ item.meeting_id + `" type="button" class="btn btn-success" style="background-color: #009706;">Start Meeting</a>
                        <a href="/view-meeting/?mId=`+ item.meeting_id + `" type="button" class="btn btn-light">Details</a>
                    </div>
                </div>`;
      });
      $("#grid").html(text);
    }
  }).catch(async (errors) => {
  })
}
fetchMeetings()
