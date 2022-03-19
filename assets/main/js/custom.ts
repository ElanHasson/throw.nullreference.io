import { dom } from '@fortawesome/fontawesome-svg-core';
 
document.addEventListener('DOMContentLoaded', () => {
  dom.watch();
});
export interface ShareIntentWindow extends Window {
     
    shareIntent: Function;
}
declare let window: ShareIntentWindow;

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