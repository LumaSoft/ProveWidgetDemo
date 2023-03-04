const IFRAME_URL = 'https://verifywithprove.sparkwallet.io';
const WIDGET_ID = 'verify-with-prove';

class VerifyWithProveShim {
  closeWidget = () => {
    const widgetIframe = window.parent.document.getElementById(WIDGET_ID);

    if (widgetIframe) {
      widgetIframe.style.display = 'none';
    }
  }

  exitApp = () => {
    if (this.onExit) {
      this.onExit();
    }

    this.closeWidget();
  }

  receiveMessage = (event) => {
    if (event.origin !== IFRAME_URL) {
      return;
    }

    if (!!event && !!event.data && !!event.data.type) {
      switch (event.data.type) {
        case 'READY':
          // Our iframed app has notified us that it's ready and loaded
          // so send it a message to begin the open process
          this.iframe.contentWindow.postMessage({
            type: 'OPEN_APP',
            message: JSON.stringify({
              publicToken: this.publicToken,
            })
          }, IFRAME_URL);
          break;
        case 'CLOSE_WIDGET':
          this.closeWidget();
          break;
        case 'EXIT_APP':
          this.exitApp();
          break;
        case 'WIDGET_AUTH_SUCCESS':
          this.widgetAuthSucceeded();
          break;
        case 'WIDGET_AUTH_FAILED':
          this.widgetAuthFailed();
          break;
      }
    }
  }

  mountIframe = () => {
    const existingIframe = document.getElementById(WIDGET_ID);

    // We only want once instance of the Prove app running
    if (existingIframe) {
      existingIframe.parentNode.removeChild(existingIframe);
    }

    const iframe = document.createElement('iframe');
    this.iframe = iframe;
    iframe.id = WIDGET_ID;

    iframe.src = IFRAME_URL;
    iframe.crossorigin = "anonymous";
    iframe.style = "width:100%;height:100%;position: fixed;inset: 0px;z-index: 2147483647;border-width: 0px;overflow: hidden auto;"

    window.addEventListener("message", this.receiveMessage, false);
    document.body.appendChild(this.iframe);
  }

  widgetAuthSucceeded = () => {
    if (this.onSuccess) {
      this.onSuccess();
    }
  }

  widgetAuthFailed = () => {
    if (this.onFailure) {
      this.onFailure();
    }
  }

  open = (config) => {
    this.publicToken = config.publicToken;
    this.onSuccess = config.onSuccess;
    this.onFailure = config.onFailure;
    this.onExit = config.onExit;

    this.mountIframe();
  }
}

((window, document) => {
  if (window.VerifyWithProve) {
    return;
  }

  window.addEventListener('DOMContentLoaded', (event) => {
    window.VerifyWithProve = new VerifyWithProveShim();
  });
})(window, document, undefined);