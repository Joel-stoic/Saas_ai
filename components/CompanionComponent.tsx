'use client'

import { cn, getSubjectColor, configureAssistant } from '@/lib/utils';
import { vapi } from '@/lib/vapi.sdk';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import soundwaves from "../constants/soundwaves.json";
import { addToSessionHistory } from '@/lib/actions/companion.action';

enum CallStatus {
  INACTIVE = 'INACTIVE',
  RINGING = 'RINGING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
  CONNECTING = 'CONNECTING'
}

const CompanionComponent = ({
  companionId,
  name,
  subject,
  topic,
  userName,
  userImage,
  style,
  voice
}: CompanionComponentProps) => {
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessage] = useState<SavedMessage[]>([]);

  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    if (lottieRef.current) {
      isSpeaking ? lottieRef.current.play() : lottieRef.current.stop();
    }
  }, [isSpeaking]);

  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () =>{
        setCallStatus(CallStatus.FINISHED);
        addToSessionHistory(companionId)
       };
    const onMessage = (message: Message) => {
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        const newMessage = { role: message.role, content: message.transcript };
        setMessage((prev) => [newMessage, ...(prev ?? [])]);
      }
    };
    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onError = (error: Error) => console.error('Vapi error:', error);

    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('message', onMessage);
    vapi.on('error', onError);
    vapi.on('speech-start', onSpeechStart);
    vapi.on('speech-end', onSpeechEnd);

    return () => {
      vapi.off('call-start', onCallStart);
      vapi.off('call-end', onCallEnd);
      vapi.off('message', onMessage);
      vapi.off('error', onError);
      vapi.off('speech-start', onSpeechStart);
      vapi.off('speech-end', onSpeechEnd);
    };
  }, []);

  const toggleMicrophone = () => {
    const muted = vapi.isMuted();
    vapi.setMuted(!muted);
    setIsMuted(!muted);
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    const assistantOverrides = {
      variableValues: {
        subject,
        topic,
        style
      },
      clientMessages: ['transcript'],
      serverMessages: []
    };

    try {
      const config = configureAssistant(voice, style);
      console.log("Configured Assistant:", config);
      console.log("Overrides:", assistantOverrides);

      // @ts-expect-error - Vapi might not support dynamic assistant creation
      await vapi.start(config, assistantOverrides);
    } catch (err) {
      console.error('Call start failed:', err);
      setCallStatus(CallStatus.FINISHED);
    }
  };

  const assistantDisplayName = name.replace(/[.,]/g, '').split(' ')[0];

  return (
    <section className='flex flex-col h-[70vh]'>
      <section className='flex gap-8 max-sm:flex-col'>
        <div className="companion-section">
          <div className="companion-avatar" style={{ backgroundColor: getSubjectColor(subject) }}>
            <div className={cn(
              'absolute transition-opacity duration-1000',
              callStatus === CallStatus.FINISHED || callStatus === CallStatus.INACTIVE ? 'opacity-100' : 'opacity-0',
              callStatus === CallStatus.CONNECTING && 'opacity-100 animate-pulse'
            )}>
              <Image src={`/icons/${subject}.svg`} alt={subject} width={150} height={150} className='max-sm:w-fit' />
            </div>
            <div className={cn('absolute transition-opacity duration-1000', callStatus === CallStatus.ACTIVE ? 'opacity-100' : 'opacity-0')}>
              <Lottie
                lottieRef={lottieRef}
                animationData={soundwaves}
                autoPlay={false}
                className='companion-lottie'
              />
            </div>
          </div>
          <p className='font-bold text-2xl'>{name}</p>
        </div>

        <div className="user-section">
          <div className="user-avatar">
            <Image src={userImage} alt={userName} width={130} height={130} className='rounded-lg' />
            <p className='font-bold text-2xl'>{userName}</p>
          </div>

          <button className='btn-mic' onClick={toggleMicrophone}>
            <Image src={isMuted ? '/icons/mic-off.svg' : '/icons/mic-on.svg'} alt='mic' width={36} height={36} />
            <p
              className={cn(
                'max-sm:hidden',
                callStatus !== CallStatus.ACTIVE && 'opacity-50 cursor-not-allowed'
              )}
            >
              {isMuted ? 'Turn on microphone' : 'Turn off microphone'}
            </p>
          </button>

          <button
            className={cn(
              'rounded-lg py-2 cursor-pointer transition-colors w-full text-white',
              callStatus === CallStatus.ACTIVE ? 'bg-red-700' : 'bg-primary',
              callStatus === CallStatus.CONNECTING && 'animate-pulse'
            )}
            onClick={callStatus === CallStatus.ACTIVE ? handleDisconnect : handleCall}
          >
            {callStatus === CallStatus.ACTIVE ? "End Session" : callStatus === CallStatus.CONNECTING ? "Connecting" : "Start Session"}
          </button>
        </div>
      </section>

      <section className='transcript'>
        <div className="transcript-message no-scrollbar">
          {messages?.map((message,index) => (
            <p
              key={message.content}
              className={cn('max-sm:text-sm', message.role === 'assistant' ? '' : 'text-primary')}
            >
              {message.role === 'assistant'
                ? `${assistantDisplayName}: ${message.content}`
                : `${userName}: ${message.content}`}
            </p>
          ))}
        </div>
        <div className='transcript-fade' />
      </section>
    </section>
  );
};

export default CompanionComponent;


//3:18:30