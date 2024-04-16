// VoiceRSS Javascript SDK
interface Settings {
  key: string // API key
  src: string // Text to convert to speech
  hl: string // Language
  r: string // Rate from -10 to 10
  c: string // Audio codec
  f: string // Audio format
  ssml: string // speech synthesis flag
  audioElement?: HTMLElement | HTMLAudioElement // Audio element
}

export const VoiceRSS = {
  // Call validation and request functions with the settings object
  speech: function (e: Settings) {
    this._validate(e), this._request(e)
  },
  // Validation function to check if the settings object has the required properties
  _validate: function (e: Settings) {
    if (!e)
      throw "The settings are undefined";
    if (!e.key)
      throw "The API key is undefined";
    if (!e.src)
      throw "The text is undefined";
    if (!e.hl)
      throw "The language is undefined";
    // If the audio codec is not set to auto, check if the browser supports the codec
    if (e.c && "auto" != e.c.toLowerCase()) {
      var a: boolean | string = !1;
      switch (e.c.toLowerCase()) {
        case "mp3": a = (new Audio).canPlayType("audio/mpeg");
          break;
        case "wav": a = (new Audio).canPlayType("audio/wav");
          break;
        case "aac": a = (new Audio).canPlayType("audio/aac");
          break;
        case "ogg": a = (new Audio).canPlayType("audio/ogg");
          break;
        case "caf": a = (new Audio).canPlayType("audio/x-caf");
      }
      if (!a)
        throw "The browser does not support the audio codec " + e.c
    }
  },

  _request: async function (e: Settings) {
    try {
      const response = await fetch('https://api.voicerss.org/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: this._buildRequest(e)
      })

      if (response.ok) {
        const result = await response.text()
        if (e.audioElement instanceof HTMLAudioElement) {
          e.audioElement.src = result
          e.audioElement.play()
        } else throw 'audioElement must be an instance of HTMLAudioElement'
      } else {
        const error = await response.text()
        throw error
      }
    } catch(error) {
      console.log(error)
    }
  },

  // Build the request string
  _buildRequest: function (e: Settings): string {
    // If there is a codec in the settings object, set the codec to the value of the codec, otherwise call the detectCodec function
    var a: string = e.c && "auto" != e.c.toLowerCase() ? e.c : this._detectCodec();
    // Return the request string with the key, text, language, rate, codec, format, and ssml
    return `key=${(e.key || "")}&src=${(e.src || "")}&hl=${(e.hl || "")}&r=${(e.r || "")}&c=${(a || "")}&f=${(e.f || "")}&ssml=${(e.ssml || "")}&b64=true`
  },
  // Detect the audio codec supported by the browser
  _detectCodec: function (): string {
    // Create an audio element
    var e: HTMLAudioElement = new Audio;
    // Check if the browser supports the audio codecs and return the codec
    return(
      e.canPlayType("audio/mpeg") ? "mp3"
      : e.canPlayType("audio/wav") ? "wav"
      : e.canPlayType("audio/aac") ? "aac"
      : e.canPlayType("audio/ogg") ? "ogg"
      : e.canPlayType("audio/x-caf") ? "caf"
      : ""
    )
  },
  // Try to create an instance of the XMLHttpRequest object, if it fails, try to create an instance of the ActiveXObject object with the specified versions
  _getXHR: function (): ActiveXObject | XMLHttpRequest {
    try {
      // Works in modern browsers
      return new XMLHttpRequest
    } catch (e) {

    } try {
      // Works in IE7 and IE8
      return new ActiveXObject("Msxml3.XMLHTTP")
    } catch (e) {

    } try {
      // Works in IE6
      return new ActiveXObject("Msxml2.XMLHTTP.6.0")
    } catch (e) {

    } try {
      //Works in IE5
      return new ActiveXObject("Msxml2.XMLHTTP.3.0")
    } catch (e) {

    } try {
      // Works in Firefox, Opera and Chrome
      return new ActiveXObject("Msxml2.XMLHTTP")
    } catch (e) {

    } try {
      // For everything else, return a standard HTTP request
      return new ActiveXObject("Microsoft.XMLHTTP")
    } catch (e) {
      
     } throw "The browser does not support HTTP request"
  }
};


