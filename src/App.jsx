import { useState } from 'react'
import { detectarTipoDeTarjeta } from '../utils/cardLogic';

import Amex from './assets/Amex.webp'
import Visa from './assets/Visa.webp'
import Mastercard from './assets/mastercard.webp'
import ErrorImg from './assets/Error.webp'
import ReloadIcon from './assets/sync.webp'
import Logo from './assets/logo.png'

import { motion, AnimatePresence } from 'framer-motion'
import InfoTooltip from './components/InfoTooltip';


function App() {
  const [card, setCard] = useState('')
  const [response, setresponse] = useState('')
  const [image, setImage] = useState(undefined)

  const check = () => {
    if (card === '') return
    const tipo = detectarTipoDeTarjeta(card);
    setresponse(tipo);

    switch (tipo) {
      case 'Visa':
        setImage(Visa)
        break
      case 'Mastercard':
        setImage(Mastercard)
        break
      case 'Amex':
        setImage(Amex)
        break
      default:
        setImage(ErrorImg)
        break
    }

  }

  const onChangeInput = (e) => {
    const value = e.target.value.replace(/\s+/g, '');

    if (/^\d*$/.test(value)) {
      setCard(value);
    }
  };

  const restart = () => {
    setCard('');
    setresponse('');
  }

  return (
    <main className='flex flex-col justify-baseline mt-5 sm:justify-center items-center h-dvh gap-6 px-6 sm:px-0'>

      <article className='flex flex-col sm:flex-row items-center gap-5 mb-6'>
        <img src={Logo} alt="App Logo" className='pt-1 pb-0 pl-1 pr-1 bg-[#0091AD] rounded-full w-[5.5rem] h-auto shadow-md' />
        <h1 className='text-5xl text-black text-center font-bold '>Detector de tarjetas</h1>
      </article>

      <div className='flex gap-5 items-center'>
        <motion.input
          type="text"
          inputMode="numeric"
          name='inputTarjeta'
          value={card}
          maxLength={16}
          onChange={onChangeInput}
          placeholder="Ingresa número de tarjeta"
          className="p-4 text-xl rounded shadow-md outline-none w-70 sm:w-80"
          whileFocus={{ scale: 1.03 }}
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        />

        <InfoTooltip />

      </div>

      <div className="flex justify-center items-center gap-3 w-80 my-6">
        <AnimatePresence>
          {response && (
            <motion.div
              className="flex items-center gap-5"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <img
                src={image}
                alt="Imagen del logo de la tarjeta"
                className="h-[60px]"
              />
              <span className="text-center text-xl">
                {response === 'Error'
                  ? 'El número de la tarjeta es inválido'
                  : response}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <section className='flex items-center gap-4'>
        <motion.button
          role="button"
          onClick={check}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.97, y: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          className="px-6 py-3 sm:px-4 sm:py-2 text-xl font-bold  rounded shadow-md outline-none bg-[#06BA63] hover:bg-[#059E54] active:bg-[#059E54]"
        >
          Validar
        </motion.button>

        <motion.button
          onClick={restart}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.97, y: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          className="p-3 sm:p-2 rounded shadow-md hover:bg-red-200 active:bg-red-200"
        >
          <img src={ReloadIcon} alt="Recargar" className="h-[1.9rem]" />
        </motion.button>
      </section>

      <footer className='absolute bottom-5 opacity-90'>
        Made with ❤️ by Alan Ruanova & Jennifer Álvarez.
      </footer>
    </main>


  )
}

export default App