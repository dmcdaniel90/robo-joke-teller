import { VoiceRSS } from './utils/voicerss.ts'

const button = document.getElementById("button");
const audioElement = document.getElementById("audio");
const nsfwSwitch = document.getElementById("settings-nsfw__input");
const nsfwModeButton = document.getElementById('nsfw-dark');
const customCheckboxes = Array.from(document.getElementsByClassName('checkbox-container'))

//* User Settings
let userCategories = []; 
let nsfwMode = false;
// Append nsfw string to API URL to filter out nsfw jokes by default
let nsfwString = "?blacklistFlags=nsfw,religious,political,racist,sexist,explicit";
// Hide 'dark' category option by default
document.getElementById('nsfw-dark').style.display = 'none'


// Get jokes from Joke API
async function getJoke() {
  getUserCategories();

  const apiUrl = `https://v2.jokeapi.dev/joke/${userCategories}${nsfwString}`;
  console.log(apiUrl);
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    // check if joke is single or double and set joke string accordingly
    const joke = data.joke ? data.joke : data.setup + '...' + data.delivery;

    // Text-to-Speech function
    playAudio(joke);

  } catch (error) {
    // catch error here
    console.error('Error fetching jokes -', error);
  }
}

// Passing joke string to VoiceRSS TTS as src parameter and audioElement for playing audio
function playAudio(userString) {
      VoiceRSS.speech({
      key: 'f83cf3c984414c67b2a8240b169e56c2',
      src: userString,
      hl: "en-us",
      r: "0",
      c: "mp3",
      f: "44khz_16bit_stereo",
      ssml: 'false',
      audioElement
    });
}

function getUserCategories() {
  // Clear userCategories array
  userCategories = [];

  // Add user selected categories to userCategories array
  customCheckboxes.forEach(checkbox => {
    if (checkbox.childNodes[1].checked) {
      userCategories.push(checkbox.childNodes[0].textContent.trimEnd());
    }
  })

  // If user selected 'All' or no categories, set userCategories to 'Any'
  if (userCategories.length === 0 || userCategories[0] === 'All') {
    userCategories = ['Any'];
  } else {
    userCategories = userCategories.filter(category => category !== 'All');
  }

  // Join userCategories array into a string
  userCategories.join(',');
  console.log(userCategories);
}

// Event listeners
button.addEventListener('click', getJoke);

// Toggle nsfw mode
nsfwSwitch.addEventListener('change', () => {
  nsfwMode = nsfwSwitch.checked;
  if (nsfwMode) {
    nsfwString = '';
    nsfwModeButton.style.display = 'block'
  } else {
    nsfwString = '?blacklistFlags=nsfw,religious,political,racist,sexist,explicit';
    nsfwModeButton.style.display = 'none'
    nsfwModeButton.childNodes[1].checked = false;
  }
});

// Disable the All checkbox if any other checkbox is checked
customCheckboxes.forEach(checkbox => {
  checkbox.addEventListener('change', () => {
    if (checkbox.childNodes[1].id === 'all-checkbox') {
      return;
    } else {
      document.getElementById('all-checkbox').checked = false;
    }
  })
})

// Toggle all checkboxes on or off when the All checkbox is checked
document.getElementById('all-checkbox').addEventListener('change', () => {
  if (document.getElementById('all-checkbox').checked) {
    customCheckboxes.filter(checkbox => nsfwMode ? checkbox : checkbox.id !== 'nsfw-dark').forEach(checkbox => checkbox.childNodes[ 1 ].checked = true);
  } else {
    customCheckboxes.forEach(checkbox => checkbox.childNodes[ 1 ].checked = false);
  }
})



