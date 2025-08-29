import MotionSection from "@/components/framer-motion/MotionSection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MotionH2 } from "../framer-motion/MotionElm";
import MotionDiv from "../framer-motion/MotionDiv";

type FAQProps = {
  data: {
    question: string;
    answer: string;
  }[];
};

export default function FAQ({ data }: FAQProps) {
  return (
    <MotionSection className="pt-8 mx-auto mt-2 mb-8 h-auto wrapper xl:px-10">
      <MotionH2
        initial={{ opacity: 0.1, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ type: "tween", duration: 0.5 }}
        viewport={{ once: true }}
        className=" text-3xl  max-lg:text-xl max-lg:text-center mt-20 mb-10"
      >
        <span className="font-bold">Got Questions? We've Got Answers!</span>
      </MotionH2>
      <div className="grid grid-cols-1 md:grid-cols-2 w-full  my-4 gap-4  ">
        {data.map((item, index) => (
          <MotionDiv whileHover={{ scale: 1.02 }} duration={0.2}>
            <Accordion type="multiple" className="w-full">
              <AccordionItem
                className="flex flex-col justify-between  p-1 px-4 mb-1 bg-white rounded-lg shadow"
                // h-full
                key={index}
                value={`item-${index + 1}`}
              >
                <AccordionTrigger className="hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            </Accordion>
          </MotionDiv>
        ))}
      </div>
    </MotionSection>
  );
}
