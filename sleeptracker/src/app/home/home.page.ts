import { Component, signal } from '@angular/core';
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
	readonly saving = signal(false);
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

	async saveSleep() {
		const start = new Date(this.bedtime);
		const end = new Date(this.wakeTime);
		this.saving.set(true);

		try {
			await this.sleepService.logOvernightData(new OvernightSleepData(start, end));
		} catch {
			await this.showToast('Could not save your sleep. Please try again.');
			return;
		} finally {
			this.saving.set(false);
		}

		await this.showToast('Your sleep time has been saved!');
	}
	//text that matches picked number on Stanford Sleepiness Scale
	get sleepinessDescription() {
		return StanfordSleepinessData.ScaleValues[this.sleepiness];
	}

	async saveSleepiness() {
		const time = new Date(this.sleepinessTime);
		this.saving.set(true);

		try {
			await this.sleepService.logSleepinessData(new StanfordSleepinessData(this.sleepiness, time));
		} catch {
			await this.showToast('Could not save your sleepiness. Please try again.');
			return;
		} finally {
			this.saving.set(false);
		}

		this.sleepinessTime = this.toPickerString(new Date());
		await this.showToast('Your sleepiness value has been saved!');
	}

	private async showToast(message: string) {
		const toast = await this.toastController.create({ message, duration: 2000 });
		await toast.present();
	}
}
