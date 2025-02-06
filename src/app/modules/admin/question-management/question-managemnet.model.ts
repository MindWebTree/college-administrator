export class QbankType {
    title: string;
    id: number;
    IsActive: boolean;
    noOfQuestions: number;
    constructor(qbanktype) {
        {
            this.id = qbanktype.id; //|| UnisunUtils.generateGUID();
            this.title = qbanktype.title || '';
            this.title = qbanktype.noOfQuestions;
        }
    }
}
export class Subjects {
    title: string;
    id: number;

    noOfQuestions: number;
    constructor(subjects) {
        {
            this.id = subjects.id; //|| UnisunUtils.generateGUID();
            this.title = subjects.title || '';
            this.title = subjects.noOfQuestions;

        }
    }
}

export class Topic {
    title: string;
    id: number;

    noOfQuestions: number;
    constructor(topic) {
        {
            this.id = topic.id; //|| UnisunUtils.generateGUID();
            this.title = topic.title || '';
            this.title = topic.noOfQuestions;

        }
    }
}