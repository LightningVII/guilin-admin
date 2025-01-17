import { Button, message, notification } from 'antd';
import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { loadScript, loadCss } from 'esri-loader';
import defaultSettings from '../config/defaultSettings';

loadScript({
  // url: 'http://112.35.60.89:82/api4.11/init.js',
  url:
    'http://47.98.141.125/arcgis_js_v414_api/arcgis_js_v414_api/arcgis_js_api/library/4.14/init.js',
});
// loadCss('http://112.35.60.89:82/api4.11/esri/css/main.css');
loadCss(
  'http://47.98.141.125/arcgis_js_v414_api/arcgis_js_v414_api/arcgis_js_api/library/4.14/esri/css/main.css',
);
// setDefaultOptions({ css: true });

const { pwa } = defaultSettings; // if pwa is true

if (pwa) {
  // Notify user if offline now
  window.addEventListener('sw.offline', () => {
    message.warning(
      formatMessage({
        id: 'app.pwa.offline',
      }),
    );
  }); // Pop up a prompt on the page asking the user if they want to use the latest version

  window.addEventListener('sw.updated', event => {
    const e = event;

    const reloadSW = async () => {
      // Check if there is sw whose state is waiting in ServiceWorkerRegistration
      // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration
      const worker = e.detail && e.detail.waiting;

      if (!worker) {
        return true;
      } // Send skip-waiting event to waiting SW with MessageChannel

      await new Promise((resolve, reject) => {
        const channel = new MessageChannel();

        channel.port1.onmessage = msgEvent => {
          if (msgEvent.data.error) {
            reject(msgEvent.data.error);
          } else {
            resolve(msgEvent.data);
          }
        };

        worker.postMessage(
          {
            type: 'skip-waiting',
          },
          [channel.port2],
        );
      }); // Refresh current page to use the updated HTML and other assets after SW has skiped waiting

      window.location.reload(true);
      return true;
    };

    const key = `open${Date.now()}`;
    const btn = (
      <Button
        type="primary"
        onClick={() => {
          notification.close(key);
          reloadSW();
        }}
      >
        {formatMessage({
          id: 'app.pwa.serviceworker.updated.ok',
        })}
      </Button>
    );
    notification.open({
      message: formatMessage({
        id: 'app.pwa.serviceworker.updated',
      }),
      description: formatMessage({
        id: 'app.pwa.serviceworker.updated.hint',
      }),
      btn,
      key,
      onClose: async () => {},
    });
  });
} else if ('serviceWorker' in navigator) {
  // unregister service worker
  const { serviceWorker } = navigator;

  if (serviceWorker.getRegistrations) {
    serviceWorker.getRegistrations().then(sws => {
      sws.forEach(sw => {
        sw.unregister();
      });
    });
  }

  serviceWorker.getRegistration().then(sw => {
    if (sw) sw.unregister();
  }); // remove all caches

  if (window.caches && window.caches.keys) {
    caches.keys().then(keys => {
      keys.forEach(key => {
        caches.delete(key);
      });
    });
  }
}
