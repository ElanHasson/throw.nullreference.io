import { library, dom, config } from '@fortawesome/fontawesome-svg-core';
import { faGlobe, faClock } from '@fortawesome/free-solid-svg-icons';

config.searchPseudoElements = true;

library.add(faGlobe, faClock); // Add icons that you need.

document.addEventListener('DOMContentLoaded', () => {
  dom.watch();
});

window.shareIntent = function (title, text, url) {
  const shareData = {
    title: title,
    text: text,
    url: url
  }

  const btn = document.querySelector('.platform-sharer');
  

  // Share must be triggered by "user activation"
  btn.addEventListener('click', async () => {
    try {
      await navigator.share(shareData)
    } catch(err) {
      console.log('Error: ' + err)
    }
  });
}