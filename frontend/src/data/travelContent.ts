export type RegionId = 'all' | 'north' | 'central' | 'south' | 'islands';

export interface ExploreDestination {
  id: string;
  name: string;
  province: string;
  region: Exclude<RegionId, 'all'>;
  image: string;
  alt: string;
  description: string;
  detail: string;
}

export const regionLabels: Record<RegionId, string> = {
  all: 'Tất cả',
  north: 'Miền Bắc',
  central: 'Miền Trung',
  south: 'Miền Nam',
  islands: 'Biển đảo',
};

export const exploreDestinations: ExploreDestination[] = [
  {
    id: 'ha-giang',
    name: 'Hà Giang',
    province: 'Hà Giang',
    region: 'north',
    image: '/images/ha-giang.webp',
    alt: 'Con đường đèo uốn lượn giữa núi đá xanh ở Hà Giang',
    description: 'Những cung đèo mở ra liên tiếp giữa cao nguyên đá và thung lũng sâu.',
    detail: 'Mã Pí Lèng · Sông Nho Quế',
  },
  {
    id: 'ninh-binh',
    name: 'Ninh Bình',
    province: 'Ninh Bình',
    region: 'north',
    image: '/images/ninh-binh.webp',
    alt: 'Đoàn thuyền trên dòng sông xanh giữa núi đá vôi Ninh Bình',
    description: 'Đi thuyền chậm giữa núi đá vôi, đồng lúa và những khoảng xanh yên tĩnh.',
    detail: 'Tràng An · Tam Cốc',
  },
  {
    id: 'hoi-an',
    name: 'Hội An',
    province: 'Quảng Nam',
    region: 'central',
    image: '/images/hoi-an.webp',
    alt: 'Nhà cổ tường vàng, đèn lồng và cờ Việt Nam ở Hội An',
    description: 'Một nhịp phố vừa đủ chậm, từ hiên nhà vàng đến bữa tối bên sông Hoài.',
    detail: 'Phố cổ · Sông Hoài',
  },
  {
    id: 'da-lat',
    name: 'Đà Lạt',
    province: 'Lâm Đồng',
    region: 'south',
    image: '/images/da-lat.webp',
    alt: 'Hồ nước và rừng thông trong sương sớm ở Đà Lạt',
    description: 'Không khí mát, những con dốc nhỏ và khoảng rừng thông cho ngày đi thật chậm.',
    detail: 'Hồ Xuân Hương · Ngoại ô',
  },
  {
    id: 'ho-chi-minh',
    name: 'TP. Hồ Chí Minh',
    province: 'TP. Hồ Chí Minh',
    region: 'south',
    image: '/images/ho-chi-minh.webp',
    alt: 'Đường chân trời TP. Hồ Chí Minh bên sông lúc hoàng hôn',
    description: 'Năng lượng đô thị, những khu phố cũ và một buổi tối luôn còn nhiều lựa chọn.',
    detail: 'Bến Bạch Đằng · Nguyễn Huệ',
  },
  {
    id: 'phu-quoc',
    name: 'Phú Quốc',
    province: 'Kiên Giang',
    region: 'islands',
    image: '/images/phu-quoc.webp',
    alt: 'Bờ biển xanh và hàng dừa ở Phú Quốc',
    description: 'Ngày nắng trên đảo dành cho biển trong, hải sản và những buổi chiều không vội.',
    detail: 'Bãi biển · Nam đảo',
  },
];

export const regionStories = [
  {
    id: 'north' as const,
    title: 'Miền Bắc',
    copy: 'Từ cao nguyên đá Hà Giang đến những dòng sông len qua núi đá vôi Ninh Bình.',
    image: '/images/ninh-binh.webp',
    alt: 'Thuyền đi trên dòng sông xanh giữa núi đá vôi Ninh Bình',
    places: 'Hà Giang · Ninh Bình · Hà Nội · Hạ Long',
  },
  {
    id: 'central' as const,
    title: 'Miền Trung',
    copy: 'Những di sản, bờ biển dài và các thành phố đủ gần để nối thành một hành trình.',
    image: '/images/hoi-an.webp',
    alt: 'Nhà cổ tường vàng và đèn lồng ở Hội An',
    places: 'Huế · Đà Nẵng · Hội An · Quy Nhơn',
  },
  {
    id: 'south' as const,
    title: 'Miền Nam',
    copy: 'Một phía là thành phố luôn chuyển động, một phía là cao nguyên và những ngày dịu mát.',
    image: '/images/ho-chi-minh.webp',
    alt: 'TP. Hồ Chí Minh nhìn từ bên kia sông lúc hoàng hôn',
    places: 'TP. Hồ Chí Minh · Đà Lạt · An Giang',
  },
  {
    id: 'islands' as const,
    title: 'Biển đảo',
    copy: 'Chọn một bờ biển vừa với nhịp nghỉ của bạn, từ chuyến đi ngắn đến kỳ nghỉ dài ngày.',
    image: '/images/phu-quoc.webp',
    alt: 'Bãi biển xanh và hàng dừa ở Phú Quốc',
    places: 'Phú Quốc · Nha Trang · Kỳ Co',
  },
];
