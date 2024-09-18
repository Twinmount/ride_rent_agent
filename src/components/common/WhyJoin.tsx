import MotionDiv from '@/components/framer-motion/MotionDiv'
import { MotionH2 } from '../framer-motion/MotionElm'

type WhyJoinProps = {
  data: {
    key: number
    title: string
    description: string
  }[]
}

export default function WhyJoin({ data }: WhyJoinProps) {
  return (
    <div className="h-auto mx-auto my-8 wrapper">
      <MotionH2
        initial={{ opacity: 0.1, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ type: 'tween', duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center font-[400] text-[1.4rem]"
      >
        Why join <span className="font-bold">Ride.Rent</span> Today?
      </MotionH2>
      <div className="flex flex-col items-center w-full mx-auto my-4 gap-y-4 md:w-4/5 lg:w-[65%]">
        {data.map((feature) => (
          <MotionDiv
            className="border-gray-500/20 shadow-lg p-2 rounded-[1rem] bg-white md:py-2 md:px-4  border-t border-t-gray-200"
            key={feature.key}
          >
            <h4 className="mb-2 font-semibold text-center">{feature.title}</h4>
            <p className="text-center text-[0.9rem] text-gray-700 w-full mx-auto md:w-11/12">
              {feature.description}
            </p>
          </MotionDiv>
        ))}
      </div>
    </div>
  )
}
