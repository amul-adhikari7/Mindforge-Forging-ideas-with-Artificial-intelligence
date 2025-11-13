import React from 'react'

const NewsLetter = () => {
  return (
    <section className='container-centered py-12'>
      <div className='mx-auto w-full max-w-4xl rounded-2xl overflow-hidden shadow-md'>
        <div className='grid grid-cols-1 md:grid-cols-2 items-center gap-6 bg-gradient-to-r from-indigo-50 via-white to-rose-50 p-8 md:p-12 rounded-2xl'>
          {/* Left: content */}
          <div className='text-center md:text-left'>
            <div className='inline-flex items-center gap-3 mb-3'>
              <span className='px-3 py-1 rounded-full text-sm font-medium bg-white/60 shadow-sm'>
                For Two
              </span>
              <span className='text-sm muted'>Curated · Gentle · Real</span>
            </div>
            <h2 className='text-2xl md:text-3xl font-semibold leading-tight'>
              Stories & Rituals to Deepen Your Bond
            </h2>
            <p className='mt-3 text-gray-600 max-w-lg'>
              A tiny newsletter for couples who love the quiet, meaningful
              moments. Expect one thoughtful note each week — date prompts,
              conversation starters, and real stories from other pairs learning
              to grow together.
            </p>
            <ul className='mt-4 space-y-2 text-sm text-gray-600'>
              <li className='flex items-start gap-2'>
                <span className='text-indigo-500'>•</span> Handpicked date ideas
              </li>
              <li className='flex items-start gap-2'>
                <span className='text-indigo-500'>•</span> Short communication
                prompts
              </li>
              <li className='flex items-start gap-2'>
                <span className='text-indigo-500'>•</span> Honest stories &
                curated reads
              </li>
            </ul>
            <p className='mt-4 text-xs text-gray-400'>
              No spam. Unsubscribe anytime — we keep your email safe.
            </p>
          </div>

          {/* Right: form */}
          <div>
            <form
              className='w-full flex flex-col items-stretch gap-3'
              onSubmit={e => e.preventDefault()}
            >
              <label htmlFor='newsletter-email' className='sr-only'>
                Email address
              </label>
              <div className='flex rounded-md overflow-hidden border border-gray-200 bg-white'>
                <input
                  id='newsletter-email'
                  type='email'
                  required
                  placeholder='you@partner.com'
                  className='flex-1 px-4 py-3 outline-none text-gray-700'
                  aria-label='Email address'
                />
                <button
                  type='submit'
                  className='btn-primary flex items-center gap-2 px-6 hover:shadow-lg'
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

              <div className='flex items-center gap-3 mt-1'>
                <input
                  id='agree'
                  type='checkbox'
                  className='w-4 h-4'
                  defaultChecked
                />
                <label htmlFor='agree' className='text-xs text-gray-500'>
                  I agree to receive occasional emails. Privacy respected.
                </label>
              </div>
            </form>

            <div className='mt-4 text-xs text-gray-400'>
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
