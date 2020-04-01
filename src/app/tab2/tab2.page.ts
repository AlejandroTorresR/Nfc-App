import { Platform } from '@ionic/angular';
import { Component, ChangeDetectorRef } from '@angular/core';
import { NFC, Ndef } from '@ionic-native/nfc/ngx';
import { Subscription, Observable } from 'rxjs'
import { Vibration } from '@ionic-native/vibration/ngx';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  providers: [NFC, Ndef, Vibration]
})
export class Tab2Page {
  //readingTag:   boolean   = false;
  writingTag:   boolean   = false;
  isWriting:    boolean   = false;
  ndefMsg:      any 	  = 'Hola Mundo';
  subscriptions: Array<Subscription> = new Array<Subscription>();
  loadedNfc: any = '';
  NfcID: any = '0';
  constructor(
  	private vibration: Vibration,
  	private cdr: ChangeDetectorRef,
  	private platform: Platform,
  	private nfc: NFC, 
  	private ndef: Ndef) {

  }

  ionViewWillLeave(){
	this.destroySubscriptions();	
  }

  startReaderMode(){
  	this.subscriptions.push(
  		this.nfc.readerMode(reader => { console.log('successfully attached reader listener', reader) }, (err) => { console.log('error attaching reader listener', err) })
  		.subscribe(data => {
	    	this.vibration.vibrate(500);
	    	console.log(data, 'data')
	    },
	    err => {
	    	console.log(err, 'err')
	    })
  	);
  }

  startNdefDiscover(){
	this.subscriptions.push(
		this.nfc.addNdefListener(() => { console.log('successfully attached Tag listener') }, (err) => { console.log('error attaching Tag listener', err) })
		.subscribe(data => {
			this.readTag(data);
	    	this.vibration.vibrate(500);
			// if (this.readingTag) {
			// 	let payload = data.tag.ndefMessage[0].payload;
			// 	let tagContent = this.nfc.bytesToString(payload).substring(3);
			// 	this.readingTag = false;
			// 	console.log("tag data", tagContent);
			// }
	    },
	    err => {
	    	console.log(err, 'err')
	    })
	 );
  }

  startTagDiscover(){
	this.subscriptions.push(
		this.nfc.addTagDiscoveredListener(() => { console.log('successfully attached Tag listener') }, (err) => { console.log('error attaching Tag listener', err) })
		.subscribe(data => {
	    	this.readTag(data);
	    	this.vibration.vibrate(500);
		},
	    err => {
	    	console.log(err, 'err')
	    })
	);
  }

  startMimeDiscover(){
	this.subscriptions.push(
		this.nfc.addMimeTypeListener('ndef-mime')
		.subscribe(data => {
	    	this.readTag(data);
	    	this.vibration.vibrate(500);
		},
	    err => {
	    	console.log(err, 'err')
	    })
	);
  }

  readTag(loadedNfc) {
    this.loadedNfc = loadedNfc;
    this.NfcID = this.nfc.bytesToHexString(loadedNfc.tag.id);
    console.log(this.loadedNfc, 'readTag');
    this.cdr.detectChanges();
  }

  writeTag(writeText: string) {
    this.ndef.textRecord(writeText);
  }

  share(){
  	this.nfc.share(this.loadedNfc.tag);
  }

  destroySubscriptions(){
  	this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
    console.log('destroy');
    this.loadedNfc = '';
    this.NfcID = '';
  }


}
