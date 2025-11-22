const CategoryGrid = () => {
  const categories = [
    { id: 1, name: 'เสื้อผ้าแฟชั่น', icon: '👕' },
    { id: 2, name: 'อิเล็กทรอนิกส์', icon: '📱' },
    { id: 3, name: 'เครื่องสำอาง', icon: '💄' },
    { id: 4, name: 'อาหาร & เครื่องดื่ม', icon: '🍔' },
    { id: 5, name: 'แม่และเด็ก', icon: '👶' },
    { id: 6, name: 'บ้านและสวน', icon: '🏠' },
    { id: 7, name: 'กีฬาและกิจกรรม', icon: '⚽' },
    { id: 8, name: 'หนังสือ', icon: '📚' },
    { id: 9, name: 'เครื่องประดับ', icon: '💍' },
    { id: 10, name: 'สัตว์เลี้ยง', icon: '🐶' },
  ];

  return (
    <div className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-gray-500 uppercase text-sm mb-4 font-semibold">หมวดหมู่</h2>
        <div className="grid grid-cols-5 md:grid-cols-10 gap-4">
          {categories.map((category) => (
            <a
              key={category.id}
              href={`/category/${category.id}`}
              className="flex flex-col items-center justify-center p-3 hover:shadow-md transition-shadow group"
            >
              <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                {category.icon}
              </div>
              <span className="text-xs text-center text-gray-700 group-hover:text-[#ee4d2d]">
                {category.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryGrid;