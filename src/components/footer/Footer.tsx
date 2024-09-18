import { Copyright } from 'lucide-react'
import Social from './Social'

export default function Footer() {
  return (
    <footer className="flex flex-col items-center justify-center w-full py-6 text-center text-white bg-black">
      {/* logo */}
      <div className="mb-6 ">
        <figure>
          <img
            src={'/assets/logo/header/header_logo_white.webp'}
            className="w-44"
            alt="Ride Rent Logo"
          />
          <figcaption className="text-sm">
            Quick way to get a <span>Ride On Rent</span>
          </figcaption>
        </figure>
      </div>

      <Social />

      <div className="mx-auto w-[95%] lg:w-[80%]">
        <p>
          Get unbeatable deals on car rentals, chauffeur services, and car with
          driver, alongside bike, yacht, and private Charter/ helicopter
          rentals. Our offerings span a range of options, from budget-friendly
          to premium rentals, in cars, bicycles, motorbikes, speed boats,
          yachts, and charter planes. Operating from Dubai, our services extend
          to selected cities worldwide. Experience convenience and luxury with
          Ride.Rent.com
          <br />
          <br />
          All trademarks utilized within this portal for representation are the
          property fo their respective owners
          <br />
          <br />
          Ride.Rent is a product from the <span className="">Zomy Group</span>
          <br />
          <br />
          <span className="flex-center gap-x-2">
            <Copyright />

            <span className=""> Ride.Rent LLC</span>
          </span>
        </p>
      </div>
    </footer>
  )
}
