import { Timestamp } from '@firebase/firestore-types';

export class PatientInfo {
    constructor(
        public Id: string,
        public Firstname: string,
        public Middlename: string,
        public Lastname: string,
        public ImageUrl: string,
        public BirthDate: Timestamp,
        public email: string,
        public phoneNumber: string,
        public address: string
        ) {
    }
}
