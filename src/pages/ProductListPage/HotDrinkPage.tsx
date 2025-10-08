import HotDrinkList from './HotDrinkList';

export default function HotDrinkPage() {
  return (
    <>
      {/* Banner Hero */}
      <section className="relative w-full h-64 sm:h-80 overflow-hidden mb-8">
        <img
          src="/images/coffee/latte-nong.webp"
          alt="Hot Drinks Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex flex-col items-center justify-center text-center text-white">
          <h1 className="text-4xl sm:text-5xl font-extrabold drop-shadow-lg tracking-wide">
                        Đồ uống nóng
          </h1>
          <p className="text-gray-200 mt-2 text-sm sm:text-base max-w-md">
                        Ấm áp, đậm đà và tinh tế — hương vị cà phê đánh thức buổi sáng của bạn.
          </p>
        </div>
      </section>

      {/* Nội dung danh mục */}
      <div className="max-w-screen-lg mx-auto px-4">
        <div className="flex items-center gap-2 mb-6">
          <img src="/images/app-logo.svg" className="w-6 h-6" alt="Coffee Icon" />
          <h2 className="text-2xl font-bold text-primary">Danh sách đồ uống nóng</h2>
        </div>

        <div className="bg-white rounded-3xl shadow-md p-4 sm:p-6 border border-primary/10">
          <HotDrinkList />
        </div>

        {/* Divider trang trí */}
        <div className="mt-12 mb-6 border-t border-primary/20 relative">
          <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-[#faf7f5] text-primary font-medium px-3">
                        ☕ Tận hưởng từng ngụm
          </span>
        </div>

        <p className="text-center text-gray-500 text-sm mb-8">
                    Coffee Shop — nơi hương vị được ủ bằng đam mê.
        </p>
      </div>
    </>
  );
}
