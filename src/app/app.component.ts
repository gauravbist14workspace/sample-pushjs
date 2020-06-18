import { Component, OnInit, HostListener } from '@angular/core';
import { default as Push } from 'push.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'sample-pushjs';
  pushJSObj: any;
  connectionString: string;
  isConnected: boolean;

  constructor() {
    this.pushJSObj = {
      body: "This is where the notification goes.'",
      icon: 'assets/angular.png',
      timeout: 4000,
      // requireInteraction: true,
      tag: 'push-notification',
      silent: true,
      onClick: function () {
        window.focus();
        this.close();
      }
    };

  }

  ngOnInit() {

    // It only registers when server running on Signed certificate
    navigator.serviceWorker.register('assets/js/sw.js').then((data) => {
      alert("Service worker registered")
    }).catch(err => {
      alert("Service worker failed to register")
    });

    navigator.onLine ? this.Connected(true) : this.Connected(false);
  }

  @HostListener('window:online', ['$event'])
  connectionAvailable($event) {
    console.log($event);
    this.Connected(true);
  }

  @HostListener('window:offline', ['$event'])
  connectionUnvailable($event) {
    console.log($event);
    this.Connected(false)
  }

  Connected(connectionAvailable: boolean) {
    this.isConnected = connectionAvailable;

    if (this.isConnected) {
      this.pushJSObj.body = "Connected to Network";
      this.connectionString = "Connected";
    } else {
      this.pushJSObj.body = "Connection to network lost";
      this.connectionString = "Disconnected";
    }

    navigator.serviceWorker.ready.then((registration) => {
      // registration.showNotification('Notification with ServiceWorker');
      Push.create("Hello world!", this.pushJSObj);
    });

  }
}
