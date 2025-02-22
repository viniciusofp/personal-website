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
        <div className="flex flex-row justify-center gap-4 items-center text-xl font-medium">
          <div className="size-10 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background relative overflow-hidden border-[1.5px] border-blue-700">
            <img
              src="https://media.licdn.com/dms/image/v2/D4D03AQFHN9hXOTem5Q/profile-displayphoto-shrink_800_800/B4DZTS0apXG4Ag-/0/1738703744215?e=1744848000&v=beta&t=iqqgf7xgEFJ2nmcBDGokyGb97OjEGbRrkgqwx4jALdQ"
              alt=""
              className="w-full h-full object-cover object-center"
            />
          </div>
          +
          <SparklesIcon className="w-10 h-10 stroke-1 fill-red-400 text-red-700" />
          <span>+</span>
          <MessageCircleIcon className="w-10 h-10 stroke-1 fill-lime-400 text-lime-700" />
        </div>
        <h1 className="~text-2xl/5xl font-black">Oi, como posso ajudar?</h1>
        <div>
          <p className="text-slate-600 mb-2">
            Sou <b>Vinícius Pereira</b>,{' '}
            <em>
              desenvolvedor full-stack formado em jornalismo e com experiência
              nas áreas de design e vídeo
            </em>
            . Você pode saber mais sobre minha formação e experiência
            profissional no{' '}
            <a
              href={
                'https://www.linkedin.com/in/vin%C3%ADcius-pereira-80528a82/'
              }
              target="_blank"
              className="text-blue-500"
            >
              Linkedin{' '}
              <ArrowUpRight className="w-3 h-3 inline relative -top-1" />
            </a>
            .
          </p>
          <p className="text-slate-600 mb-2">
            Este é o meu portfolio — que desenvolvi em forma de chatbot para
            estudar inteligência artificial — para que quem tenha interesse em
            trabalhar comigo possa me encontrar, ver meu trabalho e tirar
            dúvidas.
          </p>
        </div>
        <div className="h-0.5 w-24 bg-stone-300 mx-auto rounded-sm"></div>
      </div>
    </motion.div>
  );
};
