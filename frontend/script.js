const tdtparagraph = document.getElementById('TDTs');
const Button = document.getElementById( "tdtbutton");

Button.addEventListener('click', function() {
  fetch('https://yab7fojaja.execute-api.us-east-1.amazonaws.com/dev/')
    .then(response => response.json())
    .then(function(data) {
      tdtparagraph.innerText = data;
    });
  });