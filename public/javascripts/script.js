// import axios from 'axios';
document.addEventListener('DOMContentLoaded', () => {

  setInterval(() => {
    console.log('calling reminders');
    axios.get('http://localhost:3000/sendMessage')
    .then((res) => console.log(res.data))
    .catch((err) => console.log(err));

  },2 * 60000); //run the function every five minutes
  
  console.log('IronGenerator JS imported successfully!');

}, false);


