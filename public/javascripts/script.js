// import axios from 'axios';
document.addEventListener('DOMContentLoaded', () => {

  setInterval(() => {
    console.log('calling reminders');
    axios.get('https://remind-mee.herokuapp.com/sendMessage')
    .then((res) => console.log(res.data))
    .catch((err) => console.log(err));

  },2 * 60000); //run the function every five minutes
  
  console.log('IronGenerator JS imported successfully!');

}, false);


