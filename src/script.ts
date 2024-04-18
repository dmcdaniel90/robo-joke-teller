import { VoiceRSS } from './utils/voicerss.ts'

type Button = HTMLButtonElement | HTMLElement | null;
type AudioElement = HTMLAudioElement | HTMLElement;

interface IJokeData {
  error: boolean
  category: string
  type: string
  joke: string
  setup: string
  delivery: string
  flags: {
    nsfw: boolean
    religious: boolean
    political: boolean
    racist: boolean
    sexist: boolean
    explicit: boolean
  }
  id: number
  safe: boolean
  lang: string
}

const playButton: Button = document.getElementById("button");
const audioElement: AudioElement | null = document.getElementById("audio");
const nsfwSwitch: HTMLElement | null = document.getElementById("settings-nsfw__input");
const nsfwModeButton: HTMLElement | null = document.getElementById('nsfw-dark');
const customCheckboxes: Element[] = Array.from(document.getElementsByClassName('checkbox-container'))
const selectAllCheckbox: HTMLElement | null = document.getElementById('all-checkbox');

//* User Settings
let userCategories: string[] = []; 
let nsfwMode = false;
// Append nsfw string to API URL to filter out nsfw jokes by default
let nsfwString = "?blacklistFlags=nsfw,religious,political,racist,sexist,explicit";
// Hide 'dark' category option by default
if (nsfwModeButton) {
  nsfwModeButton.style.display = 'none'
}

// Get jokes from Joke API
async function getJoke(): Promise<void> {
  getUserCategories();

  const apiUrl: string = `https://v2.jokeapi.dev/joke/${userCategories}${nsfwString}`;
  
  try {
    const response: Response = await fetch(apiUrl);
    const data: IJokeData = await response.json();

    // check if joke is single or double and set joke string accordingly
    const joke: string = data.joke ? data.joke : data.setup + '...' + data.delivery;

    // Text-to-Speech function
    playAudio(joke);

  } catch (error) {
    // catch error here
    console.error('Error fetching jokes -', error);
  }
}

// Passing joke string to VoiceRSS TTS as src parameter and audioElement for playing audio
function playAudio(userString: string) {
      VoiceRSS.speech({
      key: 'f83cf3c984414c67b2a8240b169e56c2',
      src: userString,
      hl: "en-us",
      r: "0",
      c: "mp3",
      f: "44khz_16bit_stereo",
      ssml: 'false',
      audioElement : audioElement as HTMLAudioElement
    });
}

function getUserCategories(): void {
  // Clear userCategories array
  userCategories = [];

  // Add user selected categories to userCategories array
  customCheckboxes.forEach(checkbox => {
    if ((checkbox.childNodes[1] as HTMLInputElement).checked && userCategories) {
      userCategories.push((checkbox.childNodes[0].textContent as string)?.trimEnd());
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
}

// Event listeners
playButton?.addEventListener('click', getJoke);

// Toggle nsfw mode
nsfwSwitch?.addEventListener('change', () => {
  nsfwMode = (nsfwSwitch as HTMLInputElement).checked;
  if (nsfwMode) {
    nsfwString = '';
    nsfwModeButton ? nsfwModeButton.style.display = 'block' : null
  } else {
    nsfwString = '?blacklistFlags=nsfw,religious,political,racist,sexist,explicit';

    if (nsfwModeButton) {
      nsfwModeButton.style.display = 'none';
      (nsfwModeButton.childNodes[1] as HTMLInputElement).checked = false;
    }
  }
});

// Disable the All checkbox if any other checkbox is checked
customCheckboxes.forEach(checkbox => {
  checkbox.addEventListener('change', () => {
    if ((checkbox.childNodes[1] as HTMLInputElement).id === 'all-checkbox') {
      return;
    } else {
      if (selectAllCheckbox) {
        (selectAllCheckbox as HTMLInputElement).checked = false;
      }
    }
  })
})

// Toggle all checkboxes on or off when the All checkbox is checked
if (selectAllCheckbox) {
  selectAllCheckbox.addEventListener('change', () => {
  if ((selectAllCheckbox as HTMLInputElement).checked) {
    customCheckboxes.filter(checkbox => nsfwMode ? checkbox : checkbox.id !== 'nsfw-dark').forEach(checkbox => (checkbox.childNodes[ 1 ] as HTMLInputElement).checked = true);
  } else {
    customCheckboxes.forEach(checkbox => (checkbox.childNodes[ 1 ] as HTMLInputElement).checked = false);
  }
})
}



