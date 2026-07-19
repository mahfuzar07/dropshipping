'use client';

import {
  Building2,
  BadgeDollarSign,
  CalendarDays,
  Factory,
  Globe,
  MapPin,
  Package,
  Users,
  Wrench,
  BriefcaseBusiness,
  BadgeCheck,
  Landmark,
} from 'lucide-react';

export default function ShopDetailsPageContent() {
  const shop = {
    title: '中山市电掌盟新能源有限公司',
    desc: '中山市电掌盟新能源有限公司是房车锂电池、220V移动电源、12V锂电池、汽车启动电源等产品专业生产加工的公司，拥有完整、科学的质量管理体系。',

    basicInfo: {
      mainProducts:
        'RV Lithium Battery, 220V Power Bank, 12V Lithium Battery, Car Jump Starter',
      industries: 'Portable Power, Emergency Power, Battery',
      businessModel: 'Manufacturer',
      customService: 'Yes',
      capital: 'RMB 1,000,000',
      founded: '2023',
      address: 'Guangdong, Zhongshan',
      companyType: 'Limited Liability Company',
      registration: '91442000MACDG8ADXC',
    },

    details: {
      processing:
        'OEM, ODM, Sample Processing, Drawing Processing',
      process: 'Soldering',
      employees: '11 - 50',
      rd: '5 - 10',
      factoryArea: '2000㎡',
      salesArea:
        'Worldwide, Europe, America, Middle East, Southeast Asia',
      customers:
        'Outdoor, Emergency Backup, Industrial',
      monthlyOutput: '5000 Units',
      turnover: 'RMB 20M - 30M',
      brand: 'Electric Palm',
    },
  };

  const infoCard = (
    icon: React.ReactNode,
    label: string,
    value: string,
  ) => (
    <div className="flex gap-3 rounded-xl border bg-white p-4 shadow-sm">
      <div className="text-orange-500">{icon}</div>

      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium text-gray-800">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}

      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-2xl">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/20 p-4">
                <Building2 size={36} />
              </div>

              <div>
                <h1 className="text-3xl font-bold">{shop.title}</h1>

                <p className="mt-2 text-orange-100">
                  Professional Manufacturer
                </p>
              </div>
            </div>

            <p className="max-w-4xl leading-8 text-orange-50">
              {shop.desc}
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-8 px-6 py-10">
        {/* Basic */}

        <section className="rounded-2xl bg-white p-8 shadow">
          <h2 className="mb-6 text-2xl font-bold">
            Basic Information
          </h2>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {infoCard(
              <Package />,
              'Main Products',
              shop.basicInfo.mainProducts,
            )}

            {infoCard(
              <Factory />,
              'Industry',
              shop.basicInfo.industries,
            )}

            {infoCard(
              <BriefcaseBusiness />,
              'Business Model',
              shop.basicInfo.businessModel,
            )}

            {infoCard(
              <BadgeCheck />,
              'Customization',
              shop.basicInfo.customService,
            )}

            {infoCard(
              <BadgeDollarSign />,
              'Registered Capital',
              shop.basicInfo.capital,
            )}

            {infoCard(
              <CalendarDays />,
              'Founded',
              shop.basicInfo.founded,
            )}

            {infoCard(
              <MapPin />,
              'Location',
              shop.basicInfo.address,
            )}

            {infoCard(
              <Building2 />,
              'Company Type',
              shop.basicInfo.companyType,
            )}

            {infoCard(
              <Landmark />,
              'Registration',
              shop.basicInfo.registration,
            )}
          </div>
        </section>

        {/* Details */}

        <section className="rounded-2xl bg-white p-8 shadow">
          <h2 className="mb-6 text-2xl font-bold">
            Manufacturing Details
          </h2>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {infoCard(
              <Wrench />,
              'Processing',
              shop.details.processing,
            )}

            {infoCard(
              <Factory />,
              'Process',
              shop.details.process,
            )}

            {infoCard(
              <Users />,
              'Employees',
              shop.details.employees,
            )}

            {infoCard(
              <Users />,
              'R&D Team',
              shop.details.rd,
            )}

            {infoCard(
              <Building2 />,
              'Factory Area',
              shop.details.factoryArea,
            )}

            {infoCard(
              <Globe />,
              'Sales Area',
              shop.details.salesArea,
            )}

            {infoCard(
              <Users />,
              'Customers',
              shop.details.customers,
            )}

            {infoCard(
              <Package />,
              'Monthly Output',
              shop.details.monthlyOutput,
            )}

            {infoCard(
              <BadgeDollarSign />,
              'Annual Turnover',
              shop.details.turnover,
            )}

            {infoCard(
              <BadgeCheck />,
              'Brand',
              shop.details.brand,
            )}
          </div>
        </section>
      </div>
    </div>
  );
}