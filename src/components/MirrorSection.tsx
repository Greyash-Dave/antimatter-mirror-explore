
import { useState } from 'react';
import { ArrowLeftRight, PlusCircle, MinusCircle } from 'lucide-react';

interface MirrorPair {
  matter: {
    name: string;
    description: string;
    charge: string;
  };
  antimatter: {
    name: string;
    description: string;
    charge: string;
  };
}

export default function MirrorSection() {
  const [activePair, setActivePair] = useState(0);
  
  const mirrorPairs: MirrorPair[] = [
    {
      matter: {
        name: "Electron",
        description: "Negatively charged elementary particle",
        charge: "-1"
      },
      antimatter: {
        name: "Positron",
        description: "Antimatter counterpart of the electron",
        charge: "+1"
      }
    },
    {
      matter: {
        name: "Proton",
        description: "Positively charged subatomic particle",
        charge: "+1"
      },
      antimatter: {
        name: "Antiproton",
        description: "Antimatter counterpart of the proton",
        charge: "-1"
      }
    },
    {
      matter: {
        name: "Neutron",
        description: "Subatomic particle with no electric charge",
        charge: "0"
      },
      antimatter: {
        name: "Antineutron",
        description: "Antimatter counterpart of the neutron",
        charge: "0"
      }
    }
  ];
  
  const nextPair = () => {
    setActivePair((prev) => (prev + 1) % mirrorPairs.length);
  };
  
  const prevPair = () => {
    setActivePair((prev) => (prev - 1 + mirrorPairs.length) % mirrorPairs.length);
  };

  return (
    <section id="mirror" className="section bg-gradient-to-b from-antimatter-bg to-antimatter-bg/70">
      <div className="container mx-auto flex flex-col h-full">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-center">
          The Mirror <span className="text-antimatter-yellow">World</span>
        </h2>
        
        <p className="text-center max-w-3xl mx-auto mb-12 text-lg text-antimatter-textDim">
          For every particle of matter, antimatter presents its perfect opposite reflection - 
          identical in many ways, but with key properties reversed.
        </p>
        
        <div className="split-screen flex-1 flex flex-col lg:flex-row items-center justify-center gap-8">
          {/* Matter side */}
          <div className="split-left bg-antimatter-blue bg-opacity-30 rounded-lg p-8 flex-1 h-full flex flex-col">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Matter</h3>
              <div className="h-1 w-16 bg-antimatter-blue mx-auto"></div>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-antimatter-blue flex items-center justify-center mb-6 glowing">
                <PlusCircle className="text-antimatter-text" size={mirrorPairs[activePair].matter.charge === "+1" ? 64 : 32} />
                {mirrorPairs[activePair].matter.charge === "-1" && (
                  <MinusCircle className="text-antimatter-text" size={64} />
                )}
              </div>
              
              <h4 className="text-xl font-bold mb-2">{mirrorPairs[activePair].matter.name}</h4>
              <p className="text-center text-antimatter-textDim">
                {mirrorPairs[activePair].matter.description}
              </p>
              <p className="mt-4 font-space text-lg">
                Charge: {mirrorPairs[activePair].matter.charge}
              </p>
            </div>
          </div>
          
          {/* Middle arrow */}
          <div className="flex items-center justify-center p-4">
            <ArrowLeftRight size={32} className="text-antimatter-yellow" />
          </div>
          
          {/* Antimatter side */}
          <div className="split-right bg-antimatter-red bg-opacity-30 rounded-lg p-8 flex-1 h-full flex flex-col">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Antimatter</h3>
              <div className="h-1 w-16 bg-antimatter-red mx-auto"></div>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-antimatter-red flex items-center justify-center mb-6 glowing">
                <MinusCircle className="text-antimatter-text" size={mirrorPairs[activePair].antimatter.charge === "-1" ? 64 : 32} />
                {mirrorPairs[activePair].antimatter.charge === "+1" && (
                  <PlusCircle className="text-antimatter-text" size={64} />
                )}
              </div>
              
              <h4 className="text-xl font-bold mb-2">{mirrorPairs[activePair].antimatter.name}</h4>
              <p className="text-center text-antimatter-textDim">
                {mirrorPairs[activePair].antimatter.description}
              </p>
              <p className="mt-4 font-space text-lg">
                Charge: {mirrorPairs[activePair].antimatter.charge}
              </p>
            </div>
          </div>
        </div>
        
        {/* Navigation controls */}
        <div className="flex justify-center gap-4 mt-12">
          <button 
            onClick={prevPair} 
            className="px-4 py-2 bg-antimatter-gray bg-opacity-50 rounded-md hover:bg-opacity-70 transition-colors"
          >
            Previous Pair
          </button>
          <button 
            onClick={nextPair} 
            className="px-4 py-2 bg-antimatter-yellow text-antimatter-bg rounded-md hover:bg-opacity-90 transition-colors"
          >
            Next Pair
          </button>
        </div>
      </div>
    </section>
  );
}
