import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent,IonCard,IonCardHeader,
	IonCardTitle, IonCardContent,IonDatetime,IonButton,ToastController,
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
  imports: [DatePipe, IonHeader, IonToolbar, IonTitle, IonContent,IonCard,IonCardHeader,
	IonCardTitle, IonCardContent,IonDatetime,IonButton,FormsModule,
	IonDatetimeButton,IonModal,IonList,IonItem,IonLabel,IonRange,IonIcon],
})
export class HomePage {
	//bed time and wake time in the sleep card
	bedtime:string='';
	wakeTime:string='';
	sleepiness:number=4;//sleepiness rating, starting in middle at 4
	sleepinessTime:string='';
	constructor(public sleepService:SleepService, public toastController:ToastController){
		//choices on a set time
		var lastNight = new Date();
		lastNight.setDate(lastNight.getDate()-1);
		lastNight.setHours(22,0,0,0);

		var thisMorning = new Date();
		thisMorning.setHours(7,0,0,0);

		this.bedtime= this.toPickerString(lastNight);
		this.wakeTime = this.toPickerString(thisMorning);
		this.sleepinessTime= this.toPickerString(new Date()); //sleepiness starts now
		addIcons({sunny, moon}); //icons for slider
	}
	get overnightLogs() {
		return SleepService.AllOvernightData;
	}

	get sleepinessLogs() {
		return SleepService.AllSleepinessData;
	}

	//standardizing local time string like '2026-07-12T22:00:00'
	toPickerString(date:Date):string {
		var offset = date.getTimezoneOffset() * 60 * 1000;
		var localDate = new Date(date.getTime() - offset);
		return localDate.toISOString().slice(0, 19);
	}
	//making sure wake time is after sleeptime
	isSleepValid():boolean {
		var start = new Date(this.bedtime);
		var end = new Date(this.wakeTime);
		return end > start;
	}

	saveSleep() {
		var start = new Date(this.bedtime);
		var end = new Date(this.wakeTime);
		this.sleepService.logOvernightData(new OvernightSleepData(start, end));

		this.toastController.create({
			message: 'Your sleep time has been saved!',
			duration: 2000
		}).then((toast) => {
			toast.present();
		});
	}
	//text that matches picked number on Stanford Sleepiness Scale
	get sleepinessDescription() {
		return StanfordSleepinessData.ScaleValues[this.sleepiness];
	}

	saveSleepiness() {
		var time = new Date(this.sleepinessTime);
		this.sleepService.logSleepinessData(new StanfordSleepinessData(this.sleepiness, time));

		//reset the time to now for the next log
		this.sleepinessTime = this.toPickerString(new Date());
		this.toastController.create({
			message: 'Your sleepiness value has been saved!',
			duration: 2000//confirmation when saving sleepiness
		}).then((toast) => {
			toast.present();
		});
	}
}
