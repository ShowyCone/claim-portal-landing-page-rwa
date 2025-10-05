'use client'
import { motion } from 'framer-motion'
import { FaUserCircle } from 'react-icons/fa'

const TrustedUsersSection = () => {
  const testimonials = [
    {
      name: 'John Doe',
      username: '@johndoe',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, nisi eu consectetur cursus, nisl erat facilisis erat, nec dictum sem urna at sapien.',
    },
    {
      name: 'Sarah Johnson',
      username: '@sarahjohnson',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur id erat eu velit posuere commodo. Etiam euismod, urna eu tincidunt consectetur, nisi nisl aliquam enim, euismod cursus enim nisi euismod.',
    },
    {
      name: 'Mike Chen',
      username: '@mikechen',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse potenti. Proin ac neque nec enim cursus dictum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.',
    },
    {
      name: 'Emily Rodriguez',
      username: '@emilyrodriguez',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur id erat eu velit posuere commodo.',
    },
    {
      name: 'David Kim',
      username: '@davidkim',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, nisi eu consectetur cursus, nisl erat facilisis erat, nec dictum sem urna at sapien. Etiam euismod, urna eu tincidunt consectetur, nisi nisl aliquam enim, euismod cursus enim nisi euismod.',
    },
    {
      name: 'Lisa Thompson',
      username: '@lisathompson',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
  ]

  return (
    <section className='bg-white py-12'>
      <div className='max-w-7xl mx-auto px-8 md:px-16'>
        <motion.div
          className='text-center mb-12'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#0055D6] to-[#002C70] bg-clip-text text-transparent py-2'>
            Trusted by Early Users & Partners
          </h2>
        </motion.div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className='bg-white rounded-[20px] shadow-2xl hover:shadow-3xl transition-all p-6 hover:scale-[1.02] cursor-pointer border border-gray-200/40'
              style={{
                boxShadow:
                  '0 8px 32px 0 rgba(0, 85, 214, 0.10), 0 1.5px 8px 0 rgba(0,44,112,0.08)',
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className='flex items-center gap-4 mb-4'>
                <FaUserCircle
                  className='text-5xl'
                  style={{ color: '#0055D6' }}
                />
                <div className='flex flex-col'>
                  <h4 className='font-semibold text-gray-900'>
                    {testimonial.name}
                  </h4>
                  <p className='text-sm text-gray-500'>
                    {testimonial.username}
                  </p>
                </div>
              </div>
              <p className='text-sm md:text-base leading-relaxed text-gray-700 italic'>
                &quot;{testimonial.text}&quot;
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrustedUsersSection
