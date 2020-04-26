import { v4 as uuidv4 } from 'uuid';

export default class TrackerData {
    constructor(defaultHistory = []) {
        this.history = defaultHistory;
    }
    
    getHistory = () => {
        return this.history;
    }

    addRecordToHistory = (newRecord) => {
        const newId = uuidv4();
        const fullRecord = {id: newId, ...newRecord}
        this.history = [fullRecord, ...this.history]

        return newId;
    }

    editExistingRecord = (recordId, newProperties) => {
        let recordIndex = this.history.findIndex(record => record.id === recordId)
        if(recordIndex !== undefined) {
            this.history[recordIndex] = {...this.history[recordIndex], ...newProperties};
        }
    }

    get wins() {
        return this.history.filter(item => item.localPlayerWon === true).length
    }

    get losses() {
        return this.history.filter(item => item.localPlayerWon === false).length
    }
}