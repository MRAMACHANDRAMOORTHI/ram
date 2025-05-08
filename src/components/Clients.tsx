import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

// Import all client logos directly
// You'll need to create this folder structure in your src folder
import client1 from '../assets/img/clients/1.gif';
import client2 from '../assets/img/clients/2.gif';
import client3 from '../assets/img/clients/3.gif';
import client4 from '../assets/img/clients/4.gif';
import client5 from '../assets/img/clients/5.gif';
import client6 from '../assets/img/clients/6.gif';
import client7 from '../assets/img/clients/7.gif';
import client8 from '../assets/img/clients/8.png';
import client9 from '../assets/img/clients/9.png';
import client10 from '../assets/img/clients/10.png';

// Store the imported images in an array
const clientLogos = [
  client1,
  client2,
  client3,
  client4,
  client5,
  client6, 
  client7,
  client8,
  client9,
  client10,
];

const Clients = () => {
  return (
    <section id="clients" className="clients bg-gray-50 py-16">
      <div className="container mx-auto px-4" data-aos="zoom-in">
        <Swiper
          modules={[Autoplay, Pagination]}
          slidesPerView="auto"
          loop
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          breakpoints={{
            320: { slidesPerView: 2, spaceBetween: 40 },
            480: { slidesPerView: 3, spaceBetween: 60 },
            640: { slidesPerView: 4, spaceBetween: 80 },
            992: { slidesPerView: 6, spaceBetween: 120 },
          }}
          className="clients-slider"
        >
          {clientLogos.map((src, idx) => (
            <SwiperSlide key={idx} className="flex items-center justify-center">
              <div className="h-24 flex items-center justify-center">
                <img 
                  src={src} 
                  className="max-h-16 w-auto object-contain transition-all duration-300 filter-none hover:opacity-75" 
                  alt={`Client ${idx + 1}`} 
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Clients;