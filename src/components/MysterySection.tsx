
import { useState } from 'react';
import { ChevronRight, HelpCircle, Clock } from 'lucide-react';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  highlighted: boolean;
}

export default function MysterySection() {
  const [activeEvent, setActiveEvent] = useState<number | null>(null);
  
  const events: TimelineEvent[] = [
    {
      year: '1928',
      title: 'Dirac\'s Prediction',
      description: 'Paul Dirac\'s equation predicts the existence of antimatter particles.',
      highlighted: true
    },
    {
      year: '1932',
      title: 'Discovery of the Positron',
      description: 'Carl Anderson discovers the positron, confirming Dirac\'s prediction.',
      highlighted: true
    },
    {
      year: '1955',
      title: 'First Antiproton',
      description: 'The first antiproton is produced at the Berkeley Bevatron.',
      highlighted: false
    },
    {
      year: '1995',
      title: 'First Antihydrogen Atoms',
      description: 'CERN creates the first antihydrogen atoms from antiprotons and positrons.',
      highlighted: true
    },
    {
      year: '2010',
      title: 'Trapped Antihydrogen',
      description: 'Scientists at CERN trap antihydrogen atoms for extended study.',
      highlighted: false
    },
    {
      year: '2018',
      title: 'Antimatter Spectroscopy',
      description: 'Researchers measure the antihydrogen spectrum with high precision.',
      highlighted: false
    },
    {
      year: 'Today',
      title: 'The Unsolved Mystery',
      description: 'Why is there so little antimatter in our universe?',
      highlighted: true
    }
  ];

  return (
    <section id="mystery" className="section bg-gradient-to-r from-antimatter-blue/20 to-antimatter-red/20">
      <div className="container mx-auto flex flex-col h-full">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-center">
          The <span className="text-antimatter-yellow">Mystery</span> of Antimatter
        </h2>
        
        <p className="text-center max-w-3xl mx-auto mb-12 text-lg text-antimatter-textDim">
          One of the biggest unsolved puzzles in physics is why our universe contains almost no antimatter,
          despite equal amounts of matter and antimatter being created in the Big Bang.
        </p>
        
        {/* Timeline */}
        <div className="relative py-8">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-1 bg-antimatter-yellow bg-opacity-30"></div>
          
          {/* Timeline events */}
          {events.map((event, index) => (
            <div 
              key={index}
              className={`relative flex flex-col md:flex-row md:justify-between items-start mb-12 ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Date marker */}
              <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-antimatter-yellow flex items-center justify-center z-10">
                <div className={`w-3 h-3 rounded-full ${event.highlighted ? 'animate-pulse bg-white' : 'bg-antimatter-bg'}`}></div>
              </div>
              
              {/* Year */}
              <div className={`ml-10 md:ml-0 md:w-5/12 ${index % 2 === 1 ? 'md:text-right' : ''}`}>
                <div className="inline-block font-space bg-antimatter-yellow text-antimatter-bg px-3 py-1 rounded-md mb-2">
                  {event.year}
                </div>
              </div>
              
              {/* Content */}
              <div className={`ml-10 md:ml-0 md:w-5/12 p-4 ${
                activeEvent === index 
                  ? 'bg-black bg-opacity-50 rounded-md shadow-lg' 
                  : 'bg-transparent'
              }`}>
                <h3 className="text-xl font-bold mb-2 flex items-center">
                  {event.title}
                  {event.highlighted && (
                    <span className="ml-2 text-antimatter-yellow">
                      <HelpCircle size={18} />
                    </span>
                  )}
                </h3>
                
                <p className={`text-antimatter-textDim ${activeEvent !== index ? 'line-clamp-2' : ''}`}>
                  {event.description}
                </p>
                
                {activeEvent !== index && (
                  <button 
                    className="text-antimatter-yellow text-sm mt-2 flex items-center hover:underline"
                    onClick={() => setActiveEvent(index)}
                  >
                    Read more <ChevronRight size={16} />
                  </button>
                )}
                
                {activeEvent === index && (
                  <button 
                    className="text-antimatter-yellow text-sm mt-4 flex items-center hover:underline"
                    onClick={() => setActiveEvent(null)}
                  >
                    Show less <ChevronRight className="transform rotate-90" size={16} />
                  </button>
                )}
              </div>
              
              {/* Timeline connector */}
              {index < events.length - 1 && (
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-12 w-px bg-antimatter-yellow bg-opacity-30 top-full"></div>
              )}
            </div>
          ))}
        </div>
        
        {/* Mystery callout */}
        <div className="mt-12 bg-black bg-opacity-50 p-8 rounded-xl max-w-4xl mx-auto text-center">
          <div className="inline-block bg-antimatter-yellow p-4 rounded-full mb-6">
            <Clock className="w-10 h-10 text-antimatter-bg" />
          </div>
          
          <h3 className="text-2xl font-bold mb-4">The Antimatter Asymmetry Problem</h3>
          
          <p className="text-lg text-antimatter-textDim mb-6">
            According to our best theories, the Big Bang should have created equal amounts of matter and antimatter.
            Yet today, our universe appears to be made almost entirely of matter. 
            Where did all the antimatter go? This fundamental puzzle remains one of the greatest unsolved mysteries in physics.
          </p>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-6">
            <div className="text-center text-antimatter-blue">
              <div className="text-4xl font-bold">50%</div>
              <div className="text-sm uppercase">Expected Matter</div>
            </div>
            
            <div className="text-center text-antimatter-red">
              <div className="text-4xl font-bold">50%</div>
              <div className="text-sm uppercase">Expected Antimatter</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold">VS</div>
            </div>
            
            <div className="text-center text-antimatter-blue">
              <div className="text-4xl font-bold">~100%</div>
              <div className="text-sm uppercase">Actual Matter</div>
            </div>
            
            <div className="text-center text-antimatter-red">
              <div className="text-4xl font-bold">~0%</div>
              <div className="text-sm uppercase">Actual Antimatter</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
