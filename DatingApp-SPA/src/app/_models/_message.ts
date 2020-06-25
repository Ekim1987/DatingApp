export interface Message {
    id: number;
    senderId: number;
    senderKnownAs: string;
    senderPhotoUrl: string;
    recipentId: number;
    recipientKnownAs: string;
    recipientPhotoUrl: string;
    content: string;
    isRead: boolean;
    dateRead: Date;
    messageSent: Date;
}