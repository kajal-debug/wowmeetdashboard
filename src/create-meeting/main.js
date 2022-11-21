const step1 = document.getElementById('environmentstep');
const step2 = document.getElementById('meetingdetailsstep');
const step3 = document.getElementById('participantsstep');
const environment = document.getElementById('environment');
const participants = document.getElementById('participants');
const meetingdetails = document.getElementById('meetingdetails');
const createmeeting = document.getElementById('createmeeting');
meetingdetails.style.display='none';
    participants.style.display='none';
    step1.style.border='1px solid red';
    step1.style.opacity=0.2;
    step1.style.borderRadius= "5px";
    createmeeting.disabled=true;
environment.addEventListener('click',function(){
    meetingdetails.style.display='';
    step1.style.border='1px solid green';
    step1.style.opacity=1;
    step1.style.borderRadius= "5px";
    step2.style.border='1px solid red';
    step2.style.opacity=0.2;
    step2.style.borderRadius= "5px";
})
step2.addEventListener('click',function(){
    createmeeting.disabled=false;
    meetingdetails.style.display='';
    participants.style.display='';
    step1.style.border='1px solid green';
    step1.style.opacity=1;
    step1.style.borderRadius= "5px";
    step2.style.border='1px solid green';
    step2.style.opacity=1;
    step2.style.borderRadius= "5px";
    step3.style.border='1px solid red';
    step3.style.opacity=0.2;
    step3.style.borderRadius= "5px";
})
