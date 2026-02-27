-- LinkedIn'den çekilen şirketlerin Supabase'e aktarımı
-- Tarih: 2026-02-27T12:39:55.046Z
-- Toplam: 100 şirket

-- ON CONFLICT ile duplicate'leri atlayarak ekle

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Software Testing and QA Company | Testbytes',
  'software-testing-and-qa-company-testbytes',
  'ST',
  'Welcome to Testbytes, where our passion for quality and love for testing unite us. At the heart of our community lies a dedication to not just understanding the applications we test but mastering them. Our expertise spans across manual testing, ensuring every detail is meticulously examined; security testing, where we fortify defenses against digital threats; mobile and web app testing, optimizing user experiences across all platforms; and game testing, where we turn play into precision.

Our mi',
  'İstanbul',
  'Teknoloji',
  '201-500',
  'Aktif',
  'https://www.testbytes.net/',
  'https://media.licdn.com/dms/image/v2/C560BAQF7gY-RK2jDCg/company-logo_200_200/company-logo_200_200/0/1639486326954/softwaretestingcompany_logo?e=1773878400&v=beta&t=RZZ2kHrDIlx-XCCwgkyzZESVst8WuRe2nFoGnH1GfWQ',
  'https://linkedin.com/company/softwaretestingcompany/',
  'linkedin-apify',
  '2026-02-27T12:25:28.204Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Software AG',
  'software-ag',
  'SA',
  'Software AG has been helping enterprises run and evolve their core business applications for over 50 years. With a focus on modernization, integration, and long-term value, Software AG enables organizations to stay secure, efficient, and future-ready. Trusted by businesses worldwide, we empower customers to innovate without disruption.',
  'İstanbul',
  'Teknoloji',
  '1001-5000',
  'Aktif',
  'http://www.softwareag.com',
  'https://media.licdn.com/dms/image/v2/C4E0BAQGeaazUDiNLuw/company-logo_200_200/company-logo_200_200/0/1644838132123/software_ag_logo?e=1773878400&v=beta&t=rJ9uEdz1gLl9glCnl2ZzmKRoWEAJogcK9P4MURNWHys',
  'https://linkedin.com/company/software-ag/',
  'linkedin-apify',
  '2026-02-27T12:25:28.204Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Software Mind Americas',
  'software-mind-americas',
  'SM',
  'Software Mind is a global digital transformation partner with operations throughout Europe, the US and LATAM. Driven by tech and empowered by people, we provide companies with software engineers and autonomous, cross-functional development teams who manage software life cycles from ideation to release and beyond. 

For over 20 years we’ve been enriching organizations with the talent they need to boost scalability, drive dynamic growth and bring disruptive ideas to life. Our top-notch engineering',
  'İstanbul',
  'Teknoloji',
  '201-500',
  'Aktif',
  'https://softwaremind.com/',
  'https://media.licdn.com/dms/image/v2/D4D0BAQHic5xYaBAu8Q/company-logo_200_200/company-logo_200_200/0/1727359829405/number_8_it_logo?e=1773878400&v=beta&t=hsoIPyX7rhXSkyZpvn_TB16EE3gaALvU0KMods7tjQI',
  'https://linkedin.com/company/softwaremind-dc-americas/',
  'linkedin-apify',
  '2026-02-27T12:25:28.204Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Software Mind',
  'software-mind',
  'SM',
  'Software Mind is a global digital transformation partner with operations throughout Europe, the US and LATAM. Driven by tech and empowered by people, we provide companies with software engineers and autonomous, cross-functional development teams who manage software life cycles from ideation to release and beyond. 

For over 20 years we’ve been enriching organizations with the talent they need to boost scalability, drive dynamic growth and bring disruptive ideas to life. Our top-notch engineering',
  'İstanbul',
  'Teknoloji',
  '1001-5000',
  'Aktif',
  'http://www.softwaremind.com',
  'https://media.licdn.com/dms/image/v2/C4D0BAQEayyV-_smnVQ/company-logo_200_200/company-logo_200_200/0/1646386545868/software_mind_logo?e=1773878400&v=beta&t=3vFsNkvwInIp13rhEbzsT68edkzqzshQEy6uK16Yd6E',
  'https://linkedin.com/company/software-mind/',
  'linkedin-apify',
  '2026-02-27T12:25:28.204Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Software University (SoftUni)',
  'software-university-softuni',
  'SU',
  'Software University (SoftUni) is as an education initiative for high quality software education, the biggest and most well-respected educational institution in Bulgaria and the region. SoftUni is the organizer of a number of practical training programs, free courses and seminars, events and other educational initiatives that provide thousands of young people in Bulgaria with quality education in the fields of software engineering, IT and digital skills. Learn more at: https://softuni.bg.',
  'İstanbul',
  'Teknoloji',
  '201-500',
  'Aktif',
  'https://softuni.bg',
  'https://media.licdn.com/dms/image/v2/C4D0BAQEApCWzd7I27g/company-logo_200_200/company-logo_200_200/0/1631349197715?e=1773878400&v=beta&t=2pRpkqR3qtFCw5hkSfvqNgaIAgjI7-sHlLdwUP_NcEY',
  'https://linkedin.com/company/software-university-softuni/',
  'linkedin-apify',
  '2026-02-27T12:25:28.204Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Technology & Strategy',
  'technology-strategy',
  'T&',
  'Founded in 2008, Technology and Strategy (T&S) is a global consulting firm specializing in engineering, IT, digital, and project management. We are a trusted partner to our clients on innovative projects, and we have an integrated design office to meet the market''s requirements.

T&S is a people-oriented company with a strong focus on excellence. We share our expertise with a constant concern for transparency, and we have built trusting relationships with major clients in the industrial, automot',
  'İstanbul',
  'Teknoloji',
  '1001-5000',
  'Aktif',
  'https://www.technologyandstrategy.com/',
  'https://media.licdn.com/dms/image/v2/D4E0BAQHn46g5E-Bntw/company-logo_400_400/B4EZpJTV4oGoAY-/0/1762166400692/technology__strategy_ts__logo?e=1773878400&v=beta&t=9YWu2D72zwLggrVHBLDny3_-Vl3SE6rwUjO6Ok8afJk',
  'https://linkedin.com/company/technology-&-strategy-t&s-/',
  'linkedin-apify',
  '2026-02-27T12:25:48.405Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Technology Innovation Institute',
  'technology-innovation-institute',
  'TI',
  'The future doesn’t happen by chance, it’s something we work hard to build.

The Technology Innovation Institute (TII) is a pioneering global research institute that focuses on applied research and new-age technology. TII is the applied research pillar of the Advanced Technology Research Council (ATRC) that was established to drive the R&D strategy of Abu Dhabi and the wider UAE. 

At TII, we attract the brightest scientific minds to help society find solutions to some of its most pressing challe',
  'İstanbul',
  'Teknoloji',
  '1001-5000',
  'Aktif',
  'http://www.tii.ae',
  'https://media.licdn.com/dms/image/v2/C4D0BAQFMXwk2CORyyg/company-logo_200_200/company-logo_200_200/0/1660722787983/tiiuae_logo?e=1773878400&v=beta&t=OkSHxZ4BPo5q-kq6yT29qDBCM69j9MjHhXBMJnK2qto',
  'https://linkedin.com/company/tiiuae/',
  'linkedin-apify',
  '2026-02-27T12:25:48.405Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Walmart',
  'walmart',
  'WA',
  'More than 60 years ago, Sam Walton opened the first Walmart in Rogers, Arkansas. Today, we’re a people-led, tech-powered omnichannel retailer dedicated to helping people save money and live better all around the world.

Our 2.1 million associates are the engine behind what we do — serving customers and members in communities spanning 19 countries, in stores and clubs, online and through a supply chain built for speed and scale.

We’re committed to creating clear pathways for associates to learn,',
  'İstanbul',
  'Perakende',
  '10000+',
  'Aktif',
  'https://bit.ly/3IBowlZ',
  'https://media.licdn.com/dms/image/v2/D560BAQHZkPdlecGssw/company-logo_200_200/company-logo_200_200/0/1736779000209/walmart_logo?e=1773878400&v=beta&t=ZiQePCzSqUIE7ZO5Seyq9dKQ-w4xNMm2LQj1GzsIflM',
  'https://linkedin.com/company/walmart/',
  'linkedin-apify',
  '2026-02-27T12:25:48.405Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Verizon',
  'verizon',
  'VE',
  'We get you. 
You want more out of a career. A place to share your ideas freely — even if they’re daring or different. Where the true you can learn, grow, and thrive. You’ll find all that here.

Because we empower you.
We power and empower how people live, work and play by connecting them to what brings them joy. The same is true inside our walls. We do what we love  — driving innovation, creativity, and impact in the world.

And wherever you go, we got your back.
This is a team sport. Our V Team',
  'İstanbul',
  'Teknoloji',
  '10000+',
  'Aktif',
  'https://mycareer.verizon.com/',
  'https://media.licdn.com/dms/image/v2/D4E0BAQFcVBjsbfJrBQ/company-logo_200_200/company-logo_200_200/0/1719399854965/verizon_logo?e=1773878400&v=beta&t=Bp6v6L_eC1G5xjHxxw6jCYPg7JnCNE1OP3NHqkyOmfE',
  'https://linkedin.com/company/verizon/',
  'linkedin-apify',
  '2026-02-27T12:25:48.405Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'AT&T',
  'at-t',
  'AT',
  'We understand that our customers want an easier, less complicated life.  
 
We’re using our network, labs, products, services, and people to create a world where everything works together seamlessly, and life is better as a result.  How will we continue to drive for this excellence in innovation?
 
With you.
 
Our people, and their passion to succeed, are at the heart of what we do. Today, we’re poised to connect millions of people with their world, delivering the human benefits of technology in',
  'İstanbul',
  'Telekomünikasyon',
  '10000+',
  'Aktif',
  'http://www.att.com',
  'https://media.licdn.com/dms/image/v2/D560BAQETZPIp_rERFA/company-logo_200_200/company-logo_200_200/0/1736396366556/att_logo?e=1773878400&v=beta&t=pySDW-jK06a3tB3zZo4J_iuKv_BAal9-UfT5XrguRls',
  'https://linkedin.com/company/att/',
  'linkedin-apify',
  '2026-02-27T12:25:48.406Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'SaaS Labs',
  'saas-labs',
  'SL',
  'SaaS Labs is all about helping sales and support teams reach their full potential. With our AI-powered communication tools, you can save up to 12 hours a week per agent – that''s more time to respond to customers, connect better, and achieve more.

We''ve already supported 7,000+ companies worldwide. Our team of 300+ passionate individuals is dedicated to creating simple yet powerful communication solutions. Because for us, it''s not just about the tools – it''s about making work more productive and',
  'İstanbul',
  'Teknoloji',
  '201-500',
  'Aktif',
  'http://saaslabs.co',
  'https://media.licdn.com/dms/image/v2/C4D0BAQGBlPV44mfqcw/company-logo_200_200/company-logo_200_200/0/1648559501722/saas_labs_logo?e=1773878400&v=beta&t=UKoJQ0vyV7jsP-AhZpAJ7xX0Cfs3GQz3thbmuCEu794',
  'https://linkedin.com/company/saas-labs/',
  'linkedin-apify',
  '2026-02-27T12:26:08.404Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'SaaS Alliance',
  'saas-alliance',
  'SA',
  'Future of SaaS is a global community where everyone from founders, to senior execs, product pros, commercial leads, talent managers, and investors can network, learn and grow. 

We founded FoSaaS in early 2020,  with a vision of providing the most comprehensive resources, content, and learning materials for SaaS leaders at every stage of growth. And we did just that!

This is why we cover everything from finance and investment to marketing, strategy, customer success, DE&I, and much more. Whethe',
  'İstanbul',
  'Teknoloji',
  '51-200',
  'Aktif',
  'https://saasalliance.io/?utm_source=linkedin&utm_medium=social&utm_campaign=about%20page',
  'https://media.licdn.com/dms/image/v2/D4D0BAQFwHzRbRZ1Wsg/company-logo_200_200/company-logo_200_200/0/1721820030362/saas_alliance_logo?e=1773878400&v=beta&t=lpkVUyWYbkxU_ZmrJhicSfXIQuwFVXA66XYDJ-6bUMw',
  'https://linkedin.com/company/saas-alliance/',
  'linkedin-apify',
  '2026-02-27T12:26:08.404Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'SaaS Capital',
  'saas-capital',
  'SC',
  'SaaS Capital is the leading provider of growth debt designed explicitly for B2B SaaS companies. SaaS Capital’s growth debt is structured to provide a significant source of committed funding, deployment flexibility, and lower overall cost of capital, all while avoiding the loss of control associated with selling equity. SaaS Capital was the first to offer lending alternatives to SaaS businesses based on their future recurring revenue. Since 2007, SaaS Capital has committed more than $375 million ',
  'İstanbul',
  'Finans',
  '11-50',
  'Aktif',
  'http://saas-capital.com',
  'https://media.licdn.com/dms/image/v2/C4E0BAQGg7r2_r2BYEg/company-logo_200_200/company-logo_200_200/0/1630565408014/saas_capital_logo?e=1773878400&v=beta&t=R2oS51mAoTXg6KFSPB88BoMTdzsVAgUmi1oB_DI894g',
  'https://linkedin.com/company/saas-capital/',
  'linkedin-apify',
  '2026-02-27T12:26:08.404Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'SaaS Mantra',
  'saas-mantra',
  'SM',
  'We''re SaaS Mantra, a marketplace for discovering unique software products from all over the world. We''re a small, but mighty team of SaaS enthusiasts on a mission to bring the best products to the spotlight and help businesses of all sizes find the perfect solution for their needs.

We understand that finding the right software for your business can be a daunting task, which is why we''re here to make it easy and efficient. Our marketplace features a wide range of products, including project mana',
  'İstanbul',
  'Teknoloji',
  '11-50',
  'Aktif',
  'https://saasmantra.com/',
  'https://media.licdn.com/dms/image/v2/C560BAQGA-6Nkx1nZEg/company-logo_200_200/company-logo_200_200/0/1630662823349/saas_mantra_logo?e=1773878400&v=beta&t=31MmcimAxkQw3FU8ro_LBEdJYELOukGd-aDeU70QCzA',
  'https://linkedin.com/company/saas-mantra/',
  'linkedin-apify',
  '2026-02-27T12:26:08.404Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'SaaS Academy',
  'saas-academy',
  'SA',
  'Coaching | Content | Community : Your #1 Resource for B2B SaaS Business

Our goal at SaaS Academy is to help 5,000 B2B SaaS founders grow their business beyond what they thought possible with massive impact that ripples out into the world through their team.

Our goals for you inside SaaS Academy:

1. No more 100-hour weeks
2. No more directionless leadership inside your company
3. No more living life stressed out
4. No more second-guessing every decision

We want what you want … a thriving busi',
  'İstanbul',
  'Teknoloji',
  '11-50',
  'Aktif',
  'https://www.saasacademy.com/',
  'https://media.licdn.com/dms/image/v2/D560BAQExlQNE4nkLQA/company-logo_200_200/company-logo_200_200/0/1699283965834/saasacademy_logo?e=1773878400&v=beta&t=LRirJsd_N3lcmHvPX1pf7goJwOGjh_XsEqzHDUZSJCw',
  'https://linkedin.com/company/saasacademy/',
  'linkedin-apify',
  '2026-02-27T12:26:08.404Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Bank of America',
  'bank-of-america',
  'BO',
  'Bank of America is one of the world''s largest financial institutions, serving individuals, small- and middle-market businesses and large corporations with a full range of banking, investing, asset management and other financial and risk management products and services. The company serves approximately 56 million U.S. consumer and small business relationships. It is among the world''s leading wealth management companies and is a global leader in corporate and investment banking and trading.

This',
  'İstanbul',
  'Finans',
  '10000+',
  'Aktif',
  'https://www.bankofamerica.com',
  'https://media.licdn.com/dms/image/v2/C4D0BAQEL1rI2h3XGxg/company-logo_200_200/company-logo_200_200/0/1676325271208/bank_of_america_logo?e=1773878400&v=beta&t=3tZvUCgWpnUWAMAhL_VtZs9tkr4W4s17FJoVgRhaD_4',
  'https://linkedin.com/company/bank-of-america/',
  'linkedin-apify',
  '2026-02-27T12:26:45.438Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Bank Mega',
  'bank-mega',
  'BM',
  'Sebagai bagian dari CT Corp, Bank Mega terus menghadirkan layanan perbankan yang modern, inklusif, dan berorientasi pada kebutuhan masyarakat Indonesia. Mengusung visi “Menjadi Kebanggaan Bangsa”, kami berkomitmen menciptakan nilai tambah bagi nasabah dan karyawan melalui sinergi ekosistem terintegrasi, sekaligus menjadi tempat terbaik bagi talenta untuk tumbuh dan berkontribusi bagi kemajuan bangsa.

Bank Mega juga konsisten mengembangkan layanan perbankan digital dengan menyediakan solusi yang',
  'İstanbul',
  'Finans',
  '10000+',
  'Aktif',
  'http://www.bankmega.com',
  'https://media.licdn.com/dms/image/v2/C560BAQFgNSzajcqHpg/company-logo_200_200/company-logo_200_200/0/1676280826075/pt_bank_mega_tbk_logo?e=1773878400&v=beta&t=1n7QhekWOn1V0qa8IWzgDGGRH1zP3stPn5ct9XGI_G8',
  'https://linkedin.com/company/pt-bank-mega-tbk./',
  'linkedin-apify',
  '2026-02-27T12:26:45.438Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Bank of China',
  'bank-of-china',
  'BO',
  'Bank of China, include BOC Hong Kong, BOC International, BOCG Insurance and other financial institutions, providing a comprehensive range of high-quality financial services to individual and corporate customers as well as financial institutions worldwide.   
Over the past century, Bank of China played an important role in China’s financial history. It was established in 1912 pursuant to the approval of DR. Sun Yat-sen. In the following 37 years  the Bank served as the central bank, internationa',
  'İstanbul',
  'Finans',
  '10000+',
  'Aktif',
  'http://www.boc.cn',
  'https://media.licdn.com/dms/image/v2/C4E0BAQESGRoshOPpWg/company-logo_200_200/company-logo_200_200/0/1631331457284?e=1773878400&v=beta&t=AOQtokVMjoPKPzKJxTFzXJ_VHBCzLUedAoMKLMDQcLY',
  'https://linkedin.com/company/bank-of-china/',
  'linkedin-apify',
  '2026-02-27T12:26:45.438Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Bank of America Merrill Lynch',
  'bank-of-america-merrill-lynch',
  'BO',
  'From local communities to global markets, we are dedicated to shaping the future responsibly and helping clients thrive in a changing world.

“Bank of America Merrill Lynch” is the marketing name for the global banking and global markets businesses of Bank of America Corporation. Bank of America is a marketing name for the Retirement Services business of Bank of America Corporation. Lending, derivatives, and other commercial banking activities are performed globally by banking affiliates of Bank',
  'İstanbul',
  'Finans',
  '10000+',
  'Aktif',
  'http://www.bofaml.com',
  'https://media.licdn.com/dms/image/v2/C560BAQEwSq6HbLmEdQ/company-logo_200_200/company-logo_200_200/0/1631390069758?e=1773878400&v=beta&t=jta99Lsz2oMb8ZRZgTKsHPzLRpR8Qo4kg8ce-QrwIPg',
  'https://linkedin.com/company/bank-of-america-merrill-lynch/',
  'linkedin-apify',
  '2026-02-27T12:26:45.438Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Bank of the West',
  'bank-of-the-west',
  'BO',
  'We help businesses and nonprofits grow, communicate, and succeed — professionally and affordably.

At Ultimate Minds Group, we are a dynamic, multi-sector consulting and marketing firm committed to empowering organizations, entrepreneurs, and social enterprises with the tools, strategies, and insights they need to thrive.

We specialize in business development, nonprofit consulting, marketing strategy, and organizational growth, delivering high-quality professional solutions tailored to your uni',
  'İstanbul',
  'Finans',
  '1001-5000',
  'Aktif',
  '',
  'https://media.licdn.com/dms/image/v2/D560BAQHy8dfwf4lS9w/company-logo_400_400/B56ZoHXOjLIsAY-/0/1761060121085/bank_of_the_west_logo?e=1773878400&v=beta&t=RTSX6U0obef_Df7_Qr1A3JT20Eo7hvcIrEjdTSsbgHg',
  'https://linkedin.com/company/bank-of-the-west/',
  'linkedin-apify',
  '2026-02-27T12:26:45.438Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Finance House',
  'finance-house',
  'FH',
  'Finance House, a first of its kind, independent and diversified financial services company setting new standards in the UAE financial sector. Finance House and its associated entities Insurance House, FH Securities and FH Capital bring together the ‘best-of-breed’ in each discipline, offering innovative and comprehensive products and solutions customized to the needs of our clients, characteristics that distinguish Finance House as a robust player within these markets. The competitive edge that ',
  'İstanbul',
  'Finans',
  '1001-5000',
  'Aktif',
  'https://www.financehouse.ae',
  'https://media.licdn.com/dms/image/v2/D4D0BAQE0ZrcvdATOIw/company-logo_200_200/company-logo_200_200/0/1731494347430/finance_house_llc_logo?e=1773878400&v=beta&t=im1drYQv-gwuN7pW6hpKvLkMGn7suZIjRver8oo2hqs',
  'https://linkedin.com/company/finance-house-llc/',
  'linkedin-apify',
  '2026-02-27T12:27:05.514Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Finance of America',
  'finance-of-america',
  'FO',
  'Finance of America offers innovative retirement financing solutions that are reshaping what financial security and flexibility look like for the modern retiree. 

Finance of America Reverse LLC dba Finance of America (NMLS 2285) is the consumer brand and reverse mortgage operating subsidiary of its parent company, Finance of America Companies Inc. (NYSE: FOA). Finance of America also frequently partners with our employee-led non-profit Finance of America Cares.

Finance of America is a proud equ',
  'İstanbul',
  'Finans',
  '501-1000',
  'Aktif',
  'https://www.financeofamerica.com',
  'https://media.licdn.com/dms/image/v2/D4E0BAQE1FRi3kHgN4A/company-logo_200_200/B4EZvH4.BaHoAM-/0/1768585159153/financeofamerica_logo?e=1773878400&v=beta&t=ry9IKyU8q8Gtk70nrEBLtb6dVO1ze4e3hURnJb1YUlo',
  'https://linkedin.com/company/financeofamerica/',
  'linkedin-apify',
  '2026-02-27T12:27:05.514Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Finance Canada / Finances Canada',
  'finance-canada-finances-canada',
  'FC',
  'The Department helps the Government of Canada develop and implement strong and sustainable economic, fiscal, tax, social, security, international and financial sector policies and programs. 

The Department ensures that ministers are supported with high-quality analysis and advice and it plays an important central agency role, working with other departments to ensure that the government''s agenda is carried out.

Terms and Conditions: https://www.canada.ca/en/department-finance/corporate/terms-co',
  'İstanbul',
  'Finans',
  '501-1000',
  'Aktif',
  'https://fin.canada.ca',
  'https://media.licdn.com/dms/image/v2/C4D0BAQFMPRj-2hrv0A/company-logo_200_200/company-logo_200_200/0/1630552730752/finance_canada_logo?e=1773878400&v=beta&t=vEaKVzgguhgKQnld0nrie4tCGw8nyozcMSA77r6vrp8',
  'https://linkedin.com/company/finance-canada/',
  'linkedin-apify',
  '2026-02-27T12:27:05.514Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'FINANCE Magazin',
  'finance-magazin',
  'FM',
  'Seit mehr als zehn Jahren steht die FINANCE-Redaktion in engem und kritischem Dialog mit CFOs, Banken und Vertretern der Financial Community. Mit Büros in Frankfurt, London und Berlin sind wir die größte CFO-Redaktion in Europa. FINANCE liefert spannende Einblicke in die Finanzwelt und nützliche Tipps für die Arbeit in den Finanzabteilungen großer und mittelständischer Unternehmen – seit Mai 2012 täglich in Beiträgen und Web-TV-Sendungen auf unserer Online-Plattform www.finance-magazin.de und ac',
  'İstanbul',
  'Finans',
  '11-50',
  'Aktif',
  'https://www.finance-magazin.de',
  'https://media.licdn.com/dms/image/v2/C4E0BAQEnO4mOJ2nw7A/company-logo_200_200/company-logo_200_200/0/1630624688106/finance_magazin_logo?e=1773878400&v=beta&t=67JnMx6o8hlE9S_LgKTeLwKYV553Y5LREPAqXCM6Azg',
  'https://linkedin.com/company/finance-magazin/',
  'linkedin-apify',
  '2026-02-27T12:27:05.514Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'bp',
  'bp',
  'BP',
  'Check out our commenting guidelines 👉 bp.com/CommentsGuide',
  'İstanbul',
  'Enerji',
  '10000+',
  'Aktif',
  'http://www.bp.com',
  'https://media.licdn.com/dms/image/v2/D4E0BAQFJIiZN5WCYAA/company-logo_200_200/company-logo_200_200/0/1719826788213/bp_logo?e=1773878400&v=beta&t=klUZuqh6Aq2UfsEJgT6DkSPWp0PZUB1dWZdrAe8u7bo',
  'https://linkedin.com/company/bp/',
  'linkedin-apify',
  '2026-02-27T12:27:05.514Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Insurance Journal',
  'insurance-journal',
  'IJ',
  'Established in 1923 as a small Southern California publication, Insurance Journal magazine and website has grown to become the most widely read and well-respected insurance trade publications in the country, with a bi-weekly circulation of more than 47,000 readers nationwide.

InsuranceJournal.com is the highest-trafficked P/C insurance new website in the world (confirmed by Similarweb.com Aug 2021).

We are a part of Wells Media Group, Inc., a 100% employee-owned company.
',
  'İstanbul',
  'Finans',
  '51-200',
  'Aktif',
  'https://www.insurancejournal.com/',
  'https://media.licdn.com/dms/image/v2/C560BAQHr9HOGJgy5fg/company-logo_200_200/company-logo_200_200/0/1656630863649/insurancejournal_logo?e=1773878400&v=beta&t=QF79qG0Sgp14YOF_y_H4ckuxAxZqeVDmRNUVGhw2Mgo',
  'https://linkedin.com/company/insurancejournal/',
  'linkedin-apify',
  '2026-02-27T12:27:25.583Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Insurance Thought Leadership',
  'insurance-thought-leadership',
  'IT',
  'ITL’s mission is to serve as a catalyst for the insurance and risk management industry by providing a powerful platform to the smartest thought leaders with the best ideas. We help people understand the drivers transforming the industry and connect people in ways that lead to innovation. Some 1,500 world-class thought leaders are working with ITL and have contributed 5,000 articles. They represent organizations that include: Google, Andreessen/Horowitz, Deloitte, Accenture, EY, PwC, Bain, IBM, M',
  'İstanbul',
  'Finans',
  '51-200',
  'Aktif',
  'http://www.insurancethoughtleadership.com',
  'https://media.licdn.com/dms/image/v2/C4D0BAQETmmNwBRHjmA/company-logo_200_200/company-logo_200_200/0/1631366652938/insurance_thought_leadership_logo?e=1773878400&v=beta&t=VEn2oFCTkJiIMqo5jsB3Wd495sltFGP2pT3MR1E0N7Q',
  'https://linkedin.com/company/insurance-thought-leadership/',
  'linkedin-apify',
  '2026-02-27T12:27:25.583Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Insurance Office of America',
  'insurance-office-of-america',
  'IO',
  'Insurance Office of America (IOA) is the fourth largest privately held insurance brokerage in the United States. Founded in 1988, IOA is a recognized leader in providing property and casualty, employee benefits, and personal lines insurance and risk management solutions as well as insurtech innovation. Headquartered in Longwood, Florida, part of the greater Orlando community, IOA has more than 1,300 associates located in over 60 offices in the U.S. and United Kingdom. For more information, visit',
  'İstanbul',
  'Finans',
  '1001-5000',
  'Aktif',
  'http://www.ioausa.com',
  'https://media.licdn.com/dms/image/v2/C4D0BAQHrmB6ZhPRYZw/company-logo_200_200/company-logo_200_200/0/1642372600405/insurance_office_of_america_logo?e=1773878400&v=beta&t=oJPwBKMv1zLcmenB2dPJTUlICHKRxFC8MPQ9hSIYifw',
  'https://linkedin.com/company/insurance-office-of-america/',
  'linkedin-apify',
  '2026-02-27T12:27:25.583Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Insurance Relief',
  'insurance-relief',
  'IR',
  'Insurance Relief was founded by insurance professionals to serve the needs of the insurance industry. We use our extensive understanding of the industry to design effective staffing strategies that help our clients become more productive and efficient. Our specialized expertise also helps us make the best possible matches between insurance organizations and job seekers.',
  'İstanbul',
  'Finans',
  '51-200',
  'Aktif',
  'http://www.insurance-relief.com',
  'https://media.licdn.com/dms/image/v2/C560BAQEMnsvEFEzb9Q/company-logo_200_200/company-logo_200_200/0/1655315493712/insurance_relief_logo?e=1773878400&v=beta&t=cuLbH_6CRHf-pArJxw7sy2IHi5MPUbW0xEyjyEwIIRo',
  'https://linkedin.com/company/insurance-relief/',
  'linkedin-apify',
  '2026-02-27T12:27:25.583Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Insurance Insider',
  'insurance-insider',
  'II',
  'Insurance Insider is the premier digital news and intelligence platform for the London insurance and global reinsurance markets.

Since 1996, Insurance Insider has helped our clients seize new business opportunities and avoid risks by providing breaking news, deep analysis, and actionable insights on the insurance market. Across three products, our intelligence covers the London market, global (re)insurance market, insurance-linked securities market, and US property and casualty market.

Subscri',
  'İstanbul',
  'Teknoloji',
  '51-200',
  'Aktif',
  'http://www.insuranceinsider.com/',
  'https://media.licdn.com/dms/image/v2/D4E0BAQGh5ILm-cnF7Q/company-logo_200_200/company-logo_200_200/0/1688978631912/theinsuranceinsider_logo?e=1773878400&v=beta&t=GB66oENrH0NmGiHPsZqqDXOQ4Lu8NdUhCn0pMU0ahDk',
  'https://linkedin.com/company/theinsuranceinsider/',
  'linkedin-apify',
  '2026-02-27T12:27:25.583Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'E-Commerce & Digital Marketing Association (ECDMA)',
  'e-commerce-digital-marketing-association-ecdma',
  'E&',
  'ECDMA is a global association of e-commerce and digital marketing professionals. We unite professionals from around the world to promote the growth of these industries. We offer a wide range of resources, including education and development, research and analytics, collaboration and networking, and industry representation. ',
  'İstanbul',
  'Perakende',
  '11-50',
  'Aktif',
  'https://ecdma.org',
  '',
  'https://linkedin.com/company/ecdma/',
  'linkedin-apify',
  '2026-02-27T12:27:45.620Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'E-Commerce Brasil',
  'e-commerce-brasil',
  'EB',
  'Somos o maior portal de e-commerce da América Latina. 

Produzimos diariamente artigos técnicos e notícias especializadas sobre o e-commerce no Brasil, além de ministrar cursos, workshops, catálogo de fornecedores, e ser responsável pelos eventos mais procurados dentro do setor. 

Juntos, somamos mais de 100 atividades presenciais e 2,5 mil textos publicados por ano, cada um deles pensado para manter você por dentro de tudo que acontece no comércio eletrônico no Brasil. 

Somos o guia nos negóci',
  'İstanbul',
  'Teknoloji',
  '51-200',
  'Aktif',
  'https://www.ecommercebrasil.com.br',
  'https://media.licdn.com/dms/image/v2/D4D0BAQGRvjk0k-mSHw/company-logo_400_400/B4DZWBm27CG8AY-/0/1741636202655/e_commerce_brasil_logo?e=1773878400&v=beta&t=DO3WAIgpLatlJ3quuOkfgkKKcNwXi6kMrKw9E7FzSxY',
  'https://linkedin.com/company/e-commerce-brasil/',
  'linkedin-apify',
  '2026-02-27T12:27:45.620Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'e-Commerce',
  'e-commerce',
  'E-',
  'We''re passionate about helping businesses thrive in the ever-evolving world of e-commerce. We''re a team of experienced designers, developers, and strategists dedicated to building beautiful, user-friendly online stores that drive sales and cultivate brand loyalty.

Our Approach

We take a collaborative approach to every project, working closely with our clients to understand their vision, target audience, and brand identity. This allows us to develop customized e-commerce solutions that are not ',
  'İstanbul',
  'Teknoloji',
  '1001-5000',
  'Aktif',
  '',
  'https://media.licdn.com/dms/image/v2/C4D0BAQGXea6RIOcP0A/company-logo_200_200/company-logo_200_200/0/1642627557909/ecommerce_logo?e=1773878400&v=beta&t=TNlFHir4G1juMQw-b_9vTZF5BtO_NhUIGg_0PsYdtmE',
  'https://linkedin.com/company/ecommerce/',
  'linkedin-apify',
  '2026-02-27T12:27:45.620Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'E-Commerce Nation',
  'e-commerce-nation',
  'EN',
  'E-commerce Nation is more than an online magazine, it´s the first community specialized in e-commerce and m-commerce (mobile commerce). Since 2015, the E-commerce Nation team has helped different online businesses with quality and accessible articles, as well as attracting experts to share their knowledge with the community. From the creation of an e-commerce to international development, plus many online marketing guides to optimize your business. E-commerce is booming and offers many opportuni',
  'İstanbul',
  'Teknoloji',
  '501-1000',
  'Aktif',
  'http://www.ecommerce-nation.fr',
  'https://media.licdn.com/dms/image/v2/D4E0BAQEd5ZoT1yKNlg/company-logo_100_100/B4EZVgOTXbHcAQ-/0/1741076117288/ecommerce_nation_logo?e=1773878400&v=beta&t=ySuNVgb86AwqIGsSO1XcVOHoth_dJiE43e2_8mziotk',
  'https://linkedin.com/company/ecommerce-nation/',
  'linkedin-apify',
  '2026-02-27T12:27:45.620Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'E-commerce Berlin Expo',
  'e-commerce-berlin-expo',
  'EB',
  'The E-commerce Berlin Expo is the largest pure-play e-commerce event in Germany and the go-to destination for anyone in the industry. It offers a unique blend of exhibition and conference formats, providing visitors with unparalleled opportunities for business growth, knowledge sharing, and networking.

The highly anticipated 10th edition is set to take place on February 17-18, 2026, at Messe Berlin. The event is expected to attract 14,000 attendees, bringing together a diverse and engaged commu',
  'İstanbul',
  'Perakende',
  '11-50',
  'Aktif',
  'https://buff.ly/3GjuRmY ',
  'https://media.licdn.com/dms/image/v2/D4D0BAQHNzUxSPDID2Q/company-logo_200_200/company-logo_200_200/0/1702844800102/e_commerce_berlin_expo_logo?e=1773878400&v=beta&t=MA-T8fwV84pn-m2ISBSTnrkjkQ0ZQIygDUdWLLwh5YM',
  'https://linkedin.com/company/e-commerce-berlin-expo/',
  'linkedin-apify',
  '2026-02-27T12:27:45.620Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'RETAIL SEARCH SRL',
  'retail-search-srl',
  'RS',
  'In 2000, Retail Search Srl understood the importance of retail expansion and rapidly gained renowned recognition as a specialized retail executive search firm. Throughout the years we have established a confidence and authority with our clients, which has led us to expand our search to other functions such as product, sales, operations, etc. 

Through a direct search and an important database, we are able to recruit the best candidates in the following departments:

- Retail
- Sales
- Oper',
  'İstanbul',
  'Perakende',
  '51-200',
  'Aktif',
  'http://www.retailsearch.it',
  'https://media.licdn.com/dms/image/v2/C510BAQFCGnmUaO6F7g/company-logo_200_200/company-logo_200_200/0/1631308395206?e=1773878400&v=beta&t=kzIZt2AXsjelSMol7sUPOqfmTh6_OSaAEOSdgjb8kPY',
  'https://linkedin.com/company/retail-search-srl/',
  'linkedin-apify',
  '2026-02-27T12:28:05.563Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Retail Gazette',
  'retail-gazette',
  'RG',
  'Most industry content treats retail as a single topic. It isn’t. Retail has fractured into complex, technical disciplines; each with distinct challenges, metrics, and commercial realities.

Generic websites force you to sift through irrelevant content to find the 10% that applies to your P&L. We’ve eliminated that waste.

We provide commercial analysis, strategic insight, and industry data to the decision-makers who shape UK retail. Our content is free to access because we believe intelligence s',
  'İstanbul',
  'Perakende',
  '51-200',
  'Aktif',
  'http://www.retailgazette.co.uk',
  'https://media.licdn.com/dms/image/v2/D4E0BAQEoNRkRRn3wTw/company-logo_100_100/B4EZxRBkf8IsAQ-/0/1770885892570/retail_gazette_logo?e=1773878400&v=beta&t=ZzEx6B86tvzHlDGvqK8M6MMFJJtlyurPgq3CiLJwGjE',
  'https://linkedin.com/company/retail-gazette/',
  'linkedin-apify',
  '2026-02-27T12:28:05.563Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Retail Week',
  'retail-week',
  'RW',
  'Retail Week: at the heart of retail.

The UK''s leading provider of retail news, analysis, interviews, data, special reports and events. Find out more at retail-week.com

Retail Week has been at the heart of the industry since 1988, building the networks upon which retail thrives, through essential connections and game-changing insight. Together, we help our customers future-proof the health of retail; for businesses, people and the planet.

Visit retail-week.com for daily news analysis, in-depth',
  'İstanbul',
  'Perakende',
  '51-200',
  'Aktif',
  'http://retail-week.com?utm_source=LinkedIn%20signups&utm_medium=LinkedIn%20%27About%20us%27​&utm_campaign=Capturing%20new%20LI%20names',
  'https://media.licdn.com/dms/image/v2/D4E0BAQHqjSmdFBrCJg/company-logo_200_200/company-logo_200_200/0/1718269632404/retail_week_logo?e=1773878400&v=beta&t=matygsZFgb6XtqOnz6jsp_xt8wTsvzQ-cjCM1i0JDww',
  'https://linkedin.com/company/retail-week/',
  'linkedin-apify',
  '2026-02-27T12:28:05.563Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Retail Insider',
  'retail-insider',
  'RI',
  'The leader in showcasing Canadian retail news, opinions, and analysis. Founded in April 2012, Retail Insider is a Canadian go-to source for information on what''s happening in Canadian retailing. 

Retail Insider features a team of writers, editors and retail analysts from across the country.  Follow our LinkedIn Retail Insider page for the latest in Canadian retail news!

We also publish a daily eNewsletter which can be subscribed at https://www.retail-insider.com/subscribe/

Also connect with u',
  'İstanbul',
  'Perakende',
  '11-50',
  'Aktif',
  'https://www.retail-insider.com',
  'https://media.licdn.com/dms/image/v2/C560BAQGlayMHX1elOQ/company-logo_200_200/company-logo_200_200/0/1630641479312/retail_insider_logo?e=1773878400&v=beta&t=IMkWxzGUK0GZwG-JFZLT7RWtHmKEVpgSqNEAWbQFjHQ',
  'https://linkedin.com/company/retail-insider/',
  'linkedin-apify',
  '2026-02-27T12:28:05.563Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Retail & Hospitality Hub: Supply Chain',
  'retail-hospitality-hub-supply-chain',
  'R&',
  'The Retail & Hospitality Hub is the only resource dedicated to technology thought leadership for retail and hospitality executives, providing content syndication and other performance marketing services for solution providers.',
  'İstanbul',
  'Perakende',
  '201-500',
  'Aktif',
  'https://www.rh-hub.com',
  'https://media.licdn.com/dms/image/v2/C560BAQH-p10rAlQ_1g/company-logo_200_200/company-logo_200_200/0/1661272565477/scbestpractices_logo?e=1773878400&v=beta&t=hsT7iI48o9JwwV_jGrTisJ_-vB8Joc_0MhZFMJY1Alc',
  'https://linkedin.com/company/scbestpractices/',
  'linkedin-apify',
  '2026-02-27T12:28:05.563Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Marketplace Chaplains',
  'marketplace-chaplains',
  'MC',
  'Frontline Care for Your Employees'' Mental Health

Since 1984, Marketplace Chaplains has been serving small-private to large-public companies with a personalized and proactive Employee Care Service delivered by male, female and ethnically diverse Chaplain Care Teams and which is available 24/7/365. We have the lowest Chaplain to Employee ratio with 1 Chaplain per 133 Employees. This allows greater depth of relationships making our service more proactive and not just crisis response.

Marketplace''',
  'İstanbul',
  'Perakende',
  '501-1000',
  'Aktif',
  'http://www.mchapusa.com',
  'https://media.licdn.com/dms/image/v2/C4E0BAQFuHaZDgIacfw/company-logo_200_200/company-logo_200_200/0/1630640420577/marketplace_chaplains_logo?e=1773878400&v=beta&t=wP_518Ls3xjvTAIRKBXBm4_ZuejVssX5Fy7tXMr9ySQ',
  'https://linkedin.com/company/marketplace-chaplains/',
  'linkedin-apify',
  '2026-02-27T12:28:25.634Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Marketplace Events',
  'marketplace-events',
  'ME',
  'Marketplace Events creates vibrant expositions connecting enthusiasts with experts, products and services in dynamic face-to-face environments.  The company produces more than 125 business-to-consumer and trade shows in North America including 65 home and garden shows, 20+ holiday shopping shows, 17 sport and outdoor shows, and 21 regional trade shows. The 125+ combined events, in 50+ markets, currently attract 30,000 exhibitors, 2.2 million attendees and another 5 million unique web visitors an',
  'İstanbul',
  'Perakende',
  '201-500',
  'Aktif',
  'https://www.marketplaceevents.com',
  'https://media.licdn.com/dms/image/v2/C4E0BAQGZAaFX5vn9qg/company-logo_200_200/company-logo_200_200/0/1631307464230?e=1773878400&v=beta&t=QZUna_pFrlcDspbw2DXE6MN893GlnGjjTH4Uh-WBA0k',
  'https://linkedin.com/company/marketplaceevents/',
  'linkedin-apify',
  '2026-02-27T12:28:25.634Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Marketplace Risk',
  'marketplace-risk',
  'MR',
  'Marketplace Risk is the leading global platform dedicated to educating, connecting, and empowering professionals in digital platforms, including marketplaces, fintechs, and platform-based businesses. We focus on digital risk and critical areas such as trust & safety, compliance, fraud prevention, and evolving regulations, helping organizations navigate the complex challenges of the digital economy.

Through our flagship conferences in cities like Austin, London, New York, San Francisco, and São ',
  'İstanbul',
  'Teknoloji',
  '51-200',
  'Aktif',
  'http://www.marketplacerisk.com',
  'https://media.licdn.com/dms/image/v2/C4D0BAQEoRxfTKTk6bg/company-logo_200_200/company-logo_200_200/0/1657807810985/marketplacerisk_logo?e=1773878400&v=beta&t=u3SguaOs89rxC8JOlJdyndFIHUhbOXCodDu13wmeFcY',
  'https://linkedin.com/company/marketplacerisk/',
  'linkedin-apify',
  '2026-02-27T12:28:25.634Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'The Marketplace Guru',
  'the-marketplace-guru',
  'TM',
  'The Marketplace Guru is a full-service E-Commerce Marketplace Accelerator helping consumer brands scale from local to global. We simplify global expansion by managing the complexities of cross-border compliance, logistics, and marketplace operations — so brands can focus on growth.

From strategy to execution, we offer tailored, data-driven solutions that drive sustainable success across international marketplaces. As your end-to-end partner, we’re committed to accelerating sales and long-term p',
  'İstanbul',
  'Teknoloji',
  '51-200',
  'Aktif',
  'www.themarketplaceguru.com',
  'https://media.licdn.com/dms/image/v2/D560BAQGnnW59Vxbvyw/company-logo_100_100/B56Zav1vA9HUAQ-/0/1746706823799/themarketplaceguru_logo?e=1773878400&v=beta&t=7H9nC8wlmu2ZcNgN7jl9ziTokOas_rGOS3ibjGJQnAw',
  'https://linkedin.com/company/themarketplaceguru/',
  'linkedin-apify',
  '2026-02-27T12:28:25.634Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Marketplace B2B Import Export',
  'marketplace-b2b-import-export',
  'MB',
  'Marketplaceb2b.com is an online business to business marketplace that enables companies to advertise their products and services on international basis, meeting the needs of supply and demand in a global market. B2B Import Export is a branch of Eureka Consulting company, specialized in services for import-export for small and medium enterprises. Through our services, enterprises are able to reach quickly and effectively potential markets, developing their exports market and identifying potential',
  'İstanbul',
  'Perakende',
  '11-50',
  'Aktif',
  'http://www.marketplaceb2b.com',
  'https://media.licdn.com/dms/image/v2/C560BAQFfsxDW7rAZ5A/company-logo_200_200/company-logo_200_200/0/1631356188412?e=1773878400&v=beta&t=691fDFe2bSLhzXUUEE1OHG-TDnAm_i9ztJp4bgtalYc',
  'https://linkedin.com/company/b2b-import-export/',
  'linkedin-apify',
  '2026-02-27T12:28:25.634Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Automotive News',
  'automotive-news',
  'AN',
  'Automotive News is the nation''s pre-eminent news source covering the automotive industry serving vehicle manufacturers, suppliers, dealers, marketers, and others allied with the industry since 1925. 

In addition to the weekly award-winning print edition, AutoNews.com provides the most comprehensive automotive updates on the web. A digital edition, daily newscasts: First Shift and AutoNews TV, daily, weekly and breaking news e-mail newsletters, podcasts events and webinars are just some of the o',
  'İstanbul',
  'Teknoloji',
  '1001-5000',
  'Aktif',
  'http://www.autonews.com',
  'https://media.licdn.com/dms/image/v2/D560BAQGPpekaYvF2UA/company-logo_100_100/B56ZvcMdykIYAQ-/0/1768925814314/automotive_news_logo?e=1773878400&v=beta&t=lCyoEyPmkkrQEZRXI_agASX-qMi-vBtq2Gl9UFPiBJI',
  'https://linkedin.com/company/automotive-news/',
  'linkedin-apify',
  '2026-02-27T12:28:45.656Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Automotive Industries',
  'automotive-industries',
  'AI',
  'Today’s carmakers are building 90M+ vehicles per year and are constantly looking for new suppliers, new innovations and cost savings opportunities in today''s difficult market for car makers, new fuel efficient technologies and new suppliers in low labor cost emerging markets.

The auto industry is often considered to be one of the most global of all industries, (see report*) AI offers global media coverage for the industry and can position itself as the “Newsweek” magazine for the industry.

Aut',
  'İstanbul',
  'Otomotiv',
  '501-1000',
  'Aktif',
  'http://www.ai-online.com',
  'https://media.licdn.com/dms/image/v2/C4D0BAQEI_D_-3YPjeg/company-logo_200_200/company-logo_200_200/0/1630551372462/automotive_industries_logo?e=1773878400&v=beta&t=2i_Ag2JiLaXm16wVa9jbY3zxR88MYrPaSvxAVD44RPY',
  'https://linkedin.com/company/automotive-industries/',
  'linkedin-apify',
  '2026-02-27T12:28:45.656Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Automotive Business',
  'automotive-business',
  'AB',
  'Automotive Business é uma empresa de comunicação especializada na indústria automobilística e segmentos relacionados. Os produtos editoriais, digitais ou impressos, são direcionados a profissionais do setor por meio de mailings controlados e website aberto, estimulando a interação B2B, negócios e relacionamentos. 

PRINCIPAIS PRODUTOS 

Revista
Distribuição dirigida a profissionais da indústria automobilística e segmentos relacionados, responsáveis pela tomada de decisões e hábitos de consu',
  'İstanbul',
  'Otomotiv',
  '51-200',
  'Aktif',
  'http://www.automotivebusiness.com.br',
  'https://media.licdn.com/dms/image/v2/D4D0BAQFUes-4FSOBOQ/company-logo_100_100/B4DZxSaP2IHAAQ-/0/1770909138859/automotive_business_logo?e=1773878400&v=beta&t=7dh1sBj8feQoUuZVUKkSjXlZac93XeK0aq79r2MkeGw',
  'https://linkedin.com/company/automotive-business/',
  'linkedin-apify',
  '2026-02-27T12:28:45.656Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'The Car Laundry',
  'the-car-laundry',
  'TC',
  'The Car Laundry started in 2012 as an innovative concept in professional Car Cleaning and Detailing services and manufacturing of Car Care and cleaning products, with a motto to ‘Revolutionize Your Car Washing Experience’.

The Car Laundry has retail stores in 10 cities along with 18 distributors in various states, with a brand presence across 100 cities of India. This was possible due to our constant focus on growing ourselves into a dynamic organization and giving that attention to detail we w',
  'İstanbul',
  'Perakende',
  '11-50',
  'Aktif',
  'http://www.thecarlaundry.com',
  'https://media.licdn.com/dms/image/v2/C4E0BAQG3AKG72aXzsw/company-logo_200_200/company-logo_200_200/0/1630601677107/the_car_laundry_logo?e=1773878400&v=beta&t=w7Iud-KL48A8-UIQoIJcStBFnz7o--6QNq05_fW1kBI',
  'https://linkedin.com/company/the-car-laundry/',
  'linkedin-apify',
  '2026-02-27T12:29:02.529Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'CAR MEDIC',
  'car-medic',
  'CM',
  'Assalamu aalaikum. 

#CAR_MEDIC is an automotive company focusing on repairing and manufacturing automobiles - based products. We are currently operating from Dhaka, distributing our products all over the country.
#CAR_MEDIC started its journey in November, 2021. We usually import Car Scanner (OBD II), GPS, Car air Compressor, Car Battery taster, LPG Conversion kit, Car Projection LED Light, Injector Cleaner, Car Battery charger,  Car cleaner tablets, Car bin and etc.
Our goal is to grow our ser',
  'İstanbul',
  'Otomotiv',
  '1-10',
  'Aktif',
  'http://www.carmedic.com',
  '',
  'https://linkedin.com/company/geartechbd/',
  'linkedin-apify',
  '2026-02-27T12:29:02.529Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'CAR Stamping & Machining',
  'car-stamping-machining',
  'CS',
  'For nearly 35 years, Rochester, NY based CAR Engineering and Manufacturing has been a tool and die manufacturer of stamped and precision machined parts. We have a variety of contract manufacturing capabilities, such as metal stamping, metal forming, Multi-Slide / four slide wire forming, Precision CNC machining, and Wire EDM, and work with a variety of materials such as stainless steel, cold rolled steel, aluminum, copper, brass, plastic, and more. In addition, our talented staff provides enhanc',
  'İstanbul',
  'Otomotiv',
  '51-200',
  'Aktif',
  'http://www.car-eng.com/',
  'https://media.licdn.com/dms/image/v2/D560BAQEbq8xySDE8vA/company-logo_400_400/B56ZnpiigtKMAY-/0/1760559770269/car_engineering_and_manufacturing_inc__logo?e=1773878400&v=beta&t=oslbOMoW5rJdqS7ksV_1Qdn40Wf9lEw7r2SSOn5ireM',
  'https://linkedin.com/company/car-engineering-and-manufacturing-inc-/',
  'linkedin-apify',
  '2026-02-27T12:29:02.529Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Auto Finance News',
  'auto-finance-news',
  'AF',
  'Auto Finance News is the flagship publication for the auto finance industry. Published since 1996, Auto Finance News is the nation’s leading source for news, insights and analysis on automotive lending and leasing. Full of valuable data and exclusive market knowledge, the subscription service, which includes a monthly newsletter and a weekly email Update, guides its subscribers to better performance. 

Auto Finance News is published by Royal Media, an information company based in New York.',
  'İstanbul',
  'Otomotiv',
  '11-50',
  'Aktif',
  'http://www.AutoFinanceNews.net',
  'https://media.licdn.com/dms/image/v2/C4D0BAQGct9ZZ5kKgzg/company-logo_200_200/company-logo_200_200/0/1631361695264?e=1773878400&v=beta&t=HZ4xHfPUlhhq2z1PcM1u9ECLxnbRxIt5MaR_2JZVvuQ',
  'https://linkedin.com/company/autofinancenews/',
  'linkedin-apify',
  '2026-02-27T12:29:22.480Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Auto Care Association',
  'auto-care-association',
  'AC',
  'The Auto Care Association is the voice for the auto care industry—a coast-to-coast network of 500,000 independent manufacturers, distributors, parts stores and repair shops offering quality, choice and innovation for drivers. 

The Auto Care Association keeps its members ahead of the curve so they can continue to serve every kind of vehicle on the road today—providing parts and services designed to make vehicles last longer, perform better and keep drivers safer. 

For more information visit',
  'İstanbul',
  'Otomotiv',
  '201-500',
  'Aktif',
  'http://www.autocare.org',
  'https://media.licdn.com/dms/image/v2/C4D0BAQE7A6lmPa9qog/company-logo_200_200/company-logo_200_200/0/1632256228866/autocareorg_logo?e=1773878400&v=beta&t=nUFIE3Qcq7QE4aw3piW1To0VcT_ol_xq6OLL1dn5Mgk',
  'https://linkedin.com/company/autocareorg/',
  'linkedin-apify',
  '2026-02-27T12:29:22.480Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Auto Driveaway Systems, LLC',
  'auto-driveaway-systems-llc',
  'AD',
  'Auto Driveaway Franchise Systems, LLC,  headquartered in Lombard, IL, is the leading professional vehicle relocation service in the United States. Auto Driveaway primarily serves large corporate fleets as well as vehicle leasing and management companies with fast, safe and reliable door-to-door service nationwide. Services include fleet shipping and fleet management services; single vehicle “door-to-door driveaway” shipping (vehicle driven point-to-point); “truck away” shipping via the industry’',
  'İstanbul',
  'Otomotiv',
  '201-500',
  'Aktif',
  'http://www.autodriveaway.com',
  'https://media.licdn.com/dms/image/v2/D560BAQFOTmvQlNs3Yw/company-logo_200_200/company-logo_200_200/0/1690895723272/auto_driveaway_logo?e=1773878400&v=beta&t=vqOTrykmNjxFUE_bnG7JdVYDmajktUtRiGqqFDk9QJ0',
  'https://linkedin.com/company/auto-driveaway/',
  'linkedin-apify',
  '2026-02-27T12:29:22.480Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Auto Approve',
  'auto-approve',
  'AA',
  'Auto Approve is an auto refinance company that specializes in helping consumers find the best possible vehicle interest rates through its national network of credit unions, banks and finance companies.

Our mission is to make it simple for our customer to save money and enjoy life more. The quote is FREE, let us see what we can save for you.  Fill out the short inquiry at www.autoapprove.com. Refinancing your vehicle has never been easier!',
  'İstanbul',
  'Finans',
  '201-500',
  'Aktif',
  'http://autoapprove.com',
  'https://media.licdn.com/dms/image/v2/C560BAQEz4W8TkRGdRg/company-logo_200_200/company-logo_200_200/0/1654646132133?e=1773878400&v=beta&t=lv17ztvVuJvJBo93N7lj_xK8hLc14-ZR9Ribi82bdCY',
  'https://linkedin.com/company/auto-approve/',
  'linkedin-apify',
  '2026-02-27T12:29:22.480Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Telecommunications Engineering & Architecture Management',
  'telecommunications-engineering-architecture-management',
  'TE',
  'Telecommunications Engineering & Architecture Management (TEAM) is a company built of telecommunications professionals dedicated to bringing more efficient solutions to the industry.  Our combined experience and key partnerships have allowed us to build cutting edge software to automate services and save us time, which in turn shortens your time to NTP. Please don''t hesitate to reach out to one of our TEAM members today to see how we can help your bottom line.  ',
  'İstanbul',
  'Telekomünikasyon',
  '11-50',
  'Aktif',
  'http://www.telecom.team',
  'https://media.licdn.com/dms/image/v2/C560BAQFWaKyu1sToYQ/company-logo_200_200/company-logo_200_200/0/1631387395462?e=1773878400&v=beta&t=SCday242A5OJnl93CRdkcM0wNq8zDlrsaHr7vRPNOjA',
  'https://linkedin.com/company/telecommunications-engineering-&-architecture-management/',
  'linkedin-apify',
  '2026-02-27T12:29:42.480Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Telecommunications Services of Trinidad & Tobago Limited (TSTT)',
  'telecommunications-services-of-trinidad-tobago-limited-tstt',
  'TS',
  'About TSTT:

Telecommunications Services of Trinidad and Tobago Limited is jointly owned by National Enterprises Limited (NEL 51%) and Cable & Wireless (West Indies) Limited, (C&W – 49%). NEL is majority-owned by the Government of Trinidad and Tobago.

Established in 1991, TSTT is the country''s largest provider of communications solutions to the residential and commercial markets and its leading-edge products are designed around an IP-based core infrastructure and marketed under the “bmobile” br',
  'İstanbul',
  'Telekomünikasyon',
  '1001-5000',
  'Aktif',
  'http://www.tstt.co.tt',
  'https://media.licdn.com/dms/image/v2/C560BAQHqfHlV8pGWSQ/company-logo_200_200/company-logo_200_200/0/1631354091769?e=1773878400&v=beta&t=UkuUGqAaJ5B78BFV_2x6MMbeEtQJzEvuWLJ-qi8O3xo',
  'https://linkedin.com/company/tstt/',
  'linkedin-apify',
  '2026-02-27T12:29:42.480Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Telecommunications Industry Association',
  'telecommunications-industry-association',
  'TI',
  'The Telecommunications Industry Association (TIA) - the trusted association for the connected world, represents organizations that enable high-speed communication networks and accelerate next-generation technology innovation. As a member-driven organization, TIA advocates for our industry in the U.S. and internationally, develops critical standards, manages technology programs, and improves business performance, all to advance trusted global connectivity. 

With a global membership of more than ',
  'İstanbul',
  'Telekomünikasyon',
  '201-500',
  'Aktif',
  'http://www.tiaonline.org',
  'https://media.licdn.com/dms/image/v2/C4E0BAQFul4p8BvMKTw/company-logo_200_200/company-logo_200_200/0/1631368758260/tia_telecommunications_industry_association__logo?e=1773878400&v=beta&t=WCTbws0xdkrr7WomiNbSi2Hc8-Bas0otXlGt41Fxqq4',
  'https://linkedin.com/company/tia-telecommunications-industry-association-/',
  'linkedin-apify',
  '2026-02-27T12:29:42.480Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Telecommunications Technical Services',
  'telecommunications-technical-services',
  'TT',
  'Telecommunications Technical Services (TTS) is an international full service Telecommunications Consulting, Engineering, and Implementation company specializing in Cellular and Wireless technologies.

TTS’ focus is to provide industry leading Project Management, Facility Network Implementation, Technical Implementation, Network Deployment, Cell Site Upgrades and a level of Technical Expertise not frequently seen in the marketplace.  Our Management team is comprised of industry leaders in Wireles',
  'İstanbul',
  'Telekomünikasyon',
  '51-200',
  'Aktif',
  'http://www.ttsvc.com',
  'https://media.licdn.com/dms/image/v2/D4E0BAQExiexNQezLbg/company-logo_200_200/company-logo_200_200/0/1728398524336/telecommunications_technical_services_logo?e=1773878400&v=beta&t=uMxv1X6l8CImLzwYVgKNuYtNz6ns296sKxsTuKnD2Jg',
  'https://linkedin.com/company/telecommunications-technical-services/',
  'linkedin-apify',
  '2026-02-27T12:29:42.480Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Telecommunications Regulatory Authority',
  'telecommunications-regulatory-authority',
  'TR',
  'TRA has been established in 2002, to liberalize and promote the telecommunications services in the Sultanate. TRA is committed to develop the telecommunications sector in the Sultanate by regulating and maintaining the telecom services, promoting the interest of telecommunications services providers and beneficiaries, and ensuring that consumers receive international standards of telecommunications services, with a reasonable range of choices at reasonable prices',
  'İstanbul',
  'Telekomünikasyon',
  '201-500',
  'Aktif',
  'http://www.tra.gov.om',
  'https://media.licdn.com/dms/image/v2/C4D0BAQEigxRnHO-MUw/company-logo_200_200/company-logo_200_200/0/1631350519287?e=1773878400&v=beta&t=l65qdUtHWYd7aD3miUDmqNAt-x3Hl6SikfeISdZrUXU',
  'https://linkedin.com/company/telecommunications-regulatory-authority_2/',
  'linkedin-apify',
  '2026-02-27T12:29:42.480Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Orange',
  'orange',
  'OR',
  'Orange is one of the world’s leading telecommunications operators with revenues of 40.3 billion euros in 2024 and 127,000 employees worldwide at 31 December 2024, including 71,000 employees in France. 

The Group has a total customer base of 291 million customers worldwide at 31 December 2024, including 253 million mobile customers and 22 million fixed broadband customers. The Group is present in 26 countries. 
Orange is also a leading provider of global IT and telecommunication services to mult',
  'İstanbul',
  'Telekomünikasyon',
  '10000+',
  'Aktif',
  'https://www.orange.com',
  'https://media.licdn.com/dms/image/v2/C4D0BAQEIG5RkDRNPvg/company-logo_200_200/company-logo_200_200/0/1630485596129/orange_logo?e=1773878400&v=beta&t=I972y49rVTugMpxMWcrrWjxCr7pJgAYBQheURAqyt7k',
  'https://linkedin.com/company/orange/',
  'linkedin-apify',
  '2026-02-27T12:30:02.547Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Telecom Egypt',
  'telecom-egypt',
  'TE',
  'Since its establishment in 1854, Telecom Egypt has played a pivotal role in driving growth within the local ICT market capitalizing on its vast infrastructure, which is one of the largest in the region. Its vast domestic and international infrastructure has helped it serve various customer groups including consumers, enterprises, domestic and international carriers. Through its five business units Telecom Egypt boasts a consolidated top-line of EGP 22.8bn.

In September 2017, Telecom Egypt intro',
  'İstanbul',
  'Telekomünikasyon',
  '10000+',
  'Aktif',
  'http://www.te.eg',
  '',
  'https://linkedin.com/company/telecom-egypt/',
  'linkedin-apify',
  '2026-02-27T12:30:02.547Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Kelly Science, Engineering, Technology & Telecom',
  'kelly-science-engineering-technology-telecom',
  'KS',
  'We are the experts empowering experts.  

At Kelly Science, Engineering, Technology & Telecom, we specialize in connecting brilliant minds with groundbreaking opportunities. From powering advancements in cell & gene therapy to driving innovation in renewable energy and AI, we place the right talent in the right roles to solve the world’s most critical challenges.  
Whether you’re a STEM professional looking to amplify your career or a hiring manager seeking top-tier talent, we offer personalized',
  'İstanbul',
  'Telekomünikasyon',
  '1001-5000',
  'Aktif',
  'https://set.kellyservices.us/',
  'https://media.licdn.com/dms/image/v2/C4E0BAQF0WrtnlIiWiA/company-logo_200_200/company-logo_200_200/0/1630632101064/kelly_science_engineering_technology_logo?e=1773878400&v=beta&t=IVOZIiU1EcbFC0So1GxgozLT6GDYjgDXKhftf3Aqt2s',
  'https://linkedin.com/company/kelly-science-engineering-technology/',
  'linkedin-apify',
  '2026-02-27T12:30:02.547Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'NextGen | GTA: A Kelly Telecom Company',
  'nextgen-gta-a-kelly-telecom-company',
  'N|',
  'As part of KELLY’s SETT (Science, Engineering, Technology, and Telecom) Business Unit, we are committed to providing state-of-the-art digital infrastructure and telecom engineering solutions for legacy, 5G, and private networks. We are a leading provider of comprehensive high-value engineering, technology, and business consulting solutions, and we deliver these through (1) staffing, (2) scope of work, and (3) direct hire services.

Our collective purpose is to connect people to work that inspire',
  'İstanbul',
  'Teknoloji',
  '501-1000',
  'Aktif',
  'http://www.nextgengr.com',
  'https://media.licdn.com/dms/image/v2/D560BAQEQQ4HytwP_Zg/company-logo_100_100/B56ZiAnQqRHUAU-/0/1754504432641/nextgen_gta_logo?e=1773878400&v=beta&t=bhlaN84UOZdPdmVv_ujnAs7X5YS5hVDy9VmiAoBEMIc',
  'https://linkedin.com/company/nextgen-gta/',
  'linkedin-apify',
  '2026-02-27T12:30:02.547Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Telecom Jobs',
  'telecom-jobs',
  'TJ',
  'We strive to be the leading resource for telecom jobs in the UK. As the telecom sector heats up over the coming years we aim to support both jobseekers and employers in matching and introducing the telecom workforce of the future.

Over the coming months we will be developing our online resource which will support jobseekers and employers within the telecom sector. Telecom Jobs and Careers is your go to resource for telecom jobs.

Promoting all jobs within the telecom industry from from leading ',
  'İstanbul',
  'Telekomünikasyon',
  '1001-5000',
  'Aktif',
  'https://telecomjobs.uk',
  'https://media.licdn.com/dms/image/v2/D4E0BAQHI-n_0FE9oEA/company-logo_400_400/B4EZqUJIMIKYAY-/0/1763422012663?e=1773878400&v=beta&t=BDE-uWGytYkjI5ZO0DoZSXQTcOz6Vyp2S7PC5lVEumM',
  'https://linkedin.com/company/telecom-jobs/',
  'linkedin-apify',
  '2026-02-27T12:30:02.547Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Airlines for Europe (A4E)',
  'airlines-for-europe-a4e',
  'AF',
  'A4E represents the united voice of Europe’s leading airlines in Brussels. Our 16 airline group members represent over 80% of European air traffic and carried over 771 million passengers in 2024. Leading global aircraft manufacturers are also members of A4E. Airlines with cargo and mail activities transport more than 4 million tons of goods annually.',
  'İstanbul',
  'Havacılık',
  '11-50',
  'Aktif',
  'http://www.a4e.eu',
  'https://media.licdn.com/dms/image/v2/C560BAQH5cxctgRPYJA/company-logo_200_200/company-logo_200_200/0/1630648566640/airlines_for_europe_a4e_logo?e=1773878400&v=beta&t=adfAFJ2zFSKl3pFpT-jSlKdMqfYWWIdMUjHYrPspPX0',
  'https://linkedin.com/company/airlines-for-europe-a4e/',
  'linkedin-apify',
  '2026-02-27T12:30:19.518Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Airlines Crew Tours',
  'airlines-crew-tours',
  'AC',
  'Airlines Crew Tours (ACT Sri Lanka) – Your Trusted Destination Management Partner

ACT Sri Lanka is a leading Destination Management Company (DMC) specializing in tailor-made travel experiences across Sri Lanka. Our journey began as an exclusive excursion provider for layover airline crew members, delivering seamless, professional, and last-minute travel solutions. Today, we proudly serve crew members from 17 international airlines, making us the preferred choice for airline professionals visiti',
  'İstanbul',
  'Havacılık',
  '1-10',
  'Aktif',
  'https://airlinescrewtours.com/',
  'https://media.licdn.com/dms/image/v2/C4E0BAQG7fRfI-Tef7A/company-logo_200_200/company-logo_200_200/0/1633579149275/airlinescrewtours_logo?e=1773878400&v=beta&t=4eOTWexKUU3wUcmne20S_VScCeq9BXCiKM3evMiOFOs',
  'https://linkedin.com/company/airlinescrewtours/',
  'linkedin-apify',
  '2026-02-27T12:30:19.518Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Airlines Confidential Podcast',
  'airlines-confidential-podcast',
  'AC',
  'Hosted by Scott McCartney, Former Travel Editor/"Middle Seat" Columnist for The Wall Street Journal. Top Stories, C-Suite Guests, Listener Questions.   
The Leading Podcast Reaching Travel Industry Insiders, Frequent Flyers, & Aviation Geeks. Created by Ben Baldanza.',
  'İstanbul',
  'Havacılık',
  '1-10',
  'Aktif',
  'https://www.airlinesconfidential.com',
  'https://media.licdn.com/dms/image/v2/D4E0BAQHvonsO5ljWtw/company-logo_200_200/company-logo_200_200/0/1724245253444/airlinesconfidential_logo?e=1773878400&v=beta&t=YjheqQR88NRg0UNDSp5DJjDOx8Esss_Z8_Ny67M6dVc',
  'https://linkedin.com/company/airlinesconfidential/',
  'linkedin-apify',
  '2026-02-27T12:30:19.518Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Aviation Turkey Magazine',
  'aviation-turkey-magazine',
  'AT',
  'Aviation Magazine, Turkish Aviation , Aviation Industry, Civil Aviation',
  'İstanbul',
  'Havacılık',
  '1-10',
  'Aktif',
  'http://www.aviationturkey.com',
  'https://media.licdn.com/dms/image/v2/C560BAQHjiK2u7S_JdQ/company-logo_200_200/company-logo_200_200/0/1630625540639/aviation_turkey_magazine_logo?e=1773878400&v=beta&t=g7q4tIkjTjuEVwlrABuMAdD1oZ5eI7z-BELwH3f9R2I',
  'https://linkedin.com/company/aviation-turkey-magazine/',
  'linkedin-apify',
  '2026-02-27T12:30:36.368Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Aviation Week Network',
  'aviation-week-network',
  'AW',
  'Aviation Week is the largest multimedia information and services provider for the global aviation, aerospace, and defense industries, serving 1.2 million professionals around the world.
 
Industry professionals rely on Aviation Week to help them understand the market, make decisions, predict trends, and connect with people and business opportunities. Customers include the world''s leading aerospace manufacturers and suppliers, airlines, airports, business aviation operators, militaries, governmen',
  'İstanbul',
  'Havacılık',
  '501-1000',
  'Aktif',
  'http://www.aviationweek.com',
  'https://media.licdn.com/dms/image/v2/D4E0BAQFMNK6vvqfidA/company-logo_100_100/B4EZv5o7gcIEAQ-/0/1769419815381/aviation_week_logo?e=1773878400&v=beta&t=cvtK833ZnI4IsahTBu_a9OAo70WYQ5Vds6iCAmTKfD4',
  'https://linkedin.com/company/aviation-week/',
  'linkedin-apify',
  '2026-02-27T12:30:36.368Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Kroger',
  'kroger',
  'KR',
  'At Kroger, we believe no matter who you are or how you like to shop, everyone deserves affordable, easy-to-enjoy, fresh food. This idea is embodied in our simple tagline—Fresh for Everyone™.  

Kroger ranks as one of the world’s largest retailers. We are nearly half a million associates across 2,800 stores in 35 states operating two dozen grocery retail brands and 34 manufacturing and 44 distribution locations, all dedicated to living our Purpose: to Feed the Human Spirit™. Together, we serve mo',
  'İstanbul',
  'Perakende',
  '10000+',
  'Aktif',
  'http://www.thekrogerco.com',
  'https://media.licdn.com/dms/image/v2/C560BAQHss0K2NdDgcA/company-logo_200_200/company-logo_200_200/0/1634131588725/kroger_logo?e=1773878400&v=beta&t=3kICIFg6IFhUQFhMtYDIXftsCOTJSa9elhOl1Rd2Z-w',
  'https://linkedin.com/company/kroger/',
  'linkedin-apify',
  '2026-02-27T12:30:56.325Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'General Motors',
  'general-motors',
  'GM',
  'General Motors’ vision is to create a world with Zero Crashes, Zero Emissions and Zero Congestion, and we have committed ourselves to leading the way toward this future. Today, we are in the midst of a transportation revolution, and we have the ambition, the talent and the technology to realize the safer, better and more sustainable world we want. As an open, inclusive company, we’re also creating an environment where everyone feels welcomed and valued for who they are. One team, where all ideas',
  'İstanbul',
  'Otomotiv',
  '10000+',
  'Aktif',
  'http://www.gm.com',
  'https://media.licdn.com/dms/image/v2/D4E0BAQEfAZWzerj03w/company-logo_100_100/B4EZdkPGXYGcAQ-/0/1749733370529/general_motors_logo?e=1773878400&v=beta&t=4Ue81ThT77yhR8m0lnoH7PjpKdZLUT6S3MIVwVvE1p4',
  'https://linkedin.com/company/general-motors/',
  'linkedin-apify',
  '2026-02-27T12:30:56.325Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Cardinal Health',
  'cardinal-health',
  'CH',
  'Cardinal Health is a distributor of pharmaceuticals and specialty products; a supplier of home-health and direct-to-patient products and services; an operator of nuclear pharmacies and manufacturing facilities; a provider of performance and data solutions; and a global manufacturer and distributor of medical and laboratory products. Our company’s customer-centric focus drives continuous improvement and leads to innovative solutions that improve people’s lives every day.

Disclaimer: LinkedIn is ',
  'İstanbul',
  'Üretim',
  '10000+',
  'Aktif',
  'http://cardinalhealth.com',
  'https://media.licdn.com/dms/image/v2/D4E0BAQHseggiBegb7A/company-logo_200_200/company-logo_200_200/0/1719772831840/cardinal_health_logo?e=1773878400&v=beta&t=Wr3-c1N7qwJekIiyjjuqo6vJffszFlc0-bxZfh8SZk8',
  'https://linkedin.com/company/cardinal-health/',
  'linkedin-apify',
  '2026-02-27T12:30:56.325Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'MC Steel Turkey',
  'mc-steel-turkey',
  'MS',
  'MC Steel''s hot rolled and cold rolled products operate with the philosophy of being an internationally recognized bright steel producer and meet the bright steel needs of the sectors it serves. The products produced by MC Steel cold drawing are used in various sectors such as automotive, white goods, machinery, aviation, defense and oil industry.
It supplies steel in different diameters and sizes upon request, and offers its products in various quality standards to our valued customers.',
  'İstanbul',
  'Demir Çelik',
  '1-10',
  'Aktif',
  'https://www.mcsteel.com.tr/',
  'https://media.licdn.com/dms/image/v2/D4D0BAQHn1NcSFvqexQ/company-logo_200_200/company-logo_200_200/0/1707409153513/mcsteel_turkey_logo?e=1773878400&v=beta&t=iohzS7qWnE6xj9xip3qLpMXF7FIECopvlm8l94KFTP8',
  'https://linkedin.com/company/mcsteel-turkey/',
  'linkedin-apify',
  '2026-02-27T12:31:16.469Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Steel Dynamics, Inc',
  'steel-dynamics-inc',
  'SD',
  'Steel Dynamics is one of the largest domestic steel producers and metals recyclers in the United States, based on estimated annual steelmaking and metals recycling capability, with facilities located throughout the United States, and in Mexico. Steel Dynamics produces steel products, including hot roll, cold roll, and coated sheet steel, structural steel beams and shapes, rail, engineered special-bar-quality steel, cold finished steel, merchant bar products, specialty steel sections and steel jo',
  'İstanbul',
  'Demir Çelik',
  '1001-5000',
  'Aktif',
  'http://www.steeldynamics.com',
  'https://media.licdn.com/dms/image/v2/C4E0BAQEDPby0xPhylg/company-logo_200_200/company-logo_200_200/0/1630617101001/steel_dynamics_inc_logo?e=1773878400&v=beta&t=DycDxlqs5OTBAAFvjDElBsVzZavNGhXm_c9G8KW8Vfs',
  'https://linkedin.com/company/steel-dynamics-inc/',
  'linkedin-apify',
  '2026-02-27T12:31:16.469Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Textile Exchange',
  'textile-exchange',
  'TE',
  'At Textile Exchange, we’re driving positive impact on climate change across the global textile industry. We believe that climate action starts at the source of the materials we choose.',
  'İstanbul',
  'Tekstil',
  '1001-5000',
  'Aktif',
  'http://www.TextileExchange.org',
  'https://media.licdn.com/dms/image/v2/C4E0BAQEVMcvpzJduOg/company-logo_200_200/company-logo_200_200/0/1643202019210/textile_exchange_logo?e=1773878400&v=beta&t=OT8J7TNvtVaQu6lUgNvgj2KdhjS1iPdfL2HmDiek9dA',
  'https://linkedin.com/company/textile-exchange/',
  'linkedin-apify',
  '2026-02-27T12:31:36.652Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Textile Details',
  'textile-details',
  'TD',
  'Textile Details is a combination of all kinds of textile, apparel as well as a fashion blog. Textile Details is a combo creation of resources by Md Hasan Mahedi. This Textile blog will helpful to textile students as well as professionals. It''s a resource hub for textile learners.',
  'İstanbul',
  'Tekstil',
  '11-50',
  'Aktif',
  'https://textiledetails.com',
  'https://media.licdn.com/dms/image/v2/C560BAQEFmkXThrzs2Q/company-logo_200_200/company-logo_200_200/0/1630670178569/textile_details_logo?e=1773878400&v=beta&t=85rOCD6WDFlNWDpqxVYG9Umm_sMhzMnXH1gRlafd3-Y',
  'https://linkedin.com/company/textile-details/',
  'linkedin-apify',
  '2026-02-27T12:31:36.652Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Textile Job Alert',
  'textile-job-alert',
  'TJ',
  'We are textile job alert, the #1 website in India that only focuses on the textile Industry. Our main objective is to help people associated with the textile industry to find the right job as per their qualifications, experience, location, and age.

So that the candidate can get suitable employment and a company can get good candidates. Textile job alert working in four major segments in the textile industry as follows.

1.) Textile government job updates.
2.) Live interviews with industry leade',
  'İstanbul',
  'Tekstil',
  '501-1000',
  'Aktif',
  'https://textilejobportal.com',
  'https://media.licdn.com/dms/image/v2/D4D0BAQEWubYRT0WoJg/company-logo_200_200/company-logo_200_200/0/1681539451602/textilejobalert_logo?e=1773878400&v=beta&t=XwVk5inI9gF2hwz9fojrdnrsIQTCTOa_3wyLRx2TThA',
  'https://linkedin.com/company/textilejobalert/',
  'linkedin-apify',
  '2026-02-27T12:31:36.652Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Medicure Pharmaceutical Turkey',
  'medicure-pharmaceutical-turkey',
  'MP',
  'Our Company is the exporter and producer of many medicinal products  and  we would like to make our company and its products known to you.

    Since we have recently received many requests for our products from your country, now we are planning to have our products distributed by a well-known
importer/wholesaler.

   If you are interested, we will be happy to send you any further information. We may be available in the near future to discuss the subject with you as well.

   We would lik',
  'İstanbul',
  'İlaç',
  '11-50',
  'Aktif',
  'http://www.medicure.com.tr',
  'https://media.licdn.com/dms/image/v2/C4E0BAQEPs8DPedD2RQ/company-logo_200_200/company-logo_200_200/0/1630648632898/medicure_ilac_logo?e=1773878400&v=beta&t=_IkwCWvURkw0s8TCYa6aE_twWktt31wS7W2h6uzzyhA',
  'https://linkedin.com/company/medicure-ilac/',
  'linkedin-apify',
  '2026-02-27T12:31:56.622Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'HealthCare Recruiters International',
  'healthcare-recruiters-international',
  'HR',
  'HCRI is dedicated to both the healthcare and medical manufacturing recruitment field working with major medical facilities and institutions, as well as pharmaceutical and medical product manufacturers. We focus in the areas of middle, upper and executive management, operations, IT, clinical & technical education, sales support and sales, marketing, R&D, etc. Recruiting for healthcare institutions and medical corporations is our primary business and we have been doing it since 1984.',
  'İstanbul',
  'Sağlık',
  '201-500',
  'Aktif',
  'http://www.hcrnetwork.com',
  'https://media.licdn.com/dms/image/v2/C4E0BAQHBCDpL4uOgDg/company-logo_200_200/company-logo_200_200/0/1631308165802?e=1773878400&v=beta&t=2e2XDGhyx8v0N8rMrs428f6y4Qn7V4iz9Ra4IOvkFV0',
  'https://linkedin.com/company/healthcare-recruiters/',
  'linkedin-apify',
  '2026-02-27T12:32:13.514Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Healthcare Businesswomen’s Association',
  'healthcare-businesswomen-s-association',
  'HB',
  'The Healthcare Businesswomen’s Association (HBA) is a global professional association committed to furthering the advancement and impact of women in the business of healthcare.

Mission
The Healthcare Businesswomen’s Association is a global organization comprised of individuals and organizations in healthcare committed to:

    achieving gender parity in leadership positions
    facilitating career and business connections to accelerate advancement
    providing equitable practices that enable o',
  'İstanbul',
  'Sağlık',
  '501-1000',
  'Aktif',
  'http://www.hbanet.org',
  'https://media.licdn.com/dms/image/v2/C4D0BAQGn4O0gb2tLJQ/company-logo_200_200/company-logo_200_200/0/1631330810755?e=1773878400&v=beta&t=cqjm466uU8m578ENj9un3EwNywVdar2YcHkzV6GC590',
  'https://linkedin.com/company/healthcare-businesswomen-s-association/',
  'linkedin-apify',
  '2026-02-27T12:32:13.514Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Energy Strong',
  'energy-strong',
  'ES',
  'The mission of Energy Strong is to unify the blue and white-collar professionals of Oil and Gas, while fostering community among the Oil and Gas workforce, the supporting-industry workers, and industry supporters. We proudly educate others about the benefits of promoting the advancement of natural resource exploration and extraction in Colorado. Through education and empowerment, we ardently defend any and all attacks against the professionals of the Oil and Gas industry, it’s workers, and their',
  'İstanbul',
  'Enerji',
  '11-50',
  'Aktif',
  'http://www.EnergyStrong.com',
  'https://media.licdn.com/dms/image/v2/C560BAQFKMOT2-ZcjiA/company-logo_200_200/company-logo_200_200/0/1630662291924/energy_strong_usa_logo?e=1773878400&v=beta&t=ud1blnxjPSaSSrP5CtHkH-on26Lkh4t5FTPd_CtMF4o',
  'https://linkedin.com/company/energy-strong-usa/',
  'linkedin-apify',
  '2026-02-27T12:32:33.544Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Energy Impact Partners',
  'energy-impact-partners',
  'EI',
  'Energy Impact Partners LP (EIP) is a global energy technology investor with a proprietary model designed to drive innovation. EIP brings together entrepreneurs and some of the world’s most forward-thinking energy and industrial companies to advance innovation for a better energy future. Investing in venture, growth/private equity and credit, EIP seeks attractive risk-adjusted returns for its investors by leveraging its differentiated strategy and industrial ecosystem. With over 80 corporate part',
  'İstanbul',
  'Enerji',
  '51-200',
  'Aktif',
  'http://www.energyimpactpartners.com',
  'https://media.licdn.com/dms/image/v2/D4E0BAQEP8yuJUGw0Hw/company-logo_200_200/company-logo_200_200/0/1713557767999/energy_impact_partners_logo?e=1773878400&v=beta&t=VkyQMPfg-lPdtCaZJ_RCWOFiK3EbPE93JwYjHZ-Myqw',
  'https://linkedin.com/company/energy-impact-partners/',
  'linkedin-apify',
  '2026-02-27T12:32:33.544Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Energy Intelligence',
  'energy-intelligence',
  'EI',
  'Energy Intelligence is the leading energy information company, helping clients to navigate the changing world of energy with expert news, analysis, research, data and advisory services.

The company has core expertise in oil markets, LNG, the energy transition, geopolitics and competitive intelligence, making it a critical partner for the biggest players in the energy industry.

With a history dating back to 1951 and access to primary sources of data and information, Energy Intelligence helps it',
  'İstanbul',
  'Enerji',
  '51-200',
  'Aktif',
  'http://www.energyintel.com',
  'https://media.licdn.com/dms/image/v2/C4D0BAQHNfDpwDNhoug/company-logo_200_200/company-logo_200_200/0/1630571571147/energy_intelligence_logo?e=1773878400&v=beta&t=2kyDxt411pteBJrQ-BI0MFAZx2JYwvPm6Ng0iMm90vE',
  'https://linkedin.com/company/energy-intelligence/',
  'linkedin-apify',
  '2026-02-27T12:32:33.544Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Oil & Gas Jobs by Rigzone',
  'oil-gas-jobs-by-rigzone',
  'O&',
  'Rigzone is the leading online resource for the oil and gas industry. We connect professionals to the news you are looking for, the job opportunities you want, and the actionable insights and data needed to tackle any industry and career challenges that may come your way. 

We have the largest pool of Oil and Gas talent with the skills and experience you are looking for when and where you need it. Our advanced recruitment and talent brand solutions allow you access a database of over 2 million in',
  'İstanbul',
  'Enerji',
  '1001-5000',
  'Aktif',
  'https://www.rigzone.com/',
  'https://media.licdn.com/dms/image/v2/C560BAQGgmY8xZU2GGg/company-logo_200_200/company-logo_200_200/0/1630608558729/rigzone_logo?e=1773878400&v=beta&t=UmjnqvhHEiYryyuYLbVO3wUueza788gOo1KaiXx0Mco',
  'https://linkedin.com/company/rigzone/',
  'linkedin-apify',
  '2026-02-27T12:32:50.358Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Shell',
  'shell',
  'SH',
  'Shell is a global group of energy and petrochemical companies, employing 96,000 people across 70+ countries. We serve around 1 million commercial and industrial customers, and around 33 million customers daily at our Shell-branded retail service stations.

Our purpose is to power progress together by working with each other, our customers and our partners. #PoweringProgress',
  'İstanbul',
  'Enerji',
  '10000+',
  'Aktif',
  'http://www.shell.com',
  'https://media.licdn.com/dms/image/v2/C4D0BAQGN30g7aSl4NA/company-logo_200_200/company-logo_200_200/0/1631303787196?e=1773878400&v=beta&t=Idnui5Teqm_wubLgsv3PuM3JaIC0TlAgIO6k6-C5sdI',
  'https://linkedin.com/company/shell/',
  'linkedin-apify',
  '2026-02-27T12:32:50.358Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Food & Beverage Solutions from Rockwell Automation',
  'food-beverage-solutions-from-rockwell-automation',
  'F&',
  'From raw materials and ingredient processing to manufacturing, packaging and finishing. We provide complete automated solutions, to operate safe, efficient plants that deliver high-quality products.',
  'İstanbul',
  'Gıda',
  '51-200',
  'Aktif',
  'http://www.rockwellautomation.com/global/industries/food-beverage/overview.page',
  'https://media.licdn.com/dms/image/v2/C560BAQGqCK_IEXMVEw/company-logo_200_200/company-logo_200_200/0/1630622556265/rockwell_automation_food__beverage_logo?e=1773878400&v=beta&t=XY5wLJrbehOW8_C_BchhOnpxakgYqttKWD2Y9HytV6g',
  'https://linkedin.com/company/rockwell-automation-food-&-beverage/',
  'linkedin-apify',
  '2026-02-27T12:33:07.282Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Food and Beverage Technology Review',
  'food-and-beverage-technology-review',
  'FA',
  'Food and Beverage Technology Review is a premier print and digital publication dedicated to exploring the industry''s latest tech trends, innovations, insights and solutions. Our unique peer-to-peer learning approach equips readers with insider information from the food and beverage space, curated by senior decision makers and industry leaders.',
  'İstanbul',
  'Gıda',
  '11-50',
  'Aktif',
  'https://www.fbtechreview.com/',
  'https://media.licdn.com/dms/image/v2/D560BAQGnwW4LumKbyA/company-logo_200_200/company-logo_200_200/0/1715255423492/food_and_beverage_tech_review_logo?e=1773878400&v=beta&t=9_H1nd_hM8GydlgR-A-M_i6xFpub_xdEa1YsZHuUcs0',
  'https://linkedin.com/company/food-and-beverage-tech-review/',
  'linkedin-apify',
  '2026-02-27T12:33:07.282Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Food and Beverage Magazine',
  'food-and-beverage-magazine',
  'FA',
  'Food & Beverage Magazine© is the first name in the B2B Foodservice/Hospitality information highway. Serving our readers the informational needs of the entire full-service segment of the industry while, keeping our readers on the cutting edge with authoritative coverage of trends and industry news. Our subscription base consists of industry decision-making professionals including Food & Beverage Directors, Wine Directors, Independent Restaurant Owners and Executive Chefs. Food & Beverage Magazine',
  'İstanbul',
  'Gıda',
  '51-200',
  'Aktif',
  'http://www.fb101.com',
  'https://media.licdn.com/dms/image/v2/C560BAQErrkokaXqShw/company-logo_200_200/company-logo_200_200/0/1630598838509/food_and_beverage_magazine_logo?e=1773878400&v=beta&t=4JWuWteJX8WvK73k3VeffZoLpSH24SWJ_aVmtOEHiY8',
  'https://linkedin.com/company/food-and-beverage-magazine/',
  'linkedin-apify',
  '2026-02-27T12:33:07.282Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'The Consumer Goods Forum',
  'the-consumer-goods-forum',
  'TC',
  'We are the only organisation that brings consumer goods retailers and manufacturers together globally. We are CEO-led and help the world’s retailers and consumer goods manufacturers to collaborate, alongside other key stakeholders, to secure consumer trust and drive positive change, including greater efficiency. With our global reach, CEO leadership and focus on retailer-manufacturer collaboration, we are in a unique position to drive positive change and help address key challenges impacting the',
  'İstanbul',
  'Tüketim',
  '51-200',
  'Aktif',
  'https://www.theconsumergoodsforum.com',
  'https://media.licdn.com/dms/image/v2/C4D0BAQG3vmFAucPjZQ/company-logo_200_200/company-logo_200_200/0/1630480937344/the_consumer_goods_forum_logo?e=1773878400&v=beta&t=fTTGpXlWi0Y-mLzceLmfZxfZSZzhou0OQQ3Z9OAf1mY',
  'https://linkedin.com/company/the-consumer-goods-forum/',
  'linkedin-apify',
  '2026-02-27T12:33:24.152Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Consumer Connection, Inc.',
  'consumer-connection-inc',
  'CC',
  'Consumer Connection is a leading executive search firm specializing in consumer packaged goods (CPG) roles across sales, supply chain, manufacturing, and operations. Partnering with early-stage, Venture Capital, Private Equity, mid-market, and Fortune 500 companies, our expertise is uncovering key talent who elevate your business. 

•	We recruit quality candidates who have not been identified
•	Our applicants consistently raise the bar
•	Prompt completion of search assignments
•	Allows you to co',
  'İstanbul',
  'Tüketim',
  '1-10',
  'Aktif',
  'http://www.ccinc.org',
  'https://media.licdn.com/dms/image/v2/D560BAQFaAG1_11M6-Q/company-logo_200_200/company-logo_200_200/0/1730219849499/consumer_connection_logo?e=1773878400&v=beta&t=ROT57wWF2OlfIIwzNIZMLnManyl8RTRxs4LWTXj2oz8',
  'https://linkedin.com/company/consumer-connection/',
  'linkedin-apify',
  '2026-02-27T12:33:24.152Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Construction Management Association of America (CMAA)',
  'construction-management-association-of-america-cmaa',
  'CM',
  'The Construction Management Association of America (CMAA) is North America’s only organization dedicated exclusively to the interests of professional Construction and Program Management.

CMAA has over 23,000 members from all segments of the construction industry. Members include individual CMs, CM firms, owners, engineers, architects, contractors, educators, and students...everyone with a stake in the construction industry''s success.

For more information on CMAA or the CM industry, please visi',
  'İstanbul',
  'İnşaat',
  '501-1000',
  'Aktif',
  'http://www.cmaanet.org',
  'https://media.licdn.com/dms/image/v2/C4E0BAQHFZ5pCCYxh6A/company-logo_200_200/company-logo_200_200/0/1631331935614?e=1773878400&v=beta&t=adPlpLQQARtZqsXCAZce4hvxek2zePe84HX5zHHZRqQ',
  'https://linkedin.com/company/cmaa/',
  'linkedin-apify',
  '2026-02-27T12:33:44.216Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Construction Engineers',
  'construction-engineers',
  'CE',
  'Headquartered in Grand Forks, ND, Construction Engineers provides Construction Management and Design-Build Services.

Construction Engineers operates a commercial division focusing primarily on office, education, healthcare, and public facilities, as well as an industrial division which builds processing plants and infrastructure systems. We have strong relationships with local and regional government officials, as well as the major subcontractors, suppliers, and vendors in the region.

Our ',
  'İstanbul',
  'İnşaat',
  '501-1000',
  'Aktif',
  'http://www.constructionengineers.com',
  'https://media.licdn.com/dms/image/v2/C560BAQEIzPPkX7CChw/company-logo_200_200/company-logo_200_200/0/1631302277105?e=1773878400&v=beta&t=NpGQ19MKBv_ZIroIFpSOsRE5ps0yM3wy3p_zkZRFtdQ',
  'https://linkedin.com/company/construction-engineers/',
  'linkedin-apify',
  '2026-02-27T12:33:44.216Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Construction Recruiters, Inc.',
  'construction-recruiters-inc',
  'CR',
  'At Construction Recruiters, our goal is to introduce candidates to construction management career opportunities while providing the New England construction industry with top talent. We’re able to do this by leveraging our combined 35+ years of construction recruiting experience.

If you’re currently working and are thinking about making a move, we can help. Give us a call.

We work with a combination of General Contractors, Prime Sub-Contractors, Developer''s and Institutions. We typically w',
  'İstanbul',
  'İnşaat',
  '501-1000',
  'Aktif',
  'http://www.construction-recruiters.com',
  'https://media.licdn.com/dms/image/v2/C4E0BAQHhb8kTfaXs_g/company-logo_200_200/company-logo_200_200/0/1631303197866?e=1773878400&v=beta&t=7lCM9oVQwJNBLUaiswO-jgFNAzfRlE6uaTphLGjt_0U',
  'https://linkedin.com/company/construction-recruiters/',
  'linkedin-apify',
  '2026-02-27T12:33:44.216Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Logistics Executive Group',
  'logistics-executive-group',
  'LE',
  'Welcome to Logistics Executive Group - The hub of your global supply chain.

Logistics Executive Group is a Supply Chain focused recruitment 
 & management consulting firm delivering whole-of-lifecycle business services including Executive Search, Corporate Advisory, Leadership Coaching, and Media.

We are a single source for recruitment, market intelligence,  mergers, acquisitions and merger integration strategy, leadership development, talent acquisition and talent management, we offer a full ',
  'İstanbul',
  'Lojistik',
  '501-1000',
  'Aktif',
  'http://www.LogisticsExecutive.com',
  'https://media.licdn.com/dms/image/v2/D4D0BAQEOuIzvmsetJw/company-logo_200_200/company-logo_200_200/0/1699361321914/logisticsexecutive_logo?e=1773878400&v=beta&t=hY1wbo6niaoRtKwV0S9ZTJKNxAKgHLxSjn1MYfSti78',
  'https://linkedin.com/company/logisticsexecutive/',
  'linkedin-apify',
  '2026-02-27T12:34:01.115Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Charter Link Logistics Turkey',
  'charter-link-logistics-turkey',
  'CL',
  'Charter Link Logistics is a recognized leader in neutral LCL ocean cargo consolidation and NVOCC services, serving the logistics industry and shaping our changing world.
',
  'İstanbul',
  'Lojistik',
  '11-50',
  'Aktif',
  'www.charterlinkgroup.com',
  'https://media.licdn.com/dms/image/v2/D560BAQEQ3GyRVCRi5g/company-logo_200_200/company-logo_200_200/0/1694757245932/charter_link_logistics_turkey_logo?e=1773878400&v=beta&t=lWSiWyS1sbbLm9SIbBvucZcyHAozLs46y67JUsQ7BOM',
  'https://linkedin.com/company/charter-link-logistics-turkey/',
  'linkedin-apify',
  '2026-02-27T12:34:01.115Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Logistics Management Magazine',
  'logistics-management-magazine',
  'LM',
  'Logistics Management serves executives, managers and other professionals in the field of logistics and supply chain management',
  'İstanbul',
  'Lojistik',
  '51-200',
  'Aktif',
  'http://www.logisticsmgmt.com/',
  'https://media.licdn.com/dms/image/v2/C4E0BAQEO6u9b2GyP_Q/company-logo_200_200/company-logo_200_200/0/1631339165623?e=1773878400&v=beta&t=oXvfzxk_3eUAGUZsmtsJUJ8vq29ahca2TJtbHpkdvVI',
  'https://linkedin.com/company/logistics-management-magazine/',
  'linkedin-apify',
  '2026-02-27T12:34:01.115Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'MediaKind',
  'mediakind',
  'ME',
  'MediaKind’s mission is to lead the future of global media technology and be the first choice for service providers, operators, content owners, and broadcasters looking to create and deliver immersive media experiences. 

MediaKind’s end-to-end video delivery solutions include Emmy award-winning video compression solutions for contribution and direct-to-consumer video service distribution, advertising and content personalization solutions, high efficiency cloud DVR, and TV and video delivery plat',
  'İstanbul',
  'Medya',
  '501-1000',
  'Aktif',
  'https://www.mediakind.com/',
  'https://media.licdn.com/dms/image/v2/D4D0BAQFRvXuZ-VH__Q/company-logo_200_200/company-logo_200_200/0/1720097721268/mediakind_logo?e=1773878400&v=beta&t=Lr1wMo5Uz83XOQYTuV8jrYdcxZv-82jYLYEgkynHJdA',
  'https://linkedin.com/company/mediakind/',
  'linkedin-apify',
  '2026-02-27T12:34:20.060Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'MediaPost',
  'mediapost',
  'ME',
  'The media, marketing and advertising professional''s leading resource for complete news coverage, engaging events, and comprehensive industry jobs, directories and research.

Daily news and commentaries along with in-depth industry insider blogs from the trade''s most seasoned journalists and contributors.

MediaPost hosts over 40 industry events per year, including our highly recognizable Insider Summit Series.',
  'İstanbul',
  'Medya',
  '201-500',
  'Aktif',
  'http://www.mediapost.com',
  'https://media.licdn.com/dms/image/v2/C4E0BAQFZXxHTOw1Krg/company-logo_200_200/company-logo_200_200/0/1631330022494?e=1773878400&v=beta&t=DEfhTEgdJDX8HL0_q_V6XNdARABgoLnUyEiD1Wam35o',
  'https://linkedin.com/company/mediapost/',
  'linkedin-apify',
  '2026-02-27T12:34:20.060Z'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  'Tourism Australia',
  'tourism-australia',
  'TA',
  'Tourism Australia is the Australian Government agency responsible for attracting international visitors to Australia, both for leisure and business events. The organisation is active in around 15 key markets and activities include advertising, PR and media programs, trade shows and industry programs, consumer promotions, online communications and consumer research.',
  'İstanbul',
  'Turizm',
  '501-1000',
  'Aktif',
  'http://www.tourism.australia.com',
  'https://media.licdn.com/dms/image/v2/D560BAQEwGJ5lCieG8Q/company-logo_400_400/B56ZhxvgT0HQBs-/0/1754254935768/tourism_australia_logo?e=1773878400&v=beta&t=HpdBnxqLWWkXWKtcw6S8KNv2Z0jxFR3ze2CAKEYJNI8',
  'https://linkedin.com/company/tourism-australia/',
  'linkedin-apify',
  '2026-02-27T12:34:38.124Z'
)
ON CONFLICT (slug) DO NOTHING;
