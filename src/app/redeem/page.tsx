export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { verifyToken } from '@/lib/token'
import { getCard, redeemCard } from '@/lib/giftcardStore'

type PageProps = {
  searchParams?: { [key: string]: string | string[] | undefined }
}

export default function RedeemPage({ searchParams }: PageProps) {
  const tokenParam =
    typeof searchParams?.token === 'string' ? searchParams.token : undefined
  const codeParam =
    typeof searchParams?.code === 'string'
      ? searchParams.code.toUpperCase()
      : undefined
  let content: React.ReactNode

  if (tokenParam) {
    const v = verifyToken(tokenParam)
    if (!v.ok) {
      let msg = 'Invalid or expired token.'
      if (v.reason === 'expired') msg = 'This redeem link has expired.'
      content = <ErrorBox title='Cannot redeem' body={msg} />
    } else {
      const code = v.payload.c
      const existing = getCard(code)
      if (!existing) {
        content = (
          <ErrorBox title='Not found' body='Gift card does not exist.' />
        )
      } else {
        const res = redeemCard(code)
        if (!res.ok) {
          const msg =
            res.reason === 'already_redeemed'
              ? 'This gift card was already redeemed.'
              : 'Redeem failed.'
          content = <ErrorBox title='Cannot redeem' body={msg} />
        } else {
          content = (
            <SuccessBox
              title='Redeemed successfully'
              body='Your gift card balance is now 0.'
              code={res.card!.code}
            />
          )
        }
      }
    }
  } else if (codeParam) {
    // Demo fallback: allow direct code redemption when token is unavailable
    const existing = getCard(codeParam)
    if (!existing) {
      content = <ErrorBox title='Not found' body='Gift card does not exist.' />
    } else {
      const res = redeemCard(codeParam)
      if (!res.ok) {
        const msg =
          res.reason === 'already_redeemed'
            ? 'This gift card was already redeemed.'
            : 'Redeem failed.'
        content = <ErrorBox title='Cannot redeem' body={msg} />
      } else {
        content = (
          <SuccessBox
            title='Redeemed successfully'
            body='Your gift card balance is now 0.'
            code={res.card!.code}
          />
        )
      }
    }
  }

  return (
    <main className='min-h-screen flex flex-col items-center justify-center p-6 bg-[#EFEFEF] relative overflow-hidden'>
      <div className='relative z-10'>
        {content}
        <div className='mt-8 text-center'>
          <Link
            href='/giftcard'
            className='inline-flex items-center text-sm text-[#020664] hover:text-[#0055D6] transition-colors duration-300 font-medium'
          >
            <svg
              className='w-4 h-4 mr-2'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 19l-7-7 7-7'
              />
            </svg>
            View demo gift card
          </Link>
          <br />
          <Link
            href='/'
            className='inline-flex items-center text-sm text-[#020664] hover:text-[#0055D6] transition-colors duration-300 font-medium'
          >
            <svg
              className='w-4 h-4 mr-2'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 19l-7-7 7-7'
              />
            </svg>
            Go back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}

function ErrorBox({ title, body }: { title: string; body: string }) {
  return (
    <div className='relative rounded-3xl p-8 w-full max-w-md bg-gradient-to-br from-white via-white/95 to-white/90 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden'>
      {/* Background gradient effect */}
      <div className='absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-orange-500/10 rounded-3xl' />

      {/* Error icon background */}
      <div className='absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full blur-xl' />

      {/* Content */}
      <div className='relative z-10'>
        {/* Error icon */}
        <div className='mb-4 flex justify-center items-center'>
          <div className='w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg'>
            <svg
              className='w-6 h-6 text-white'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </div>
        </div>

        <h1 className='text-2xl font-bold mb-3 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent'>
          {title}
        </h1>

        <p className='text-sm text-gray-600 leading-relaxed'>{body}</p>
      </div>

      {/* Shimmer effect */}
      <div className='absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent' />
    </div>
  )
}

function SuccessBox({
  title,
  body,
  code,
}: {
  title: string
  body: string
  code: string
}) {
  return (
    <div className='relative rounded-3xl p-8 w-full max-w-md bg-gradient-to-br from-white via-white/95 to-white/90 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden'>
      {/* Success icon background */}
      <div className='absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-[#3EF2D0]/20 to-[#0055D6]/20 rounded-full blur-xl' />

      {/* Content */}
      <div className='relative z-10'>
        {/* Success icon */}
        <div className='mb-4 flex justify-center items-center'>
          <div className='w-12 h-12 bg-gradient-to-br from-[#3EF2D0] to-[#0055D6] rounded-full flex items-center justify-center shadow-lg'>
            <svg
              className='w-6 h-6 text-white'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M5 13l4 4L19 7'
              />
            </svg>
          </div>
        </div>

        <h1 className='text-2xl font-bold mb-3 bg-gradient-to-r from-[#020664] to-[#0055D6] bg-clip-text text-transparent'>
          {title}
        </h1>

        <p className='text-sm text-gray-600 mb-6 leading-relaxed'>{body}</p>

        {/* Code section */}
        <div className='bg-gradient-to-r from-[#020664]/5 to-[#0055D6]/5 rounded-xl p-4 border border-[#0055D6]/10'>
          <div className='text-xs font-medium text-[#020664]/70 mb-1'>
            Gift Card Code
          </div>
          <div className='font-mono text-lg font-bold bg-gradient-to-r from-[#020664] to-[#0055D6] bg-clip-text text-transparent tracking-wider'>
            {mask(code)}
          </div>
        </div>
      </div>
    </div>
  )
}

function mask(code: string) {
  // Hide middle characters: keep last 4 visible, preserve hyphens
  return code.replace(/.(?=.{4})/g, (ch) => (/[-\s]/.test(ch) ? ch : '*'))
}
