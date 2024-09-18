import MotionSection from '@/components/framer-motion/MotionSection'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

type FAQProps = {
  data: {
    question: string
    answer: string
  }[]
}

export default function FAQ({ data }: FAQProps) {
  return (
    <MotionSection className="pt-8 pb-12 bg-gray-100 wrapper rounded-2xl">
      <div className="relative mb-12">
        <h1 className="text-center mb-[1.7rem] font-bold">
          Frequently Asked Questions
        </h1>
        <img
          width={50}
          height={50}
          src={'/assets/img/general/title-head.png'}
          alt="underline"
          className="absolute w-16 h-auto transform -translate-x-1/2 -bottom-5 left-1/2"
        />
      </div>

      <Accordion type="single" collapsible className="w-full mx-auto md:w-3/4">
        {data.map((item, index) => (
          <AccordionItem
            className="p-1 px-4 mb-1 bg-white rounded-lg shadow"
            key={index}
            value={`item-${index + 1}`}
          >
            <AccordionTrigger className="hover:no-underline">
              {item.question}
            </AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </MotionSection>
  )
}
