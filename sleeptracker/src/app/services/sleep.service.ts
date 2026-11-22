import { Injectable, signal, WritableSignal } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';

const overnightKey = 'overnight-logs';
const sleepinessKey = 'sleepiness-logs';

interface SavedOvernightLog {
	id: string;
	loggedAt: string;
	sleepStart: string;
	sleepEnd: string;
}

interface SavedSleepinessLog {
	id: string;
	loggedAt: string;
	loggedValue: number;
}

@Injectable({
	providedIn: 'root'
})
export class SleepService {
	readonly overnightLogs = signal<OvernightSleepData[]>([]);
	readonly sleepinessLogs = signal<StanfordSleepinessData[]>([]);
	readonly historyStatus = signal<'loading' | 'ready' | 'error'>('loading');

	private pendingSave = this.loadLogs();

	private async loadLogs() {
		try {
			const [overnight, sleepiness] = await Promise.all([
				Preferences.get({ key: overnightKey }),
				Preferences.get({ key: sleepinessKey })
			]);
			const savedOvernight: SavedOvernightLog[] = JSON.parse(overnight.value ?? '[]');
			const savedSleepiness: SavedSleepinessLog[] = JSON.parse(sleepiness.value ?? '[]');

			// JSON stores dates as strings, so recreate the log objects for the history.
			const overnightLogs = savedOvernight.map(saved => {
				const log = new OvernightSleepData(new Date(saved.sleepStart), new Date(saved.sleepEnd));
				log.id = saved.id;
				log.loggedAt = new Date(saved.loggedAt);
				return log;
			});
			const sleepinessLogs = savedSleepiness.map(saved => {
				const log = new StanfordSleepinessData(saved.loggedValue, new Date(saved.loggedAt));
				log.id = saved.id;
				return log;
			});

			this.overnightLogs.set(overnightLogs);
			this.sleepinessLogs.set(sleepinessLogs);
			this.historyStatus.set('ready');
		} catch {
			this.historyStatus.set('error');
		}
	}

	logOvernightData(log: OvernightSleepData) {
		return this.updateLogs(overnightKey, this.overnightLogs, logs => [...logs, log]);
	}

	logSleepinessData(log: StanfordSleepinessData) {
		return this.updateLogs(sleepinessKey, this.sleepinessLogs, logs => [...logs, log]);
	}

	deleteLog(log: OvernightSleepData | StanfordSleepinessData) {
		if (log instanceof OvernightSleepData) {
			return this.updateLogs(overnightKey, this.overnightLogs, logs =>
				logs.filter(entry => entry.id !== log.id));
		}

		return this.updateLogs(sleepinessKey, this.sleepinessLogs, logs =>
			logs.filter(entry => entry.id !== log.id));
	}

	private updateLogs<T>(key: string, logs: WritableSignal<T[]>, update: (logs: T[]) => T[]) {
		// Wait for history to load and for any earlier save to finish.
		const save = this.pendingSave.then(async () => {
			if (this.historyStatus() !== 'ready') {
				throw new Error('Could not load saved logs.');
			}

			const updatedLogs = update(logs());
			await Preferences.set({ key, value: JSON.stringify(updatedLogs) });
			logs.set(updatedLogs);
		});

		// A failed save should still allow the next attempt.
		this.pendingSave = save.catch(() => {});
		return save;
	}
}
