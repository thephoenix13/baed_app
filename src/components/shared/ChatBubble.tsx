interface ChatBubbleProps {
  text: string;
  timestamp: Date;
  isSent: boolean;
}

export function ChatBubble({ text, timestamp, isSent }: ChatBubbleProps) {
  return (
    <div className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
      <div className={`chat-bubble ${isSent ? 'chat-bubble-sent' : 'chat-bubble-received'}`}>
        <p className="text-message">{text}</p>
        <p className={isSent ? 'text-message-time-inverse' : 'text-message-time'}>
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}
