import { v4 as uuidv4 } from 'uuid';

export default class TrackerData {
    static history = [];

    static addRecordToHistory = (newRecord) => {
        const newId = uuidv4();
        const fullRecord = {id: newId, ...newRecord}
        TrackerData.history = [fullRecord, ...this.history]

        return newId;
    }

    static editExistingRecord = (recordId, newProperties) => {
        let recordIndex = TrackerData.history.findIndex(record => record.id === recordId)
        if(recordIndex !== undefined) {
            this.history[recordIndex] = {...this.history[recordIndex], ...newProperties};
        }
    }

    get history() {
        return TrackerData.history;
    }

    get wins() {
        return TrackerData.history.filter(item => item.localPlayerWon === true).length
    }

    get losses() {
        return TrackerData.history.filter(item => item.localPlayerWon === false).length
    }
}