import MotionDiv from "@/components/framer-motion/MotionDiv";
import { MotionH2 } from "../framer-motion/MotionElm";
import RegisterPageCards from "./RegisterPageCards";
import RegisterPageOnBoardingCards from "./RegisterPageOnBoardingCards";
import RegisterButtonWithDialog from "./RegisterButtonWithDialog";

type WhyJoinProps = {
  country: string;
  data: {
    key: number;
    title: string;
    description: string;
  }[];
};

export default function WhyJoin({ country, data }: WhyJoinProps) {
  return (
    <div className="mx-auto mt-2 mb-8 h-auto wrapper xl:px-10">
      <RegisterPageCards />
      <RegisterButtonWithDialog country={country} />
      <MotionH2
        initial={{ opacity: 0.1, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ type: "tween", duration: 0.5 }}
        viewport={{ once: true }}
        className=" text-3xl  max-lg:text-xl max-lg:text-center mt-20 mb-10"
      >
        <span className="font-bold">
          Join & Maximize Your Fleet’s Performance with Ride.Rent
        </span>
      </MotionH2>
      <div className="grid grid-cols-1 md:grid-cols-2 w-full  my-4 gap-4  ">
        {data.map((feature) => (
          <MotionDiv
            className="border-gray-500/20 shadow-lg p-2 rounded-[1rem] bg-white md:py-2 md:px-4 border-t"
            key={feature.key}
            whileHover={{ scale: 1.02 }}
            duration={0.2}
          >
            <h4 className="mb-2 font-semibold text-center">{feature.title}</h4>
            <p className="text-center text-[0.9rem] text-gray-700 w-full mx-auto md:w-11/12">
              {feature.description}
            </p>
          </MotionDiv>
        ))}
      </div>
      <RegisterPageOnBoardingCards />
      {country === "india" && (
        <p className="mt-8">
          *Indian users can list vehicles individually with a commercial
          registration.
        </p>
      )}
      <RegisterButtonWithDialog country={country} />
    </div>
  );
}
