export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  createdAt: number;
  groupId: string;
  lastReviewed?: number;
  mastered?: boolean;
}

export interface FlashcardGroup {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
} 