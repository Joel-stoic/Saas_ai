'use client'

import { cn, getSubjectColor } from '@/lib/utils'
import { vapi } from '@/lib/vapi.sdk';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

enum CallStatus {
  INACTIVE = 'INACTIVE',
  RINGING = 'RINGING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
  CONNECTING = 'CONNECTING'
}


const CompanionComponent = ({companionId,name,subject,topic,userName,userImage,style,voice}:CompanionComponentProps) => {
const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
const [isSpeaking,setIsSpeaking]=useState(false)
useEffect(()=>{
  const onCallStart=()=> setCallStatus(CallStatus.ACTIVE);

  const onCallEnd=()=> setCallStatus(CallStatus.FINISHED)

  const onMessage=()=>{}

  const onSpeechStart=()=> setIsSpeaking(true)
  const onSpeechEnd=()=> setIsSpeaking(false)
  
  const onError=(error:Error)=> console.log('Error',error)

  vapi.on('call-start',onCallStart)
  vapi.on('call-end',onCallEnd)
  vapi.on('message',onMessage)
  vapi.on('error',onError)
  vapi.on('speech-start',onSpeechStart)
  vapi.on('speech-end',onSpeechEnd)

  return ()=>{
    vapi.off('call-start',onCallStart)
    vapi.off('call-end',onCallEnd)
    vapi.off('message',onMessage)
    vapi.off('error',onError)
    vapi.off('speech-start',onSpeechStart)
    vapi.off('speech-end',onSpeechEnd)
  }
},[])
  return (
    <section className='flex flex-col h-[70vh]'>
        <section className='flex gap-8 max-sm:flex-col'>
            <div className="companion-section">
                <div className="companion-avatar" style={{backgroundColor:getSubjectColor(subject)}}>
                    <div className={cn('absolute transition-opacity duration-1000',callStatus === CallStatus.FINISHED || callStatus === CallStatus.INACTIVE ? 'opacity-1001':'opacity-0',callStatus === CallStatus.CONNECTING && 'opacity-100 animate-pulse')}>
                      <Image src={`/icons/${subject}.svg`} alt={subject} width={150} height={150} className='max-sm:w-fit'/>
                    </div>
                    <div className={cn('absolute transition-opacity duration-1000',callStatus === CallStatus.ACTIVE ? 'opacity-100':'opacity-0')}></div>
                </div>
            </div>
        </section>
    </section>
  )
}

export default CompanionComponent


// timing 2:49:10