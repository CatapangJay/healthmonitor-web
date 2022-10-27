export class PatientInfo {
    constructor(
        public Id: number,
        public Firstname: string,
        public MiddleName: string,
        public LastName: string,
        public ImageUrl: string,
        public BirthDate: Date,
        public email: string,
        public phoneNumber: string,
        public street: string,
        public city: string,
        public province: string) {
    }
}
