import React from 'react'

const NewsLetter = () => {
  return (
    <section className='w-full px-4 md:px-6 py-12'>
      <div className='mx-auto w-full max-w-4xl rounded-2xl overflow-hidden shadow-md'>
        <div className='grid grid-cols-1 md:grid-cols-2 items-center gap-6 bg-gradient-to-r from-indigo-50 via-white to-rose-50 p-6 sm:p-8 md:p-12 rounded-2xl'>
          {/* Left: content */}
          <div className='text-center md:text-left'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-center md:justify-start gap-2 sm:gap-3 mb-3'>
              <span className='px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-gradient-to-r from-indigo-100 to-rose-100 shadow-sm text-indigo-700'>
                For Two
              </span>
              <span className='text-xs sm:text-sm muted'>
                Curated · Gentle · Real
              </span>
            </div>
            <h2 className='text-xl sm:text-2xl md:text-3xl font-semibold leading-tight'>
              Stories & Rituals to Deepen Your Bond
            </h2>
            <p className='mt-3 text-sm sm:text-base text-gray-600 max-w-lg'>
              A tiny newsletter for couples who love the quiet, meaningful
              moments. Expect one thoughtful note each week — date prompts,
              conversation starters, and real stories from other pairs learning
              to grow together.
            </p>
            <ul className='mt-4 space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600'>
              <li className='flex items-start gap-2'>
                <span className='text-indigo-500 flex-shrink-0 font-bold'>
                  ✓
                </span>{' '}
                <span>Handpicked date ideas</span>
              </li>
              <li className='flex items-start gap-2'>
                <span className='text-indigo-500 flex-shrink-0 font-bold'>
                  ✓
                </span>{' '}
                <span>Short communication prompts</span>
              </li>
              <li className='flex items-start gap-2'>
                <span className='text-indigo-500 flex-shrink-0 font-bold'>
                  ✓
                </span>{' '}
                <span>Honest stories & curated reads</span>
              </li>
            </ul>
            <p className='mt-4 text-xs text-gray-400'>
              No spam. Unsubscribe anytime — we keep your email safe.
            </p>
          </div>

          {/* Right: form */}
          <div>
            <form
              className='w-full flex flex-col items-stretch gap-4'
              onSubmit={e => e.preventDefault()}
            >
              <label htmlFor='newsletter-email' className='sr-only'>
                Email address
              </label>
              <div className='flex flex-col sm:flex-row rounded-lg overflow-hidden border border-gray-200 bg-white gap-0 shadow-sm'>
                <input
                  id='newsletter-email'
                  type='email'
                  required
                  placeholder='you@partner.com'
                  className='flex-1 px-4 py-3 sm:py-4 outline-none text-gray-700 text-sm focus:ring-2 focus:ring-indigo-500 focus:ring-inset transition-all'
                  aria-label='Email address'
                />
                <button
                  type='submit'
                  className='btn-primary flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 hover:shadow-lg hover:scale-105 transition-all whitespace-nowrap w-full sm:w-auto'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth='2'
                    stroke='currentColor'
                    className='text-white'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z'
                    />
                  </svg>
                  <span>Send</span>
                </button>
              </div>

              <div className='flex items-start sm:items-center gap-2 mt-1'>
                <input
                  id='agree'
                  type='checkbox'
                  className='w-4 h-4 mt-0.5 sm:mt-0 flex-shrink-0 accent-indigo-500 cursor-pointer'
                  defaultChecked
                />
                <label
                  htmlFor='agree'
                  className='text-xs sm:text-sm text-gray-500 cursor-pointer'
                >
                  I agree to receive occasional emails. Privacy respected.
                </label>
              </div>
            </form>

            <div className='mt-4 text-xs text-gray-400 text-center sm:text-left'>
              Featured in:{' '}
              <span className='font-medium text-gray-700'>Little Letters</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NewsLetter
