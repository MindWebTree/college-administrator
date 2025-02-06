export class CreateQuestion {

    id: number;
    isActive: boolean;
    questionDetailId: number;
    questionType: number;
    levelIdOfQuestion: number;
    levelId: number;
    audioId: number;
    cbmeId: number;
    chapterId: number;
    queueId: number;
    questionTitle: string;
    // explanation: string;
    notes: string;
    typeOfQuestion: string;
    levelOfKnowledge: string;
    horizontalIntegration: Array<any>;
    verticalIntegration: Array<any>;
    tags: Array<any>;
    videos: Array<any>;
    choices: Array<Choices>;
    explanations: Array<Explanations>;
    books: Array<Books>;
    qBankCategoryId: number;
}
export class Choices {

    choiceId: Number;
    choiceText: string;
    isCorrect: boolean;
    questionDetailId: Number

    constructor(choiceId: Number, choiceText: string, isCorrect: boolean, questionDetailId: Number) {
        this.choiceId = choiceId;
        this.choiceText = choiceText;
        this.isCorrect = isCorrect;
        this.questionDetailId = questionDetailId;
    }
}
export class Explanations {
    Content: string;
    ExplanationID: number;
    QueueID: number;
    constructor(explanations) {
        this.Content = explanations.Content;
        this.ExplanationID = explanations.ExplanationID;
    }

}
export class Books {
    id: number;
    edition: string;
    pageNumber: number;
    bookTitle: string;

    constructor(books) {
        this.id = books.id;
        this.edition = books.edition;
        this.pageNumber = books.pageNumber;
        this.bookTitle = books.bookTitle;


    }
}