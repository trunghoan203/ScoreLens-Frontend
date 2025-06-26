import React from 'react';

interface ValueCardProps {
  num: string;
  title: string;
  description: string;
}

const ValueCard: React.FC<ValueCardProps> = ({ num, title, description }) => (
  <div className="bg-[#000000] p-8 rounded-xl">
    <div className="text-lime-400 text-2xl font-bold">{num}</div>
    <h3 className="text-2xl font-semibold mt-4">{title}</h3>
    <p className="text-gray-400 mt-2">{description}</p>
  </div>
);

const values: ValueCardProps[] = [
  { num: "01", title: "Giao diện trực quan", description: "" },
  { num: "02", title: "Báo cáo điểm số chi tiết", description: "" },
  { num: "03", title: "Hỗ trợ bảo mật tài khoản", description: "" },
  { num: "04", title: "Hỗ trợ tận tâm", description: "" },
];

export const ValuesSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-left mb-12 text-black">GIÁ TRỊ CỦA CHÚNG TÔI</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value) => (
            <ValueCard key={value.num} {...value} />
          ))}
        </div>
      </div>
    </section>
  );
}; 