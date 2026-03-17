import { ChevronLeft, ChevronRight, Heart, Eye } from 'lucide-react';
import { useRef } from 'react';

const Home = () => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 320;
      carouselRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };
  const categories = [
    { name: 'Electronics', image: '/electronic.svg' },
    { name: 'Fashion', image: '/fashion.svg' },
    { name: 'Home Goods', image: '/home.svg' },
    { name: 'Books', image: '/book.svg' },
    { name: 'Groceries', image: '/groceries.svg' },
    { name: 'Sports & Outdoors', image: '/sport.svg' },
    { name: 'Health & Beauty', image: '/health.svg' },
    { name: 'Toys & Games', image: '/toys.svg' }
  ];

  const products = [
    { name: 'Smartphone', price: '$499', image: 'https://picsum.photos/seed/smartphone/400/300', star: 4.5, discount_price: '$399' },
    { name: 'Running Shoes', price: '$89', image: 'https://picsum.photos/seed/shoes/400/300', star: 4.0, discount_price: '$79' },
    { name: 'Coffee Maker', price: '$79', image: 'https://picsum.photos/seed/coffee/400/300', star: 4.2, discount_price: '$69' },
    { name: 'Bluetooth Speaker', price: '$129', image: 'https://picsum.photos/seed/speaker/400/300', star: 4.3, discount_price: '$119' },
    { name: 'Fitness Tracker', price: '$199', image: 'https://picsum.photos/seed/fitness/400/300', star: 4.1, discount_price: '$179' },
    { name: 'Laptop', price: '$999', image: 'https://picsum.photos/seed/laptop/400/300', star: 4.7, discount_price: '$899' },
    { name: 'Headphones', price: '$149', image: 'https://picsum.photos/seed/headphones/400/300', star: 4.4, discount_price: '$129' },
    { name: 'Backpack', price: '$59', image: 'https://picsum.photos/seed/backpack/400/300', star: 4.3, discount_price: '$49' },
    { name: 'Sunglasses', price: '$39', image: 'https://picsum.photos/seed/sunglasses/400/300', star: 4.0, discount_price: '$29' },
    { name: 'Watch', price: '$299', image: 'https://picsum.photos/seed/watch/400/300', star: 4.6, discount_price: '$249' }
  ];

  const recommendedProducts = [
    { name: 'Wireless Earbuds', price: '$99', image: 'https://picsum.photos/seed/earbuds/400/300', star: 4.2, discount_price: '$79' },
    { name: 'Yoga Mat', price: '$29', image: 'https://picsum.photos/seed/yoga/400/300', star: 4.0, discount_price: '$19' },
    { name: 'Electric Kettle', price: '$49', image: 'https://picsum.photos/seed/kettle/400/300', star: 4.3, discount_price: '$39' },
    { name: 'Gaming Mouse', price: '$59', image: 'https://picsum.photos/seed/mouse/400/300', star: 4.5, discount_price: '$49' },
    { name: 'Office Chair', price: '$199', image: 'https://picsum.photos/seed/chair/400/300', star: 4.1, discount_price: '$149' },
    { name: 'Office Chair', price: '$199', image: 'https://picsum.photos/seed/chair/400/300', star: 4.1, discount_price: '$149' },
    { name: 'Office Chair', price: '$199', image: 'https://picsum.photos/seed/chair/400/300', star: 4.1, discount_price: '$149' },
    { name: 'Office Chair', price: '$199', image: 'https://picsum.photos/seed/chair/400/300', star: 4.1, discount_price: '$149' },
    { name: 'Office Chair', price: '$199', image: 'https://picsum.photos/seed/chair/400/300', star: 4.1, discount_price: '$149' },
  ];

  return (
    <div className="flex flex-col items-center justify-center top-0 gap-6">
      <div className="w-full text-center relative">
        <img src="/images/banner.jpg" alt="Welcome to J-Mart" className="w-full h-[500px] object-cover " />
        <div className="absolute w-full h-full top-0 left-0 bg-linear-to-r from-white/70 to-transparent">
          <div className="absolute top-1.5 left-1/4 transform -translate-x-1/2  text-left gap-1 flex flex-col">
            <h1 className="text-6xl font-bold text-gray-800 mt-20 w-2xl">Your Shopping Journey Starts Here</h1>
            <p className="text-lg text-gray-600 w-2xl mt-1.5">
              Discover millions of products, track your orders, and manage your wishlist with ease. Unbeatable deals delivered right to your doorstep.
            </p>
            <button className="bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 transition w-max cursor-pointer">
              Shop All Products
            </button>
          </div>
        </div>
      </div>
      <div className="text-center flex flex-col items-center gap-4">
        <div className="text-4xl font-bold text-gray-800"> Shop by Category</div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 overflow-x-auto w-full py-2 mx-10  rounded-2xl ">
          {categories.map((category) => (
            <div
              key={category.name}
              className="h-40 flex items-center justify-center flex-col rounded-lg overflow-hidden cursor-pointer border-2 border-gray-300 hover:border-amber-500 transition"
            >
              <img src={category.image} alt={category.name} className="w-10 h-10 object-cover mx-auto" />
              <div className="inset-0 mt-1.5 flex items-center justify-center transition-opacity">
                <span className="text-black text-[18px] font-semibold text-center">{category.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center gap-4 py-4 rounded-2xl">
        <div className="text-4xl font-bold text-gray-800 mt-3.5">Featured Products</div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 overflow-x-auto w-full py-2 mx-16  rounded-2xl ">
          {products.map((product) => (
            <div
              key={product.name}
              className="h-80 flex  flex-col rounded-lg overflow-hidden  border-2 border-gray-300 hover:border-amber-500 transition"
            >
              <img src={product.image} alt={product.name} className="w-full h-40 object-cover mx-auto top-0" />
              <div className="mt-2 flex transition-opacity flex-col ml-4 gap-1">
                <span className="text-black text-[18px] font-semibold ">{product.name}</span>
                <div className="space-x-2">
                  <span className="text-amber-500 text-lg font-bold">{product.discount_price}</span>
                  <span className="text-gray-600 text-sm line-through">{product.price}</span>
                </div>
                <div>
                  {' '}
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} className={i < Math.floor(product.star) ? 'text-yellow-400' : 'text-gray-300'}>
                      ★
                    </span>
                  ))}
                  <span className="text-gray-500 text-xs">({product.star})</span>
                </div>
                <div className="flex items-center gap-2 mt-2.5 h-4 justify-between mr-4">
                  <button className="bg-amber-500 text-white px-4 py-1.5 rounded-md hover:bg-amber-600 transition w-max  cursor-pointer">
                    Add to Cart
                  </button>
                  <img src="/view_icon.svg" alt="" className="cursor-pointer" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Information */}
      <div className="w-3/4 text-center mt-8 mb-12">
        <div className="text-4xl font-bold text-gray-800 mt-3.5">Recommended for You</div>
        <div className="relative mt-4 w-70%">
          <button
            onClick={() => handleScroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-2 shadow hover:bg-amber-100 transition"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 cursor-pointer" />
          </button>
          <div ref={carouselRef} className="w-full flex gap-4 overflow-x-auto scroll-smooth py-4 px-10" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {recommendedProducts.map((product) => (
              <div
                key={product.name}
                className="min-w-55 h-80 flex flex-col rounded-xl overflow-hidden border border-gray-200 hover:border-amber-400 hover:shadow-lg transition shrink-0 bg-white relative group"
              >
                <div className="relative">
                  <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
                  <button className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow opacity-0 group-hover:opacity-100 transition">
                    <Heart className="w-4 h-4 text-gray-400 hover:text-red-500 transition" />
                  </button>
                </div>
                <div className="mt-2 flex flex-col px-3 gap-1">
                  <span className="text-gray-800 text-sm font-semibold truncate">{product.name}</span>
                  <div>
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i} className={i < Math.floor(product.star) ? 'text-yellow-400 text-sm' : 'text-gray-300 text-sm'}>
                        ★
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-500 font-bold text-sm">{product.discount_price}</span>
                    <span className="text-gray-400 text-xs line-through">{product.price}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <button className="flex-1 bg-blue-50 text-blue-600 border border-blue-200 text-xs font-semibold py-1.5 rounded-md hover:bg-blue-100 transition cursor-pointer">
                      Add to Cart
                    </button>
                    <button className="border border-gray-200 rounded-md p-1.5 hover:bg-gray-100 transition cursor-pointer">
                      <Eye className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => handleScroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-2 shadow hover:bg-amber-100 transition"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 cursor-pointer" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
