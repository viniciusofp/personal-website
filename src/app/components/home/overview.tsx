import { ArrowUpRight, MessageCircleIcon, SparklesIcon } from 'lucide-react';
import CustomMarkdown from '../CustomMarkdown';
import { motion } from 'motion/react';

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="rounded-xl p-6 flex flex-col gap-2 md:gap-5 lg:gap-8 leading-relaxed text-center max-w-xl">
        <div>
          <h1 className="text-3xl md:text-4xl xl:text-5xl font-bold mb-4 bg-gradient-to-br from-yellow-600 to-red-600 bg-clip-text text-transparent py-1">
            Oi, como posso ajudar?
          </h1>
          <p className="text-slate-600 text-lg md:text-xl mb-5">
            Sou <b>Vinícius Pereira</b>,{' '}
            <em>
              desenvolvedor full-stack formado em jornalismo e com experiência
              nas áreas de design e vídeo
            </em>
            .
          </p>
          <p className="text-slate-600 text-sm">
            Este é o meu portfolio — que desenvolvi em forma de chatbot para
            estudar inteligência artificial — para que quem tenha interesse em
            trabalhar comigo possa me encontrar, ver meu trabalho e tirar
            dúvidas.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// Você pode saber mais sobre minha formação e experiência
//             profissional no{' '}
//             <a
//               href={
//                 'https://www.linkedin.com/in/vin%C3%ADcius-pereira-80528a82/'
//               }
//               target="_blank"
//               className="text-blue-500"
//             >
//               Linkedin{' '}
//               <ArrowUpRight className="w-3 h-3 inline relative -top-1" />
//             </a>
//             .
//           </p>
//           <p className="text-slate-600 mb-2"></p>
