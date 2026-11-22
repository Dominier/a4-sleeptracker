import { SleepData } from './sleep-data';

export class OvernightSleepData extends SleepData {
	private sleepStart:Date;
	private sleepEnd:Date;

	constructor(sleepStart:Date, sleepEnd:Date) {
		super();
		this.sleepStart = sleepStart;
		this.sleepEnd = sleepEnd;
	}

	override summaryString():string {
		var sleepStart_ms = this.sleepStart.getTime();
		var sleepEnd_ms = this.sleepEnd.getTime();

		// Calculate the difference in milliseconds
		var difference_ms = sleepEnd_ms - sleepStart_ms;
		    
		// Convert to hours and minutes
		var hours = Math.floor(difference_ms / (1000*60*60));
		var minutes = Math.floor(difference_ms / (1000*60) % 60);

		//bedtime and wake time like 10:00 PM
		var bedtime = this.sleepStart.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
		var wakeTime = this.sleepEnd.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

		return hours + " hours, " + minutes + " minutes (" + bedtime + " to " + wakeTime + ")";
	}

	override dateString():string {
		return "Night of " + this.sleepStart.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
	}
}
