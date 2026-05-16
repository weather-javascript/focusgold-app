importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCrZL-70u3uYUApW5vfSmktSDHHIDBcl7k",
  authDomain: "focusgold-app.firebaseapp.com",
  projectId: "focusgold-app",
  storageBucket: "focusgold-app.firebasestorage.app",
  messagingSenderId: "688930596421",
  appId: "1:688930596421:web:52124f27955d330169e52c"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  self.registration.showNotification(
    payload.notification.title || 'FocusGold',
    {
      body: payload.notification.body,
      icon: '/icon.png'
    }
  );
});
