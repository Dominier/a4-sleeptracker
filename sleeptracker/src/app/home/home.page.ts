import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent,IonCard,IonCardHeader,
	IonCardTitle, IonCardContent,IonDatetime,IonButton,ToastController,AlertController,
	IonDatetimeButton,IonModal,IonList,IonItem,IonLabel,IonRange,IonIcon} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { sunny, moon } from 'ionicons/icons';
import { SleepService } from '../services/sleep.service';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import{FormsModule} from '@angular/forms'
//have to import components for everything to work from html
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent,IonCard,IonCardHeader,
	IonCardTitle, IonCardContent,IonDatetime,IonButton,FormsModule,
	IonDatetimeButton,IonModal,IonList,IonItem,IonLabel,IonRange,IonIcon],
})
export class HomePage {
	//bed time and wake time in the sleep card
	bedtime:string='';
	wakeTime:string='';
	sleepiness:number=4;//sleepiness rating, starting in middle at 4
	sleepinessTime:string='';
	maxDate:string='';//latest time you can pick is now, so no future dates
	constructor(public sleepService:SleepService, public toastController:ToastController, public alertController:AlertController){
		//choices on a set time
		var lastNight = new Date();
		lastNight.setDate(lastNight.getDate()-1);
		lastNight.setHours(22,0,0,0);

		var thisMorning = new Date();
		thisMorning.setHours(7,0,0,0);

		this.bedtime= this.toPickerString(lastNight);
		this.wakeTime = this.toPickerString(thisMorning);
		this.sleepinessTime= this.toPickerString(new Date()); //sleepiness starts now
		this.maxDate = this.toPickerString(new Date());
		addIcons({sunny, moon}); //icons for slider
	}

	/* Ionic doesn't allow bindings to static variables, so this getter can be used instead. */
	get overnightData() {
		return SleepService.AllOvernightData;
	}

	get sleepinessData() {
		return SleepService.AllSleepinessData;
	}

	//standardizing local time string like '2026-07-12T22:00:00'
	toPickerString(date:Date):string {
		var offset = date.getTimezoneOffset() * 60 * 1000;
		var localDate = new Date(date.getTime() - offset);
		return localDate.toISOString().slice(0, 19);
	}
	//making sure wake time is after sleeptime and not in the future
	isSleepValid():boolean {
		var start = new Date(this.bedtime);
		var end = new Date(this.wakeTime);
		var now = new Date();
		return end > start && end <= now;
	}

	saveSleep() {
		var start = new Date(this.bedtime);
		var end = new Date(this.wakeTime);
		this.sleepService.logOvernightData(new OvernightSleepData(start, end));
		this.showToast('Your sleep time has been saved!');
	}
	//text that matches picked number on Stanford Sleepiness Scale
	get sleepinessDescription() {
		return StanfordSleepinessData.ScaleValues[this.sleepiness];
	}

	saveSleepiness() {
		var time = new Date(this.sleepinessTime);
		this.sleepService.logSleepinessData(new StanfordSleepinessData(this.sleepiness, time));

		//resetting time to now for next log
		this.sleepinessTime = this.toPickerString(new Date());
		this.maxDate = this.toPickerString(new Date());
		this.showToast('Your sleepiness value has been saved!');
	}

	//asking before deleting a sleep log
	deleteOvernight(log:OvernightSleepData) {
		this.alertController.create({
			header: 'Delete this sleep log?',
			buttons: [{
				text: 'Cancel',
				role: 'cancel'
			}, {
				text: 'Delete',
				handler: () => {
					this.sleepService.deleteOvernightData(log);
					this.showToast('Sleep log deleted.');
				}
			}]
		}).then((alert) => {
			alert.present();
		});
	}

	//asking before deleting a sleepiness log
	deleteSleepiness(log:StanfordSleepinessData) {
		this.alertController.create({
			header: 'Delete this sleepiness log?',
			buttons: [{
				text: 'Cancel',
				role: 'cancel'
			}, {
				text: 'Delete',
				handler: () => {
					this.sleepService.deleteSleepinessData(log);
					this.showToast('Sleepiness log deleted.');
				}
			}]
		}).then((alert) => {
			alert.present();
		});
	}

	//pop up message at the bottom when something saves or deletes
	showToast(message:string) {
		this.toastController.create({
			message: message,
			duration: 2000
		}).then((toast) => {
			toast.present();
		});
	}
}
