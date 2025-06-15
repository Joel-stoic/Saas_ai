import CompanionCard from '@/components/CompanionCard'
import CompanionsList from '@/components/CompanionsList'
import Cta from '@/components/CTA'
import { recentSessions } from '@/constants'
import React from 'react'

const Page = () => {
  return (
    <main>
      <h1>Popular Companions</h1>
      <section className='home-section'>
        <CompanionCard id='123' subject='Science' name='Neura the Brainry Explorer' topic='Neural Network of the Brain' duration={45} color='#ffda6e'/> 
        <CompanionCard id='456' subject='Math' name='Countsy the Number Wizard' topic=': Derivatives & Integrals' duration={36} color='#e5d0ff'/>
        <CompanionCard id='789' subject='Language' name='Verba the Vocabulary Builder' topic=' English Literature ' duration={30} color='#BDE7FF'/>
        
      </section>
      <section className='home-section'>
        <CompanionsList
          title="Recently Completed Sessions"
          companions={recentSessions}
          className='w-2/3 max-lg:w-full'
        />
        <Cta/>
      </section>
    </main>
  )
}

export default Page