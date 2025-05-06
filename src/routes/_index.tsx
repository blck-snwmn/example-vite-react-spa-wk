import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import cloudflareLogo from '../assets/Cloudflare_Logo.svg'

export const Route = createFileRoute('/_index')({
  component: HomePage,
})

function HomePage() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('unknown')

  return (
    <div>
      <div className="flex justify-center">
        <a href='https://vite.dev' target='_blank' className="block font-medium text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300">
          <img src={viteLogo} className='h-24 p-6 transition-[filter] duration-300 hover:drop-shadow-[0_0_0.5em_#646cffaa]' alt='Vite logo' />
        </a>
        <a href='https://react.dev' target='_blank' className="block [&:nth-of-type(2)>img]:animate-[spin_20s_linear_infinite] font-medium text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300">
          <img src={reactLogo} className='h-24 p-6 transition-[filter] duration-300 hover:drop-shadow-[0_0_0.5em_#61dafbaa]' alt='React logo' />
        </a>
        <a href='https://workers.cloudflare.com/' target='_blank' className="block font-medium text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300">
          <img src={cloudflareLogo} className='h-24 p-6 transition-[filter] duration-300 hover:drop-shadow-[0_0_0.5em_#f6821faa]' alt='Cloudflare logo' />
        </a>
      </div>
      <h1 className="text-5xl leading-tight my-4">Vite + React + Cloudflare</h1>
      <div className='p-8'>
        <button
          className="rounded-lg border border-transparent px-5 py-2.5 text-base font-medium bg-gray-200 dark:bg-gray-700 cursor-pointer transition-colors hover:border-indigo-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/50"
          onClick={() => setCount((count) => count + 1)}
          aria-label='increment'
        >
          count is {count}
        </button>
        <p className="mt-4">
          Edit <code>src/routes/_index.tsx</code> and save to test HMR
        </p>
      </div>
      <div className='p-8'>
        <button
          className="rounded-lg border border-transparent px-5 py-2.5 text-base font-medium bg-gray-200 dark:bg-gray-700 cursor-pointer transition-colors hover:border-indigo-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/50"
          onClick={() => {
            fetch('/api/')
              .then((res) => res.json() as Promise<{ name: string }>)
              .then((data) => setName(data.name))
          }}
          aria-label='get name'
        >
          Name from API is: {name}
        </button>
        <p className="mt-4">
          Edit <code>worker/index.ts</code> to change the name
        </p>
      </div>
      <p className='text-gray-500'>
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}
