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
  duration: string;
  travelStyle: string;
  highlights: string[];
  note: string;
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
    duration: '4–5 ngày',
    travelStyle: 'Dành cho những ngày muốn đi xa và nhìn thật rộng',
    highlights: ['Mã Pí Lèng', 'Sông Nho Quế', 'Phố cổ Đồng Văn'],
    note: 'Hà Giang đẹp nhất khi hành trình còn đủ khoảng thở: dừng ở một khúc cua, uống chén trà nóng và để núi đá dẫn đường.',
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
    duration: '2–3 ngày',
    travelStyle: 'Một khoảng nghỉ ngắn, gần thiên nhiên và vừa đủ chậm',
    highlights: ['Tràng An', 'Tam Cốc', 'Hang Múa'],
    note: 'Một chuyến đi Ninh Bình không cần dày lịch. Buổi sáng ở trên thuyền, buổi chiều nhìn đồng ruộng từ trên cao là đã đủ đầy.',
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
    duration: '2–3 ngày',
    travelStyle: 'Cho người thích đi bộ, ăn ngon và những buổi chiều thong thả',
    highlights: ['Phố cổ Hội An', 'Sông Hoài', 'Làng rau Trà Quế'],
    note: 'Hội An nên được cảm nhận bằng bước chân: qua một hiên nhà, một quán nhỏ và ánh đèn lên dần khi trời tối.',
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
    duration: '3–4 ngày',
    travelStyle: 'Hợp với cặp đôi, nhóm bạn và người muốn đổi nhịp',
    highlights: ['Hồ Xuân Hương', 'Rừng thông ngoại ô', 'Chợ Đà Lạt'],
    note: 'Đà Lạt có nhiều hơn những điểm phải đến. Hãy dành một buổi sáng không vội, chọn quán nhỏ và để sương tan trên sườn đồi.',
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
    duration: '2–3 ngày',
    travelStyle: 'Một cuối tuần nhiều năng lượng, ẩm thực và đời sống thành phố',
    highlights: ['Bến Bạch Đằng', 'Chợ Lớn', 'Những quán ăn trong hẻm'],
    note: 'Thành phố thú vị nhất ở những khoảng chuyển: ly cà phê buổi sáng, bữa trưa trong hẻm và gió sông khi phố bắt đầu lên đèn.',
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
    duration: '3–4 ngày',
    travelStyle: 'Cho kỳ nghỉ có biển, nắng và nhiều thời gian để nghỉ',
    highlights: ['Bãi Sao', 'Nam đảo', 'Làng chài ven biển'],
    note: 'Phú Quốc hợp với một lịch trình nhẹ. Chọn một phía đảo cho mỗi ngày và giữ lại buổi chiều để chỉ ngồi gần mặt nước.',
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
