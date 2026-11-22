import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';

@Injectable({
  providedIn: 'root'
})
export class SleepService {
	public static AllOvernightData:OvernightSleepData[] = [];
	public static AllSleepinessData:StanfordSleepinessData[] = [];

	constructor() {
		this.loadData(); //getting saved logs when app opens
	}

	//loading saved logs from Preferences storage
	private loadData() {
		Preferences.get({ key: 'overnightData' }).then((result) => {
			if (result.value) {
				var overnightList = JSON.parse(result.value);
				for (var i = 0; i < overnightList.length; i++) {
					//dates get saved as text so changing them back to dates
					var sleepLog = new OvernightSleepData(new Date(overnightList[i].sleepStart), new Date(overnightList[i].sleepEnd));
					sleepLog.id = overnightList[i].id;
					SleepService.AllOvernightData.push(sleepLog);
				}
			}
		});

		Preferences.get({ key: 'sleepinessData' }).then((result) => {
			if (result.value) {
				var sleepinessList = JSON.parse(result.value);
				for (var j = 0; j < sleepinessList.length; j++) {
					var sleepinessLog = new StanfordSleepinessData(sleepinessList[j].loggedValue, new Date(sleepinessList[j].loggedAt));
					sleepinessLog.id = sleepinessList[j].id;
					SleepService.AllSleepinessData.push(sleepinessLog);
				}
			}
		});
	}

	//saving both lists to Preferences so they stay after refresh
	private saveData() {
		Preferences.set({ key: 'overnightData', value: JSON.stringify(SleepService.AllOvernightData) });
		Preferences.set({ key: 'sleepinessData', value: JSON.stringify(SleepService.AllSleepinessData) });
	}

	public logOvernightData(sleepData:OvernightSleepData) {
		SleepService.AllOvernightData.push(sleepData);
		this.saveData();
	}

	public logSleepinessData(sleepData:StanfordSleepinessData) {
		SleepService.AllSleepinessData.push(sleepData);
		this.saveData();
	}

	//keeping every log except the one being deleted
	public deleteOvernightData(sleepData:OvernightSleepData) {
		SleepService.AllOvernightData = SleepService.AllOvernightData.filter((log) => log.id != sleepData.id);
		this.saveData();
	}

	public deleteSleepinessData(sleepData:StanfordSleepinessData) {
		SleepService.AllSleepinessData = SleepService.AllSleepinessData.filter((log) => log.id != sleepData.id);
		this.saveData();
	}
}
